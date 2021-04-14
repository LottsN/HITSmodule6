//создадим класс Граф - в нем будут храниться вершины и функции для них
let Graph = class{
    constructor(){
        this.nodes = {};
    }

    //получить список вершин
    getNodeIds(){
        let output = [];
        for(let id in this.nodes)
            output.push(id);
        return output; 
    }

    //добавить вершину
    addNode(x, y, id){
        this.nodes[id] = {x:x, y:y};
    }

    //удалить вершину
    deleteNodes(){
        this.nodes = {};
    }

    //найти длину всего пути
    getPathDistance(path){
        let distance = 0;
        for(let i = 0; i < path.length - 1; i++)
            distance += this.getDistance(path[i], path[i + 1]);
        return distance;
    }

    //найти расстояние между двумя вершинами
    getDistance(node_id, other_id)
    {
        return this.getDistance_Nodes(this.nodes[node_id], this.nodes[other_id]);
    }

    //сама функция для подсчета расстояния между двумя вершинами
    getDistance_Nodes(a, b){
        let x = Math.abs(b.x - a.x);
        let y = Math.abs(b.y - a.y);

        return x + y;
    }
}