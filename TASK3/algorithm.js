var MutationRateProcent = 40; //процент мутаций
var StartingVertex = 0; //начальная вершина
var NumberOfGenerations = 100; //число поколений
var populationSize = 100; //размер популяции
var delay = 100; //задержка перед обновлением мин.пути


//генерация случайной хромосомы
function generateRandomСhromosome(graph){
    let NodeIndexes = graph.getNodeIds();
    //начинаем со стартовой вершины
    let ChromosomeNodes = [NodeIndexes[StartingVertex]]; 
    NodeIndexes.splice(StartingVertex, 1);
    
    //тут должен быть размер популяции
    for(let i = 0; i < NodeIndexes.length; )
    {
        let a = Math.round(Math.random() * (NodeIndexes.length - 1));
        ChromosomeNodes.push(NodeIndexes[a]);
        NodeIndexes.splice(a, 1);
    }

    //заканчиваем ею же
    ChromosomeNodes.push(ChromosomeNodes[0]); 

    return ChromosomeNodes;
}

//функция мутации хромосомы
function mutation(chromosome){

    let outputChromosome = chromosome.slice();
    
    let FirstLast = outputChromosome.pop(); //удаляем первую

    outputChromosome.shift()  //удаляем последнюю (тк их нельзя изменять)
    
    //если случайное числа меньше индекса мутации - меняем случайные вершины местами
    if (Math.random() * 100 < MutationRateProcent){
        let randomIndex = Math.round(Math.random() * (outputChromosome.length - 1));
        let randomOtherIndex = Math.round(Math.random() * (outputChromosome.length - 1));
        
        let tmp = outputChromosome[randomIndex];
        outputChromosome[randomIndex] = outputChromosome[randomOtherIndex];
        outputChromosome[randomOtherIndex] = tmp;
    }

    //возвращаем вершину начала и конца
    outputChromosome.unshift(FirstLast);
    outputChromosome.push(FirstLast);

    return outputChromosome;
}

//производим селекцию, размера размера популяции
function selection(population, graph, limit){

    //сортируем по длине маршрута (мин -> макс)
    population.sort(function(a, b){return graph.getPathDistance(a) - graph.getPathDistance(b);});
    
    //добавляем те маршруты, которых еще не было
    let WithoutSecondEnteries = [];
    for(let p in population)
        if(WithoutSecondEnteries.indexOf(population[p]) == -1)
            WithoutSecondEnteries.push(population[p]);
    
    return WithoutSecondEnteries.splice(0, limit);
}

//функция кроссинговера
function crossingover (parent1, parent2, oldPopulation){

    //если всего две вершины - то возвращенм тк их нельзя переставлять
    if (parent1.length == 3) {
        oldPopulation.push(parent1);
        oldPopulation.push(parent2);
        return oldPopulation;
    }

    //удаляем первые и последние вершины - тк их нельзя изменять
    let FirstLast1 = parent1.pop();
    parent1.shift();
    let FirstLast2 = parent2.pop();
    parent2.shift();

    //генерируем случайную точку разрыва, равную как минимум 1
    let pivot = 0;
    while (pivot < 1){
       pivot = Math.round(Math.random() * (parent1.length - 1));
    }

    //создаем копию для работы
    let parent1copy = parent1;
    let parent2copy = parent2;

    //первые части
    //они равны всем вершинам до точки разрыва
    var neworder1 = parent1copy.slice(0, pivot);
    var neworder2 = parent2copy.slice(0, pivot);  

    //вторые части
    //они равны первым частям + тем вершинам после точки разрыва другой хромосомы, которых нет в первой части 

    //для первого
    for (let i = pivot; i < parent2.length; i++) {
        let vertex = parent2[i];
        if (!neworder1.includes(vertex)) {
          neworder1.push(vertex);
        }
      }

    //для второго
    for (let i = pivot; i < parent1.length; i++) {
    let vertex = parent1[i];
    if (!neworder2.includes(vertex)) {
        neworder2.push(vertex);
        }
    } 

    //третьи части
    //оставшиеся свободные места дополняем оставшимися вершинами из исходной хромосомы

    //для первого
    if (neworder1.length <parent1.length){
        for (let i = pivot; i < parent1.length; i++) {
            let vertex = parent1[i];
            if (!neworder1.includes(vertex)) {
              neworder1.push(vertex);
            }
          }
    } 

    //для второго
    if (neworder2.length <parent2.length){
        for (let i = pivot; i < parent2.length; i++) {
            let vertex = parent2[i];
            if (!neworder2.includes(vertex)) {
              neworder2.push(vertex);
            }
          }
    } 

    //возвращаем первые-последние вершины для каждой хромосомы
    neworder1.unshift(FirstLast1);
    neworder1.push(FirstLast1);
    neworder2.unshift(FirstLast2);
    neworder2.push(FirstLast2);

    //добавляем новые мутированные хромосомы в популяцию
    oldPopulation.push(mutation(neworder1));
    oldPopulation.push(mutation(neworder2));   

    return oldPopulation; 
}

//создаем новую популяцию
function CreateNewPopulation(graph, oldPopulation, populationSize){

    //запускаем кроссинговер по размеру популяции
    for (let i = 0; i < populationSize; i++){
    let first = oldPopulation[Math.floor(Math.random() * (oldPopulation.length - 1))].slice(0);
    let second = oldPopulation[Math.floor(Math.random() * (oldPopulation.length - 1))].slice(0);

    crossingover(first, second, oldPopulation);
    }

    //возвращаем лучших особей
    return selection(oldPopulation, graph, populationSize);
}


function StartGeneticAlgorithm(graph){

    var population = [];
    
    //генерируем популяцию случайных хромосом
    for(let i = 0; i < populationSize; i++){
        population.push(generateRandomСhromosome(graph)); 
    }
    
    //нынешнее поколение
    var GenerationNumber = 0;

    let answer = setInterval(function(){
        //если цикл запущен и не закончен
        if (GenerationNumber<NumberOfGenerations && begin == true)  {
            GenerationNumber++;
        
        //новое поколение - полуяаем из старого
        population = CreateNewPopulation(graph, population, populationSize);
        //console.log("Best in round "+ GenerationNumber++ +": " + graph.getPathDistance(population[0]));

        console.log("Best on " + GenerationNumber + " ,length: " + graph.getPathDistance(population[0]));
        showPath(population[0], graph, "canvas");
        showText(' length: ' + graph.getPathDistance(population[0]), "canvas", 45, 130, 'white');
        
        let copy = [];

        //увеличиваем индекс вершин на 1, для привычеого счета
        for (let i = 0; i < population[0].length; i++){
            copy[i] = parseInt(population[0][i]) + 1 + '';
        }

        showText('Current Path: '+ copy.join('-') + ',', "canvas", 45, 95, 'white');
        }
        else{
            //если цикл закончен
            if (GenerationNumber==NumberOfGenerations){
                //потому что завершился сам
                showPath(population[0], graph, "canvas");
                console.log("Best Chromosom's length: " + graph.getPathDistance(population[0]));
                changeButton();
                
                //выводим лучшую длину
                showText(' length: ' + graph.getPathDistance(population[0]), "canvas", 45, 130, 'green');
                
                //увеличиваем индекс вершин на 1, для привычеого счета
                for (let i = 0; i < population[0].length; i++){
                    population[0][i] = parseInt(population[0][i]) + 1 + '';
                }

                //выводим лучший путь
                showText('The Best Path: '+ population[0].join('-') + ',', "canvas", 45, 95, 'green');
                
                //отчищаем интервал, для остановки функции
                clearInterval(answer);
            }
            else{
            //если заверился не до конца - просто останавливаем функцию
            clearInterval(answer);
            }
        }
    }, delay);

    return answer;

}