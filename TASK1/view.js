//changes color of cells according to their state
function drawRec(x, y, state) {
    ctx.fillStyle = state;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.rect(x * cellSide, y * cellSide, cellSide, cellSide);
    ctx.fill();
    ctx.stroke();
}

function drawAnimation(x, y, state) {


    time += 5;
    k++;

    timeoutID[k] = setTimeout(function () {
        ctx.fillStyle = state;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.rect(x * cellSide, y * cellSide, cellSide, cellSide);
        ctx.fill();
        ctx.stroke();

    }, time);
}

function drawFlag(x, y) {

    var white = 0;
    ctx.fillStyle = "#000000";

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {

            if (white == 0) {
                ctx.fillStyle = "#000000";
                white = 1;
            }

            else if (white == 1) {
                ctx.fillStyle = "#FFFFFF";
                white = 0;
            }

            ctx.beginPath();
            ctx.rect(x * cellSide + (cellSide / 5 * i), y * cellSide + (cellSide / 7 * j), cellSide / 5, cellSide / 7);
            ctx.fill();
        }
    }
}

function clearPath() {

    for (let i = 0; i <= k; i++) {
        clearTimeout(timeoutID[i]);
    }

    for (let i = 0; i <= l; i++) {
        clearTimeout(timeoutPathID[i]);
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            if (ar[i][j] == 0) {
                drawRec(i, j, "white");
            }

            else{
                drawRec(i, j, "#808080");
            }
        }
    }

    drawRec(startx, starty, "red");
    drawFlag(endx, endy);

    const button = document.getElementById("clearPath");
    button.disabled = true;

    document.getElementById("informational_text").innerHTML = "Check options and click START SEARCH to start PathFinding Algorithm.";
}

function clearWalls() {

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (ar[i][j] = 1 && ((i != startx || j != starty) && (i != endx || j != endy))) {
                ar[i][j] = 0;
                drawRec(i, j, "white");
            }
        }
    }

    drawRec(startx, starty, "red");
    drawFlag(endx, endy);

    if (hasStart == true && hasEnd == true) {
        document.getElementById("informational_text").innerHTML = "Check options and click START SEARCH to start PathFinding Algorithm.";
    }
    else if (hasStart == true && hasEnd == false) {
        document.getElementById("informational_text").innerHTML = "Set END position before searching for path.";
    }
    else if (hasStart == false && hasEnd == true) {
        document.getElementById("informational_text").innerHTML = "Set START position before searching for path.";
    }
    else {
        document.getElementById("informational_text").innerHTML = "Set START and END positions before searching for path.";
    }
}