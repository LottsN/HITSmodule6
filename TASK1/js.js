function createMap() {
    var n = document.getElementById("numb").value;
    console.log("map creation loaded")
    console.log(n);

    var canvas = document.querySelector("canvas");

    canvas.width = window.innerWidth / 2.5;
    canvas.height = window.innerWidth / 2.5;

    console.log(canvas.height);
    console.log(canvas.width);

    var ctx = canvas.getContext("2d");

    var s = canvas.width / n;

    ctx.beginPath();
    for (var i = 0; i <= canvas.width; i += s) {
        //vertical lines
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.width);
    }

    for (var i = 0; i <= canvas.width; i += s) {
        //horizontal lines
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
}