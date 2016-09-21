var menu = document.getElementById("fb_photo_menu");
menu.innerHTML = "<div></div>";
var input1 = document.createElement("input");
input1.type = "submit";
input1.value = "Scan all photos";
input1.onclick = callLoginFunction;
menu.appendChild(input1);