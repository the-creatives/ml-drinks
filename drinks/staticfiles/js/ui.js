/*
var menu = document.getElementById("fb_photo_menu");
menu.innerHTML = "<div></div>";
var input1 = document.createElement("input");
input1.type = "submit";
input1.value = "Scan all photos";
input1.onclick = batchPostJson;
menu.appendChild(input1);
*/

function getResult(alcohol) {
  if (alcohol > .5) {
    return "<p><h3>Alcohol, " + (alcohol*100).toFixed(2) + "% sure</h3>";
  } else {
    return "<p><h3>No alcohol, " + ((1-alcohol)*100).toFixed(2) + "% sure</h3>";
  }
}

function renderResult(alcohol) {
	document.getElementById("result").innerHTML = getResult(alcohol);
}

function renderIndicoError(error) {
	document.getElementById("result").innerHTML = "<span style='color:red'>Error:</span> We had a problem trying to process your image. Sorry, please try a different one!";
}

function renderBatchResults(fbResults) {
	if (typeof fbResults == 'undefined' || fbResults == null || fbResults == []) {
		return;
	}

    var alcoholCount = 0;
	var cells = [];

	for (var i = 0; i < fbResults.length; i++) {
	  var alcohol = fbResults[i][1]["alcohol"];
	  if (alcohol > .5) {
	    var imageTag = "<img src='" + fbResults[i][0] + "' width='200' />";
	    var resultTag = getResult(alcohol);
	    cells.push(imageTag + "<br />" + resultTag + "<br />");
	    alcoholCount += 1;
	  }
	}

	var tableString = "<table id='fb_photo_grid'>";
	for (var i = 0; i < cells.length; i++) {
	  if (i % 3 === 0) {
	    tableString += "<tr>";
	  }
	  tableString += "<td>";
	  tableString += cells[i];
	  tableString += "</td>";
	  if (i % 3 === 0 && i > 0) {
	    tableString += "</tr>";
	  }
	}
	tableString += "</table>";

	document.getElementById("result").innerHTML += tableString;

	document.getElementById("result").innerHTML += alcoholCount + " out of " + fbResults.length + " Facebook photos contained alcohol.";
}