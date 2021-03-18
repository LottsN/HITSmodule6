var ar = new Array(100);
for (var i = 0; i < 100; i++) {
    ar[i] = new Array(100);
}

var ctx;
var canvas;
var n;
var cellSide;


function createMapArray() {
    n = document.getElementById("numb").value;
    console.log("map creation with array loaded")

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            ar[i][j] = 0;
        }
    }

    canvas = document.querySelector("canvas");

    canvas.width = window.innerWidth / 2.5;
    canvas.height = window.innerWidth / 2.5;

    cellSide = Math.round(canvas.width / n);
    canvas.width = Math.round(canvas.width / n) * n;
    canvas.height = Math.round(canvas.height / n) * n;

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

function drawRec(x, y, cellSide, state) {

    ctx.fillStyle = state;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.rect(x, y, cellSide, cellSide);
    ctx.fill();
    ctx.stroke();
}

function addObstacle() {
    canvas.addEventListener("click", clickObstacle);
}

function clickObstacle(e) {
    console.log("mouse has been clicked");

    var x = e.clientX - 9;
    var y = e.clientY - canvas.offsetTop - 30;

    console.log(x);
    console.log(y);
    console.log(cellSide);

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                if (ar[i][j] != 1) {
                    ar[i][j] = 1;
                    drawRec(i * cellSide, j * cellSide, cellSide, "black");
                }

                else {
                    ar[i][j] = 0;
                    drawRec(i * cellSide, j * cellSide, cellSide, "white");
                }
                return;
            }
        }
    }
}

function addStart(){
    canvas.addEventListener("click", clickStart);
}

function clickStart(e){
    var x = e.clientX - 9;
    var y = e.clientY - canvas.offsetTop - 30;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                if (ar[i][j] != 3) {
                    ar[i][j] = 3;
                    drawRec(i * cellSide, j * cellSide, cellSide, "green");
                }

                else {
                    ar[i][j] = 0;
                    drawRec(i * cellSide, j * cellSide, cellSide, "white");
                }
                return;
            }
        }
    }
}

function addEnd(){
    canvas.addEventListener("click", clickEnd);
}

function clickEnd(e){
    var x = e.clientX - 9;
    var y = e.clientY - canvas.offsetTop - 30;

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i * cellSide < x && x < i * cellSide + cellSide && j * cellSide < y && y < j * cellSide + cellSide) {
                if (ar[i][j] != 2) {
                    ar[i][j] = 2;
                    drawRec(i * cellSide, j * cellSide, cellSide, "blue");
                }

                else {
                    ar[i][j] = 0;
                    drawRec(i * cellSide, j * cellSide, cellSide, "white");
                }
                return;
            }
        }
    }
}