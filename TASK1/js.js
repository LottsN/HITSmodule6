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

//creates gridded canvas
function createMapArray() {
    n = document.getElementById("numb").value;
    console.log("map creation with array loaded")

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            ar[i][j] = 0;
        }
    }

    canvas = document.querySelector("canvas");

    canvas.width = window.innerWidth - 415;
    canvas.height = canvas.width;

    console.log(canvas.width);
    console.log(canvas.width/n);
    cellSide = Math.round(canvas.width / n);
    canvas.width = cellSide * n;
    canvas.height = cellSide * n;

    ctx = canvas.getContext("2d");

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            let x = j * cellSide;
            let y = i * cellSide;

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.rect(x, y, cellSide, cellSide);
            ctx.fill();
            ctx.stroke();
        }
    }
}

//changes color of cells according to their state
function drawRec(x, y, cellSide, state) {

    ctx.fillStyle = state;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.rect(x * cellSide, y * cellSide, cellSide, cellSide);
    ctx.fill();
    ctx.stroke();
}

//when you click add obstacle button
function addObstacle() {
    canvas.removeEventListener("click", clickStart);
    canvas.removeEventListener("click", clickEnd);
    canvas.addEventListener("mousedown", startPos);
    canvas.addEventListener("mouseup", endPos);
    canvas.addEventListener("mousemove", clickObstacle);
}

function startPos(e) {
    painting = true;

    var x = e.pageX - 22;
    var y = e.pageY - 140;

    console.log("user is at x= ", x, " and y= ", y);

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                if(ar[i][j] == 0) {
                    attribute = "add";
                    ar[i][j] = 1;
                    drawRec(i, j, cellSide, "#808080");
                    return;
                }

                else {
                    attribute = "remove";
                    ar[i][j] = 0;
                    drawRec(i, j, cellSide, "white");
                    return;
                }
            }
        }
    }
    console.log("painting is true");
}

function endPos(){
    painting = false;
    console.log("painting is false");
}

//function that adds obstacle/impassable area on canvas
function clickObstacle(e) {

    if(!painting) return;

    console.log("adding obstacle");
    //returns mouse position of user
    var x = e.pageX - 22;
    var y = e.pageY - 140;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                //adding new obstacle
                if (attribute == "add" && ar[i][j] == 0) {
                    ar[i][j] = 1;
                    drawRec(i, j, cellSide, "#808080");
                }

                //resetting current obstacle
                else if (attribute == "remove" && ar[i][j] == 1) {
                    ar[i][j] = 0;
                    drawRec(i, j, cellSide, "white");
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
}

//function that adds start position on canvas
function clickStart(e) {
    //returns mouse position of user
    var x = e.pageX - 22;
    var y = e.pageY - 140;

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
                    drawRec(startx, starty, cellSide, "green");
                }

                else if (hasStart && (startx != i || starty != j)) {
                    //removing old start pos
                    drawRec(startx, starty, cellSide, "white");

                    //adding new start pos
                    ar[i][j] = 0;
                    startx = i;
                    starty = j;
                    drawRec(i, j, cellSide, "green");
                }

                //resetting start pos
                else {
                    hasStart = false;
                    drawRec(i, j, cellSide, "white");
                    startx = -1;
                    starty = -1;
                }
                return;
            }
        }
    }
}

//when you click add end point button
function addEnd() {
    canvas.removeEventListener("mousedown", startPos);
    canvas.removeEventListener("mouseup", endPos);
    canvas.removeEventListener("mousemove", clickObstacle);
    canvas.removeEventListener("click", clickStart);
    canvas.addEventListener("click", clickEnd);
}

//function that adds end position on canvas
function clickEnd(e) {
    //returns mouse position of user
    var x = e.pageX - 22;
    var y = e.pageY - 140;

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
                    drawRec(endx, endy, cellSide, "blue");
                }

                else if (hasEnd && (endx != i || endy != j)) {
                    //removing old end pos
                    drawRec(endx, endy, cellSide, "white");
                    ar[endx][endy] = 0;

                    //adding new end pos
                    ar[i][j] = 0;
                    endx = i;
                    endy = j;
                    drawRec(i, j, cellSide, "blue");
                }

                //resetting end pos
                else {
                    hasEnd = false;
                    ar[i][j] = 0;
                    drawRec(i, j, cellSide, "white");
                    endx = -1;
                    endy = -1;
                }
                return;
            }
        }
    }
}

function start() {
    canvas.removeEventListener("click", clickObstacle);
    canvas.removeEventListener("click", clickStart);
    canvas.removeEventListener("click", clickEnd);

    var src = {
        x: startx,
        y: starty
    }

    var dest = {
        x: endx,
        y: endy
    }

    console.log("X of dest is ", dest.x, " and Y of dest is ", dest.y);

    aStar(ar, src, dest);
}