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
    var url = "/";
    params = {
        "data": list
    };
    console.log(params);
    submitFormFromJs(url, params, "post");
}

function submitFormFromJs(path, params, method, token) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", JSON.stringify(params[key]));

            form.appendChild(hiddenField);
        }
    }

    var hiddenToken = document.createElement("input");
    hiddenToken.setAttribute("type", "hidden");
    hiddenToken.setAttribute("name", "csrfmiddlewaretoken");
    hiddenToken.setAttribute("value", getCookie('csrftoken'));
    form.appendChild(hiddenToken);

    document.body.appendChild(form);
    form.submit();
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
        queryString += "data=" + list[i];
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
        console.log("Result!" + this.response);
        fbResults = JSON.parse(this.response);
    };

    http.send(queryString);
}

function callLoginFunction() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log("We're connected");
            console.log(response);
            predictFBImage(response);
        } else {
            console.log("not logged in");
            initiateFBLogin();
        }
    });
}

function initiateFBLogin() {
    FB.login(function(response) {
        predictFBImages(response);
    });
}

function predictFBImage(response) {
    document.getElementById("fb_photo_menu").innerHTML = "";
    console.log("Running predict on response:");
    console.log(response);
    user_id = response.authResponse.userID;
    indicoPredict("https://graph.facebook.com/v2.7/" + user_id + "/picture?width=1000&height=1000");
}

function predictFBImages(response) {
    console.log("Call predictFBImages");
    var user_id = response.authResponse.userID;
    console.log("Processing batch for " + user_id);
    var oldUrl = "https://graph.facebook.com/v2.7/" + user_id + "/photos";
    getFBImages("/me?fields=id,name,photos.fields(id,images)", []);
}

function getFBImages(url, list) {
    FB.api(url, function(response) {
        console.log(response);
        for (var obj in response.photos.data) {
            console.log("Extract from object " + obj);
            list.push(response.photos.data[obj].images[0].source);
        }
        console.log(list);
        getNextFBImages(response.photos.paging.next, list);
        //batchPredict(list);
    });
}

function getNextFBImages(url, list) {
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
    });
}