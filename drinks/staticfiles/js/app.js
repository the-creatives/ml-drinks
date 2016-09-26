/*
If already connected, call predictFBImage
If not, try to log in
*/

function callLoginFunction() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log("We're connected");
            console.log(response);
            predictFBImages(response);
        } else {
            console.log("not logged in");
            initiateFBLogin();
        }
    });
}

/*
Prompt the user to log in, requesting the user_photos scope
*/
function initiateFBLogin() {
    FB.login(function(response) {
        predictFBImages();
    }, {scope: "user_photos"});
}

/*
Logic to handle a textbox URL entry
*/
function predictFBImage(response) {
    console.log("Running predict on response:");
    console.log(response);
    user_id = response.authResponse.userID;
    indicoPredict("https://graph.facebook.com/v2.7/" + user_id + "/picture?width=1000&height=1000");
}

/*
Logic to handle requesting FB images and running predictions
*/
function predictFBImages() {
    console.log("Call predictFBImages");
    //var user_id = response.authResponse.userID;
    var user_id = FB.getUserID();
    if (typeof user_id == 'undefined' || user_id == null || user_id == "") {
        document.getElementById("result").innerHTML = "<p>Please log in.</p>"
        return;
    }
    console.log("Processing batch for " + user_id);
    var oldUrl = "https://graph.facebook.com/v2.7/" + user_id + "/photos";
    getFBImages("/me?fields=id,name,photos.fields(id,images)", []);
}

/*
Allows this app to make JS requests to Django.
*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/*
Takes a single image URL and POSTs it to "/"
Necessary because this function must be triggered 
within Javascript (inside of the callback of Login)
*/

function indicoPredict(imageUrl) {
    var url = "/?url=" + imageUrl;
    window.open(encodeURI(url), "_self");
}

/*
Takes a list of image URLs and submits it as a form.
We pay one indico credit per image submitted.
*/
function batchPredict(list) {
    document.getElementById("result").innerHTML = "<p>Got " + list.length + " photos, checking for alcohol... (may take a minute)</p>";
    batchPostJson(list);
}

/*
Takes a list of image URLs and returns alcohol vs not alcohol results for each.
We pay one indico credit per image submitted.
*/
function batchPostJson(list) {
    console.log("You did it");
    var http = new XMLHttpRequest();
    var url = "/classify/";

    var queryString = "";
    for (var i = 0; i < list.length; i++) {
        queryString += "data=" + encodeURIComponent(list[i]);
        //Append an & except after the last element
        if (i < list.length - 1) {
            queryString += "&";
        }
    }

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (!(/^http:.*/.test(url) || /^https:.*/.test(url))) {
        http.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }

    http.onload = function(e) {
        console.log("Result! " + this.response);
        fbResults = JSON.parse(this.response);
        renderBatchResults(fbResults.list);
    };

    console.log(queryString);

    http.send(queryString);
}

function getFBImages(url, list) {
    FB.api(url, function(response) {
        console.log(response);
        if (!response.hasOwnProperty("photos")) {
            document.getElementById("result").innerHTML = "<p>Could not get photos</p>";
            return;
        }
        for (var obj in response.photos.data) {
            console.log("Extract from object " + obj);
            list.push(response.photos.data[obj].images[0].source);
        }
        console.log(list);
        if (response.photos.paging.hasOwnProperty("next")) {
            getNextFBImages(response.photos.paging.next, list);
        } else {
            batchPredict(list.slice(0,60));
        }
    }, {scope: 'user_photos'});
}

function getNextFBImages(url, list) {
    document.getElementById("result").innerHTML = "<p>Fetched " + list.length + " Facebook photos... (may take a minute)</p>";
    FB.api(url, function(response) {
        console.log(response);
        for (var obj in response.data) {
            console.log("Extract from object " + obj);
            list.push(response.data[obj].images[0].source);
        }
        console.log(list);
        if (response.paging.hasOwnProperty("next")) {
            getNextFBImages(response.paging.next, list);
        } else {
            batchPredict(list.slice(0,60));
        }
    }, {scope: 'user_photos'});
}