//traces path from end to start
function tracePath(cellDetails, dest) {
    var x = dest.x;
    var y = dest.y;

    while (!(cellDetails[x][y].parent_i == x && cellDetails[x][y].parent_j == y)) {
        var temp_x = cellDetails[x][y].parent_i;
        var temp_y = cellDetails[x][y].parent_j;
        drawPath(x, y, temp_x, temp_y);
        x = temp_x;
        y = temp_y;
    }

    const button = document.getElementById("clearPath");
    button.disabled = false;
    l++;
    timeoutPathID[l] = setTimeout(function () {
        document.getElementById("informational_text").innerHTML = "Path has been found.";
    }, time);
}

function drawPath(x, y, temp_x, temp_y) {

    l++;
    timeoutPathID[l] = setTimeout(function () {

        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x * cellSide + cellSide / 2, y * cellSide + cellSide / 2);

        //going down
        if (y - temp_y > 0 && x - temp_x == 0) {
            ctx.lineTo(temp_x * cellSide + cellSide / 2, temp_y * cellSide + cellSide / 2 - ctx.lineWidth / 2);
        }

        //going up
        else if (y - temp_y < 0 && x - temp_x == 0) {
            ctx.lineTo(temp_x * cellSide + cellSide / 2, temp_y * cellSide + cellSide / 2 + ctx.lineWidth / 2);
        }

        //going right
        else if (x - temp_x < 0 && y - temp_y == 0) {
            ctx.lineTo(temp_x * cellSide + cellSide / 2 + ctx.lineWidth / 2, temp_y * cellSide + cellSide / 2);
        }

        //going left
        else if (x - temp_x > 0 && y - temp_y == 0) {
            ctx.lineTo(temp_x * cellSide + cellSide / 2 - ctx.lineWidth / 2, temp_y * cellSide + cellSide / 2);
        }

        else {
            ctx.lineTo(temp_x * cellSide + cellSide / 2, temp_y * cellSide + cellSide / 2);
        }

        ctx.stroke();

    }, time);
}