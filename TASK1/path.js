//traces path from end to start
function tracePath(cellDetails, dest) {
    var x = dest.x;
    var y = dest.y;

    while (!(cellDetails[x][y].parent_i == x && cellDetails[x][y].parent_j == y)) {
        var cell = {
            x: x,
            y: y
        }
        console.log("go to");
        console.log(cell.x);
        console.log(cell.y);
        var temp_x = cellDetails[x][y].parent_i;
        var temp_y = cellDetails[x][y].parent_j;
        drawPath(x, y, temp_x, temp_y);
        x = temp_x;
        y = temp_y;
    }

    drawPath(x, y);
}

function drawPath(x, y, temp_x, temp_y) {
    ctx.fillStyle = "yellow";

    ctx.beginPath();

    //going down
    if (y - temp_y < 0) {
        ctx.rect(x * cellSide + cellSide / 2 - cellSide / 40, y * cellSide + cellSide / 2 - cellSide / 40, cellSide / 20, cellSide);
    }

    //going up
    else if(y - temp_y > 0) {
        ctx.rect(x * cellSide + cellSide / 2 - cellSide / 40, y * cellSide - cellSide / 2 + cellSide / 40, cellSide / 20, cellSide);
    }

    //going right
    else if(x - temp_x < 0) {
        ctx.rect(x * cellSide + cellSide / 2 - cellSide / 40, y * cellSide + cellSide / 2 - cellSide / 40, cellSide, cellSide / 20);
    }

    //going left
    else if(x - temp_x > 0) {
        ctx.rect(x * cellSide - cellSide / 2 + cellSide / 40, y * cellSide + cellSide / 2 - cellSide / 40, cellSide, cellSide / 20);
    }

    ctx.fill();
}