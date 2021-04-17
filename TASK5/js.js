var control = 0;
var csvCell = [];
var K = 0;

//adds item to table and initializes table array
function addItem() {
    //imports values and splits them into string array
    let input = document.getElementById("csv").value;
    var cells = input.split(";");

    //add row to table
    let body = document.querySelector("tbody");
    var row = body.insertRow();

    //make array to hold row information
    K++;
    csvCell[K] = new Array(cells.length);

    //add values to table
    for (let i = 0; i < cells.length; i++) {
        var cell = row.insertCell();
        cell.innerHTML = cells[i];

        //adding values to csvCell
        csvCell[K][i] = cells[i];
        console.log(csvCell[K][i]);
        console.log(csvCell.length);
    }
}

//creates header for table
function addHeader() {
    let input = document.getElementById("csv").value;
    console.log(input);
    var cells = input.split(";");

    csvCell[K] = new Array(cells.length);

    for (let i = 0; i < cells.length; i++) {
        console.log(cells[i]);
        csvCell[K][i] = cells[i];
    }

    let table = document.querySelector("table");
    var header = table.createTHead();
    var row = header.insertRow();

    for (let i = 0; i < cells.length; i++) {
        var cell = row.insertCell();
        cell.innerHTML = cells[i];
    }

    document.getElementById("instruction").innerHTML = "Now add the remaining rows one by one making sure they follow the csv format.";
}

//controls adding header or item to table
function controller(){
    if(control == 0) {
        addHeader();
        control = 1;
        document.getElementById("controlButton").innerHTML = "Add Item";
    }

    else {
        addItem();
    }

    document.getElementById("csv").value = "";
}