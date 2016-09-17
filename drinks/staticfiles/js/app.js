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
Takes a single image URL and POSTs it to "/"
Necessary because this function must be triggered 
within Javascript (inside of the callback of Login)
*/

function indicoPredict(imageUrl) {
    var url = "/?url=" + imageUrl;
    window.open(url, "_self");
}

/*
Takes a list of image URLs and submits it as a form.
We pay one indico credit per image submitted.
*/
function batchPredict(list) {
    var url = "/";
    params = {"data": list};
    submitFormFromJs(url, params, "post");
}

function submitFormFromJs(path, params, method, token) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

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