fbResults = {}; // results from facebook

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
Takes a list of image URLs and returns alcohol vs not alcohol results for each.
We pay one indico credit per image submitted.
*/
function batchPost(list) {
    console.log("You did it");
    var http = new XMLHttpRequest();
    var url = "/classify/";

    var queryString = "";
    for(var i = 0; i < list.length; i++) {
        queryString += "data=" + list[i];
        //Append an & except after the last element
        if(i < list.length - 1) {
           queryString += "&";
        }
    }

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (!(/^http:.*/.test(url) || /^https:.*/.test(url))) {
     http.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }

    http.onload = function (e) {
        console.log("Result!" + this.response);
        fbResults = JSON.parse(this.response);
    };

    http.send(queryString);
}