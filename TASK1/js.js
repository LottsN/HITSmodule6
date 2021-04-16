//this is the main script file
//it contains all global variables
//creates the grid
//sets initial positions
//controls buttons


var ar = new Array(100);
for (var i = 0; i < 100; i++) {
    ar[i] = new Array(100);
}

var ctx;
var canvas;
var n;
var cellSide;
var hasStart = false;
var hasEnd = false;
var startx = -1;
var starty = -1;
var endx = -1;
var endy = -1;
var painting = false;
var attribute;
var time = 0;
var weight;
var timeoutID = [];
var timeoutPathID = [];
var l = -1;
var k = -1;

//creates gridded canvas
function createMapArray() {
    n = document.getElementById("numb").value;
    console.log("map creation with array loaded");

    hasStart = false;
    hasEnd = false;
    startx = -1;
    starty = -1;
    endx = -1;
    endy = -1;

    var button = document.getElementById("clearPath");
    button.disabled = true;

    button = document.getElementById("startSearch");
    button.disabled = true;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            ar[i][j] = 0;
        }
    }

    canvas = document.querySelector("canvas");

    canvas.width = window.innerHeight - 175;
    canvas.height = canvas.width;

    cellSide = Math.round(canvas.width / n);
    canvas.width = cellSide * n;
    canvas.height = cellSide * n;
    console.log(canvas.width);
    console.log(canvas.width / n);

    ctx = canvas.getContext("2d");

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            drawRec(i, j, "white");
        }
    }

    document.getElementById("informational_text").innerHTML = "Set START and END positions before searching for path.";
}

//when you click add obstacle button
function addObstacle() {
    canvas.removeEventListener("click", clickStart);
    canvas.removeEventListener("click", clickEnd);
    canvas.addEventListener("mousedown", startPos);
    canvas.addEventListener("mouseup", endPos);
    canvas.addEventListener("mousemove", clickObstacle);

    document.getElementById("status").innerHTML = "Adding / Removing Obstacle";
}

function startPos(e) {
    painting = true;

    var x = e.pageX - (window.innerWidth - (canvas.width + 425));
    var y = e.pageY - 135;

    console.log("pageX is at ", e.pageX);
    console.log("canvas width is ", canvas.width);
    console.log("user is at x= ", x, " and y= ", y);

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                if (ar[i][j] == 0) {
                    attribute = "add";
                    ar[i][j] = 1;
                    drawRec(i, j, "#808080");

                    if (i == startx && j == starty) {
                        hasStart = false;
                        startx = -1;
                        starty = -1;
                    }

                    else if (i == endx && j == endy) {
                        hasEnd = false;
                        endx = -1;
                        endy = -1;
                    }

                    return;
                }

                else {
                    attribute = "remove";
                    ar[i][j] = 0;
                    drawRec(i, j, "white");
                    return;
                }
            }
        }
    }
}

function endPos() {
    painting = false;
}

//function that adds obstacle/impassable area on canvas
function clickObstacle(e) {

    if (!painting) return;

    //returns mouse position of user
    var x = e.pageX - (window.innerWidth - (canvas.width + 425));
    var y = e.pageY - 135;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                //adding new obstacle
                if (attribute == "add" && ar[i][j] == 0) {
                    ar[i][j] = 1;
                    drawRec(i, j, "#808080");

                    if (i == startx && j == starty) {
                        hasStart = false;
                        startx = -1;
                        starty = -1;
                    }

                    else if (i == endx && j == endy) {
                        hasEnd = false;
                        endx = -1;
                        endy = -1;
                    }
                }

                //resetting current obstacle
                else if (attribute == "remove" && ar[i][j] == 1) {
                    ar[i][j] = 0;
                    drawRec(i, j, "white");
                }
                return;
            }
        }
    }
}

//when you click add start point button
function addStart() {
    canvas.removeEventListener("mousedown", startPos);
    canvas.removeEventListener("mouseup", endPos);
    canvas.removeEventListener("mousemove", clickObstacle);
    canvas.removeEventListener("click", clickEnd);
    canvas.addEventListener("click", clickStart);

    document.getElementById("status").innerHTML = "Adding Start Point";
}

//function that adds start position on canvas
function clickStart(e) {
    //returns mouse position of user
    var x = e.pageX - (window.innerWidth - (canvas.width + 425));
    var y = e.pageY - 135;

    //searching for correspondant cell that user clicked
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                //adding start pos for first time
                if (!hasStart && (startx != i && starty != j)) {
                    console.log("added start point");
                    ar[i][j] = 0;
                    hasStart = true;
                    startx = i;
                    starty = j;
                    drawRec(startx, starty, "red");
                }

                else if (hasStart && (startx != i || starty != j)) {
                    //removing old start pos
                    clearPath();
                    drawRec(startx, starty, "white");

                    //adding new start pos
                    ar[i][j] = 0;
                    startx = i;
                    starty = j;
                    drawRec(i, j, "red");
                }

                //resetting start pos
                else {
                    hasStart = false;
                    drawRec(i, j, "white");
                    startx = -1;
                    starty = -1;
                    clearPath();
                }

                //checking if interfered with end position
                if(endx == i && endy == j) {
                    hasEnd = false;
                    endx = -1;
                    endy = -1;
                }

                break;
            }
        }
    }

    //checking status' status :)
    if (hasStart == true && hasEnd == true) {
        document.getElementById("informational_text").innerHTML = "Check options and click START SEARCH to start PathFinding Algorithm.";
        const button = document.getElementById("startSearch");
        button.disabled = false;
    }

    else {
        if (hasStart == true && hasEnd == false) {
            document.getElementById("informational_text").innerHTML = "Set END position before searching for path.";
        }
        else if (hasStart == false && hasEnd == true) {
            document.getElementById("informational_text").innerHTML = "Set START position before searching for path.";
        }
        else {
            document.getElementById("informational_text").innerHTML = "Set START and END positions before searching for path.";
        }
        const button = document.getElementById("startSearch");
        button.disabled = true;
    }
}

//when you click add end point button
function addEnd() {
    canvas.removeEventListener("mousedown", startPos);
    canvas.removeEventListener("mouseup", endPos);
    canvas.removeEventListener("mousemove", clickObstacle);
    canvas.removeEventListener("click", clickStart);
    canvas.addEventListener("click", clickEnd);

    document.getElementById("status").innerHTML = "Adding End Point";
}

//function that adds end position on canvas
function clickEnd(e) {
    //returns mouse position of user
    var x = e.pageX - (window.innerWidth - (canvas.width + 425));
    var y = e.pageY - 135;

    //searching for correspondant cell that user clicked
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                //adding end pos for first time
                if (!hasEnd && (endx != i && endy != j)) {
                    ar[i][j] = 0;
                    hasEnd = true;
                    endx = i;
                    endy = j;
                    drawFlag(i, j);
                }

                else if (hasEnd && (endx != i || endy != j)) {
                    //removing old end pos
                    clearPath();
                    drawRec(endx, endy, "white");


                    //adding new end pos
                    ar[i][j] = 0;
                    endx = i;
                    endy = j;
                    drawFlag(i, j);
                }

                //resetting end pos
                else {
                    hasEnd = false;
                    ar[i][j] = 0;
                    drawRec(i, j, "white");
                    endx = -1;
                    endy = -1;
                    clearPath();
                }

                //checking if interfered with start position
                if(startx == i && starty == j) {
                    hasStart = false;
                    startx = -1;
                    starty = -1;
                }

                break;
            }
        }
    }

    //checking status' status :_)
    if (hasStart == true && hasEnd == true) {
        document.getElementById("informational_text").innerHTML = "Check options and click START SEARCH to start PathFinding Algorithm.";
        const button = document.getElementById("startSearch");
        button.disabled = false;
    }

    else {
        if (hasStart == true && hasEnd == false) {
            document.getElementById("informational_text").innerHTML = "Set END position before searching for path.";
        }
        else if (hasStart == false && hasEnd == true) {
            document.getElementById("informational_text").innerHTML = "Set START position before searching for path.";
        }
        else {
            document.getElementById("informational_text").innerHTML = "Set START and END positions before searching for path.";
        }
        const button = document.getElementById("startSearch");
        button.disabled = true;
    }
}

//starts path searching algorithm
function start() {
    canvas.removeEventListener("click", clickObstacle);
    canvas.removeEventListener("click", clickStart);
    canvas.removeEventListener("click", clickEnd);

    document.getElementById("status").innerHTML = "";

    clearPath();

    weight = document.getElementById("astar_weight").value;
    time = 0;

    var src = {
        x: startx,
        y: starty
    }

    var dest = {
        x: endx,
        y: endy
    }

    aStar(ar, src, dest);
}