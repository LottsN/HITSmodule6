//turning current grid to an array grid
function createMapArray() {
    var n = document.getElementById("numb").value;
    console.log("map creation with array loaded")

    var ar = new Array(n);

    for (var i = 0; i < n; i++) {
        ar[i] = new Array(n);
    }

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            ar[i][j] = 0;
        }
    }

    var canvas = document.querySelector("canvas");

    canvas.width = window.innerWidth / 2.5;
    canvas.height = window.innerWidth / 2.5;

    var cellSide = Math.round(canvas.width / n);
    canvas.width = Math.round(canvas.width / n) * n;
    canvas.height = Math.round(canvas.height / n) * n;

    var ctx = canvas.getContext("2d");

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