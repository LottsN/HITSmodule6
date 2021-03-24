function Queue() {
    var a = [], b = 0;

    this.getLength = function () {
        return a.length - b
    };

    this.isEmpty = function () {
        return 0 == a.length
    };

    this.enqueue = function (b) {
        a.push(b);
        a.sort(function (a, b) {
            if (a.f > b.f) return 1;
            if (a.f < b.f) return -1;
            return 0;
        });
    };

    this.dequeue = function () {
        var i = a.shift();
        return i;
    };
};

function triple(F, X, Y) {
    this.f = F;
    this.x = X;
    this.y = Y;
}

function CellDetails() {
    this.f;
    this.g;
    this.h;
    this.parent_i;
    this.parent_j;
}

function isValid(x, y) {
    if (x >= 0 && x < n && y >= 0 && y < n) {
        return true;
    }

    else {
        return false;
    }
}

function isUnblocked(grid, x, y) {
    if (grid[x][y] == 0) {
        return true;
    }

    else {
        return false;
    }
}

function isDestination(x, y, dest) {
    if (x == dest.x && y == dest.y) {
        return true;
    }

    else {
        return false;
    }
}

function calculateHValue(x, y, dest) {
    var Hvalue = Math.abs(x - dest.x) + Math.abs(y - dest.y);

    return Hvalue;
}

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
        drawRec(x, y, cellSide, "orange");
        var temp_x = cellDetails[x][y].parent_i;
        var temp_y = cellDetails[x][y].parent_j;
        x = temp_x;
        y = temp_y;
    }

    drawRec(x, y, cellSide, "orange");
}

function aStar(grid, src, dest) {
    console.log("SUCCESSFULLY LOADED aSTAR");
    console.log(n);

    //adds isVisited matrix
    var isVisited = new Array(n);
    for (let i = 0; i < n; i++) {
        isVisited[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            isVisited[i][j] = false;
        }
    }

    //matrix that holds all information of current cell
    var cellDetails = new Array(n);
    for (let i = 0; i < n; i++) {
        cellDetails[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cellDetails[i][j] = new CellDetails();
        }
    }

    //initializes for source
    var i = src.x;
    var j = src.y;
    cellDetails[i][j].f = 0.0;
    cellDetails[i][j].g = 0.0;
    cellDetails[i][j].h = 0.0;
    cellDetails[i][j].parent_i = i;
    cellDetails[i][j].parent_j = j;

    var openList = new Queue();                             //stores possible neighboors

    //adding starting position to queue
    var triplet = new triple(0.0, i, j);
    openList.enqueue(triplet);

    var foundDest = false;                                  //boolean to check if end point has been found

    //Searching for dest....
    while (!openList.isEmpty()) {
        var p = openList.dequeue();

        i = p.x;
        j = p.y;
        console.log("Visiting:")
        console.log("i = ", i);
        console.log("j = ", j);
        console.log("f = ", p.f, " g =", cellDetails[i][j].g, " h = ", cellDetails[i][j].h);
        isVisited[i][j] = true;
        drawRec(i, j, cellSide, "#70e67a");

        //////////////////////////////////////////
        //                                      //
        //generates all neighboors of cell[i][j]//
        //                                      //
        //////////////////////////////////////////

        var gNew, hNew, fNew;

        //1st neighboor (up)
        if (isValid(i - 1, j) == true) {
            //if end cell is same as current neighboor
            if (isDestination(i - 1, j, dest) == true) {
                //set parent of destination cell
                cellDetails[i - 1][j].parent_i = i;
                cellDetails[i - 1][j].parent_j = j;
                //MAKE HAPPY NOISES
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

            //if neighboor not already visited and isn't an obstacle
            else if (isVisited[i - 1][j] == false && grid[i - 1][j] != 1) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i - 1, j, dest);
                fNew = hNew + gNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i - 1][j].f == undefined || cellDetails[i - 1][j].f > fNew) {
                    triplet = new triple(fNew, i - 1, j);
                    openList.enqueue(triplet);
                    console.log("has added (", triplet.x, ",", triplet.y, ") to be searched with f of", triplet.f);

                    //update details of cell
                    cellDetails[i - 1][j].f = fNew;
                    cellDetails[i - 1][j].g = gNew;
                    cellDetails[i - 1][j].h = hNew;
                    cellDetails[i - 1][j].parent_i = i;
                    cellDetails[i - 1][j].parent_j = j;
                }
            }

        }

        //2nd neighboor (down)
        if (isValid(i + 1, j) == true) {
            //if end cell is same as current neighboor
            if (isDestination(i + 1, j, dest) == true) {
                //set parent of destination cell
                cellDetails[i + 1][j].parent_i = i;
                cellDetails[i + 1][j].parent_j = j;
                //MAKE HAPPY NOISES
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

            //if neighboor not already visited and isn't an obstacle
            else if (isVisited[i + 1][j] == false && grid[i + 1][j] != 1) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i + 1, j, dest);
                fNew = hNew + gNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i + 1][j].f == undefined || cellDetails[i + 1][j].f > fNew) {
                    triplet = new triple(fNew, i + 1, j);
                    openList.enqueue(triplet);
                    console.log("has added (", triplet.x, ",", triplet.y, ") to be searched with f of", triplet.f);

                    //update details of cell
                    cellDetails[i + 1][j].f = fNew;
                    cellDetails[i + 1][j].g = gNew;
                    cellDetails[i + 1][j].h = hNew;
                    cellDetails[i + 1][j].parent_i = i;
                    cellDetails[i + 1][j].parent_j = j;
                }
            }

        }

        //3rd neighboor (right)
        if (isValid(i, j + 1) == true) {
            //if end cell is same as current neighboor
            if (isDestination(i, j + 1, dest) == true) {
                //set parent of destination cell
                cellDetails[i][j + 1].parent_i = i;
                cellDetails[i][j + 1].parent_j = j;
                //MAKE HAPPY NOISES
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

            //if neighboor not already visited and isn't an obstacle
            else if (isVisited[i][j + 1] == false && grid[i][j + 1] != 1) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i, j + 1, dest);
                fNew = hNew + gNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i][j + 1].f == undefined || cellDetails[i][j + 1].f > fNew) {
                    triplet = new triple(fNew, i, j + 1);
                    openList.enqueue(triplet);
                    console.log("has added (", triplet.x, ",", triplet.y, ") to be searched with f of", triplet.f);

                    //update details of cell
                    cellDetails[i][j + 1].f = fNew;
                    cellDetails[i][j + 1].g = gNew;
                    cellDetails[i][j + 1].h = hNew;
                    cellDetails[i][j + 1].parent_i = i;
                    cellDetails[i][j + 1].parent_j = j;
                }
            }

        }

        //4th neighboor (left)
        if (isValid(i, j - 1) == true) {
            //if end cell is same as current neighboor
            if (isDestination(i, j - 1, dest) == true) {
                //set parent of destination cell
                cellDetails[i][j - 1].parent_i = i;
                cellDetails[i][j - 1].parent_j = j;
                //MAKE HAPPY NOISES
                tracePath(cellDetails, dest);
                foundDest = true;
                return;
            }

            //if neighboor not already visited and isn't an obstacle
            else if (isVisited[i][j - 1] == false && grid[i][j - 1] != 1) {
                gNew = cellDetails[i][j].g + 1;
                hNew = calculateHValue(i, j - 1, dest);
                fNew = hNew + gNew;

                // If it isn’t on the open list, add it to
                // the open list. Make the current square
                // the parent of this square. Record the
                // f, g, and h costs of the square cell
                //                OR
                // If it is on the open list already, check
                // to see if this path to that square is
                // better, using 'f' cost as the measure.
                if (cellDetails[i][j - 1].f == undefined || cellDetails[i][j - 1].f > fNew) {
                    triplet = new triple(fNew, i, j - 1);
                    openList.enqueue(triplet);
                    console.log("has added (", triplet.x, ",", triplet.y, ") to be searched with f of", triplet.f);

                    //update details of cell
                    cellDetails[i][j - 1].f = fNew;
                    cellDetails[i][j - 1].g = gNew;
                    cellDetails[i][j - 1].h = hNew;
                    cellDetails[i][j - 1].parent_i = i;
                    cellDetails[i][j - 1].parent_j = j;
                }
            }
        }


    }

    //when no path has been found
    if (foundDest == false) {
        window.alert("NO PATH FOUND")
    }
    return;

}