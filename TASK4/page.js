let graph = new Graph();  //граф
let startGA = undefined; //переменная для запуска ГА при клике
let begin = false; //переменная для общего старта
let showPanel = true; //показ панели параметров
let canv = document.getElementById('canvas'); //камвас
let ButtonStart = document.getElementById('RunStop'); //кнопки старт
let ButtonShowingOff = document.getElementById('showingOff'); //кнопка показа панели

//фунеция применения параметров из панели
function Submit(event){
    event.preventDefault();
    //останавливаем цикл - если запущен
    if (begin) {
        SwitchButtonText(ButtonStart);
        SwitchButtonStyle(ButtonStart);
        SwitchBegin();
        }
    
    //убираем линии путей
    showPoints(graph, "canvas");

    let error = false;
    let errors = [];

    //если что-то неправильно введено - добавляем ошибку в массив - потом выводим массив ошибок

    if (document.getElementById('alpha').value < 0){
        error = true;
        errors.push("alpha");
    } else {
        alpha = document.getElementById('alpha').value;
    }

    if (document.getElementById('beta').value < 0){
        error = true;
        errors.push("beta");
    } else {
        beta = document.getElementById('beta').value;
    }

    if (document.getElementById('rho').value < 0 || document.getElementById('rho').value > 100){
        error = true;
        errors.push("rho");
    } else {
        rho = document.getElementById('rho').value / 100;
    }

    if (document.getElementById('Q').value < 0){
        error = true;
        errors.push("Q");
    } else {
        Q = document.getElementById('Q').value;
    }

    if (document.getElementById('amountofants').value <= 0){
        error = true;
        errors.push("amount of ants");
    } else {
        numAnts = document.getElementById('amountofants').value;
    }


    if (document.getElementById('numberofgenerations').value <= 0){
        error = true;
        errors.push("number of generations");
    } else {
        maxTime = document.getElementById('numberofgenerations').value;
    }

    if (document.getElementById('delay').value < 0){
        error = true;
        errors.push("delay");
    } else {
        delay = document.getElementById('delay').value;
    }

    if (document.getElementById('initialpheromone').value <= 0){
        error = true;
        errors.push("initial pheromone");
    } else {
        c = document.getElementById('initialpheromone').value;
    }

    if (error){
        let message = "Please, input correct: ";
        message += errors.join(', ');
        alert(message);
    } else {alert("Submited");}
}

//функция для смены текста в кнопке
function SwitchButtonText(button) {
    let text = button.innerHTML;
    button.innerHTML = button.getAttribute('data-toggle');
    button.setAttribute('data-toggle', text);
}

//функция для смены стиля кнопки
function SwitchButtonStyle(button){
    let style = button.getAttribute('class');
    button.setAttribute('class', button.getAttribute('data-toggle-class'));
    button.setAttribute('data-toggle-class', style);
    
}

//функция для изменения возможности обшего старта
function SwitchBegin(){
    if (begin == true) {
        begin = false;
    }
    else {
        begin = true;
    }
}

//функция скрытия-отображения панели
function SwitchShowPanel(){
    if (showPanel == true) {
        showPanel = false;
    }
    else {
        showPanel = true;
    }
}

//функция для смены всей кнопки
function changeButton(){
    SwitchButtonText(ButtonStart);
    SwitchButtonStyle(ButtonStart);
    SwitchBegin();
}

//функция для добавления вершины в случайной точке
function randomNode(event){
    event.preventDefault();
    graph.addNode(Math.round(Math.random() * canv.width), Math.round(Math.random() * canv.height), newId());
    showPoints(graph, "canvas");
    showNumberOfVertexes('vertexes', "");

    if((graph.getNodeIds().length > 1) && (begin))
    {
        if(startGA != undefined)
            clearInterval(startGA);

        startGA = StartAntAlgorithm(graph);
    }
}

//функция для удаления всех точек
function deleteNodes(event){
    event.preventDefault();
    if (begin) {
    SwitchButtonText(ButtonStart);
    SwitchButtonStyle(ButtonStart);
    SwitchBegin();
    }
    graph.deleteNodes();
    showNumberOfVertexes('vertexes', "");
    newId = function(){ 
        id = 0; 
        return function(){return id++;}
    }();

    showPoints(graph, "canvas");
    console.clear();
}

//функция для показа-скрытия панели параметров
function showingOff(event){
    event.preventDefault();
    SwitchButtonText(ButtonShowingOff);
    SwitchShowPanel();
    if (showPanel == false){
        document.getElementById('toHide').style.display = "none";
        document.getElementById('command_panel').style.height = "4vh";
        document.getElementById('command_panel').style.borderRadius = "1vh";
        document.getElementById('astar_header').style.borderColor = "rgba(0, 0, 0, 0)";
        document.getElementById('astar_header').style.backgroundColor = "rgba(0, 0, 0, 0)";
        document.getElementById('astar_header').style.textAlign = "left";
        document.getElementById('showingOff').style.right = "-7.1vw";
        showingOff
    }
    else{
        document.getElementById('toHide').style.display = "inline";
        document.getElementById('command_panel').style.height = "81.5vh";
        document.getElementById('astar_header').style.border = "solid 1vw rgba(255, 255, 255)";
        document.getElementById('astar_header').style.backgroundColor = "rgba(255,255,255)";
        document.getElementById('astar_header').style.textAlign = "center";
        document.getElementById('showingOff').style.right = "-3vw"
    }
}

//50 случайных точек
function add50(event){
    event.preventDefault();
    for (let k = 0; k < 50; k++){
        randomNode(event);
    }
}

//10 случайных точек
function add10(event){
    event.preventDefault();
    for (let k = 0; k < 10; k++){
        randomNode(event);
    }
}

//5 случайных точек
function add5(event){
    event.preventDefault();
    for (let k = 0; k < 5; k++){
        randomNode(event);
    }
}

//функция для запуска ГА при нажатии кнопки СТАРТ
function RunStop(event){
    event.preventDefault();

    if (graph.getNodeIds().length > 1){
    
    changeButton();
    
    if (!begin) showPoints(graph, "canvas");
    
    if((graph.getNodeIds().length > 1) && (begin)) {
            if(startGA != undefined)
                clearInterval(startGA);

            startGA = StartAntAlgorithm(graph);
        }
    } else { alert("Add at least two points"); }
}


//подгружаем функции добавления кликом при загрузке
window.onload = function(){ 
    console.log("kekus");
    let canvas = document.getElementById("canvas");
    //не отображаем точки тк их еще нет
    showPoints(undefined, "canvas");

    //довабление точек при клике и перезапуск цикла при добавлении точки кликом
    canvas.addEventListener("mousedown", function(event){
        graph.addNode(event.offsetX, event.offsetY, newId());
        showNumberOfVertexes('vertexes', "")
        showPoints(graph, "canvas");

        if((graph.getNodeIds().length > 1) && (begin))
        {
            if(startGA != undefined)
                clearInterval(startGA);

            startGA = StartAntAlgorithm(graph);
        }

    }, false);
};