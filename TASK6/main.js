var canvas;
var painting = false;
var canvas = document.querySelector("canvas");
canvas.width = 280;
canvas.height = 280;
var ctx = canvas.getContext("2d");
var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var paths = []; // recording paths
var color = "black";
var lineWidth = 20;


function pencil() {
    canvas.addEventListener("mousedown", startPos);
    canvas.addEventListener("mouseup", endPos);
    canvas.addEventListener("mousemove", drawPencil);
}

function startPos(e) {
    painting = true;

    var x = e.pageX - window.innerWidth + window.innerWidth / 2 + 100;
    var y = e.pageY - window.innerHeight + window.innerHeight / 2 + 100;

    var i = Math.floor(x / 4) * 4;
    var j = Math.floor(y / 4) * 4;

    drawRec(i, j);

    console.log("pageX is at ", e.pageX);
    console.log("canvas width is ", canvas.width);
    console.log("user is at x= ", x, " and y= ", y);

}

function endPos() {
    painting = false;
}

//function to draw pixels (4x4 square) in canvas 
function drawPencil(e) {

    if (!painting) return;

    //returns mouse position of user
    var x = e.pageX - window.innerWidth + window.innerWidth / 2 + 100;
    var y = e.pageY - window.innerHeight + window.innerHeight / 2 + 100;

    var i = Math.floor(x / 6) * 6;
    var j = Math.floor(y / 6) * 6;

    drawRec(i, j);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("number").innerHTML = "";
}

function drawRec(x, y) {
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.rect(x, y, 6, 6);
    ctx.fill();
}


function brush() {
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}

function findxy(res, e) {
    if (res == 'down') {
        if (e.pageX != undefined && e.pageY != undefined) {
            currX = e.pageX - canvas.offsetLeft;
            currY = e.pageY - canvas.offsetTop;
        } else {
            currX = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft
                - canvas.offsetLeft;
            currY = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop
                - canvas.offsetTop;
        }
        //draw a circle
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(currX, currY, lineWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();

        paths.push([[currX], [currY]]);
        painting = true;
    }
    if (res == 'up' || res == "out") {
        painting = false;
        //console.log(paths);
    }

    if (res == 'move') {
        if (painting) {
            // draw a line to previous point
            prevX = currX;
            prevY = currY;
            if (e.pageX != undefined && e.pageY != undefined) {
                currX = e.pageX - canvas.offsetLeft;
                currY = e.pageY - canvas.offsetTop;
                console.log("new x is at: ", currX, "new y us at: ", currY);
            } else {
                currX = e.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft
                    - canvas.offsetLeft;
                currY = e.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop
                    - canvas.offsetTop;
            }
            currPath = paths[paths.length - 1];
            currPath[0].push(currX);
            currPath[1].push(currY);
            paths[paths.length - 1] = currPath;
            draw(ctx, color, lineWidth, prevX, prevY, currX, currY);
        }
    }
}

// draws a line from (x1, y1) to (x2, y2) with nice rounded caps
function draw(ctx, color, lineWidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
