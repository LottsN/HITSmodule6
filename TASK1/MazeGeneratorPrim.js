//Maze generation algorithm modified from https://cantwell-tom.medium.com/prims-algorithm-as-a-maze-in-javascript-aec7415ad2cd
function generatePrimMaze() {
    //making maze full of walls
    console.log("Starting process of maze generation")

    time = 0;

    //removing place holders
    startx = -1;
    starty = -1;
    endx = -1;
    endy = -1;
    hasEnd = false;
    hasStart = false;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            ar[i][j] = 1;
            drawRec(i, j, cellSide, "#808080");
        }
    }
    console.log("filled maze with walls")

    let overflow = n % 2;
    n = (n - overflow) / 2;

    console.log(n);

    let cells = new Array(n);
    for (let i = 0; i < n; i++) {
        cells[i] = new Array(n);

        for (let j = 0; j < n; j++) {
            let cell = {
                x: i,
                y: j,
                index: [i, j],
                status: "unvisited",
                adjacents: [],
                connections: [],
            };
            cells[i][j] = cell;
            //add to unvisited cells
            //add adjacents
            if (i - 1 >= 0) {
                let right = cells[i - 1][j];
                cell.adjacents.push(right);
                right.adjacents.push(cell);
            }

            if (i + 1 < 0) {
                let left = cells[i + 1][j];
                cell.adjacents.push(left);
                left.adjacents.push(cell);
            }

            if (j - 1 >= 0) {
                let down = cells[i][j - 1];
                cell.adjacents.push(down);
                down.adjacents.push(cell);
            }

            if (j + 1 < 0) {
                let up = cells[i][j + 1];
                cell.adjacents.push(up);
                up.adjacents.push(cell);
            }
        }
    }

    //initialize empty visited set and frontier set
    let visited = new Set();
    let frontier = new Set();
    //get random index as starting point and add it to visited set
    let startX = Math.floor(Math.random() * cells.length);
    let startY = Math.floor(Math.random() * cells.length);
    let start = cells[startX][startY];
    //initialize starting cell as frontier
    frontier.add(start);
    //set start as current cell (first tile of path)
    let current = start;

    //recursive spanning tree creation
    recursiveSpanningTree();
    function recursiveSpanningTree() {
        //remove current from frontier and add it to visited
        frontier.delete(current);
        visited.add(current);
        current.status = "visited";
        console.log("adding frontier at ", current.x * 2 + 1, " ", current.y * 2 + 1)
        ar[current.x * 2 + 1][current.y * 2 + 1] = 0;
        drawAnimation(current.x * 2 + 1, current.y * 2 + 1, cellSide, "white");

        //add adjacent cells to frontier
        function addToFrontier(adjacentCell) {
            for (let c of adjacentCell) {
                if (c.status === "unvisited") {

                    frontier.add(c);
                    c.status = "frontier";
                    //make current cell the frontier cell's connection
                    c.connections.push(current);
                }

                else if (c.status === "frontier") {
                    c.connections.push(current);
                }
            }
        }
        addToFrontier(current.adjacents);

        //choose random cell from frontier
        let iteratable = [...frontier.values()];
        let randomIndex = Math.floor(Math.random() * iteratable.length);
        let frontierCell = iteratable[randomIndex];

        //open a wall between frontier cell and choose its connection
        if (frontierCell && frontierCell.x >= 0 && frontierCell.x < n && frontierCell.y >= 0 && frontierCell.y < n) {
            let randomConnection = Math.floor(Math.random() * frontierCell.connections.length);
            let connectX = frontierCell.x + frontierCell.connections[randomConnection].x;
            let connectY = frontierCell.y + frontierCell.connections[randomConnection].y;
            console.log("stupid algorithm at X= ", frontierCell.connections[randomConnection].x);
            console.log("stupid algorithm at Y= ", frontierCell.connections[randomConnection].y);

            ar[connectX + 1][connectY + 1] = 0;
            drawAnimation(connectX + 1, connectY + 1, cellSide, "white");
        }
        //make the frontier cell the new current
        current = frontierCell;
        if (frontier.size > 0) {
            recursiveSpanningTree();
        }
    }

    n = (2 * n) + overflow;
}