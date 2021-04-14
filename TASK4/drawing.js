//функция для создания индексов вершин
var newId = function(){ 
    var id = 0; 
    return function(){return id++;}
}();

let map = document.getElementById("russian");

//функция для генерации случайного пути по точкам
function generateGraph(points){
    let graph = new Cities();
    for(let i = 0; i < points; i++){
        graph.addNode(Math.random() * 300, Math.random() * 300, newId());
    }
    return graph;
}

//функция для показа точек и пути по ним
function showPath(path, graph, canvasId){
    var ctx = document.getElementById(canvasId).getContext("2d");
    ctx.fillStyle = "pink";
    ctx.fillRect(0, 0, 1520, 730);
    
    ctx.drawImage(map, 0, 0, 1520, 730);
    
    //рисуем начальную точку
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(graph.nodes[path[0]].x, graph.nodes[path[0]].y);
    ctx.arc(graph.nodes[path[0]].x, graph.nodes[path[0]].y, 12, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = "italic 30pt Arial";
    
 
    //рисуем все остальные
    for(let i = 1; i < path.length; i++)
    {
        ctx.strokeStyle = "white"; 
        ctx.lineTo(graph.nodes[path[i]].x, graph.nodes[path[i]].y);
        ctx.fillStyle = "red";
        ctx.fillRect(graph.nodes[path[i]].x - 5, graph.nodes[path[i]].y - 5, 10, 10);
        ctx.font = "italic 30pt Arial";
        ctx.fillStyle = "white"; 
        ctx.fillText(parseInt(path[i]) + 1 + "", graph.nodes[path[i]].x, graph.nodes[path[i]].y);
    }
    ctx.lineWidth = 4;
    ctx.stroke();

}

//функция для показа текста
function showText(text, canvasId, x, y, stroke){
    let ctx = document.getElementById(canvasId).getContext("2d");
    ctx.strokeStyle = stroke; 
    ctx.font = "italic 30pt Arial";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}

//функция для показа числа вершин в панеле
function showNumberOfVertexes(headlineId, headlineprefix){
    let amount = graph.getNodeIds().length
    document.getElementById(headlineId).innerText = headlineprefix + amount; 
}

//показ точек
function showPoints(graph, canvasId){
    var ctx = document.getElementById(canvasId).getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1520, 730);
    ctx.drawImage(map, 0, 0, 1520, 730);

    if(graph != undefined){
        let ids = graph.getNodeIds();

        //рисуем все точки в массиве
        ctx.fillStyle = "white";
        for(let i = 0; i < ids.length; i++) 
        {
            ctx.moveTo(graph.nodes[ids[i]].x, graph.nodes[ids[i]].y);
            ctx.fillRect(graph.nodes[ids[i]].x - 4, graph.nodes[ids[i]].y - 4, 8, 8);
            ctx.font = "italic 30pt Arial";
            ctx.fillText(i + 1, graph.nodes[ids[i]].x, graph.nodes[ids[i]].y);
        }
    }
}


