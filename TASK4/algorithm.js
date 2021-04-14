var alpha = 3; //альфа
var beta = 2;  //бета
var rho = 0.05; //фактор понижение феромона
var Q = 200;  //фактор увеличения феромона
var numAnts = 4; //число муравьев
var maxTime = 100; //количество повторений
var c = 1; //начальный уровень феромона
var delay = 100; //задержка при выполнении цикла

//функция для получения длины пути
function getLength(trail, martix){
  let result = 0.0;
  for (let i = 0; i < trail.length - 1; ++i)
    result += Distance(trail[i], trail[i + 1], martix);
  return result;
}

//функция для нахождения индекса элемента - IndexOf не находит
function IndexOfTarget(trail, target){
for (let i = 0; i < trail.length; ++i) {
  if (trail[i] == target) return i;
  }
}


//функция для проверки нахождения двух городов в одном пути
function EdgeInTrail(cityX, cityY, trail){
  let lastIndex = trail.length - 1;
  let idx = IndexOfTarget(trail, cityX);

  //все возможные варианты расположения двух городов рядом в пути
  if (idx == 0 && trail[1] == cityY) return true;
  else if (idx == 0 && trail[lastIndex] == cityY) return true;
  else if (idx == 0) return false;
  else if (idx == lastIndex && trail[lastIndex - 1] == cityY) return true;
  else if (idx == lastIndex && trail[0] == cityY) return true;
  else if (idx == lastIndex) return false;
  else if (trail[idx - 1] == cityY) return true;
  else if (trail[idx + 1] == cityY) return true;
  else return false;
}

//фунция обновления феромонов - если муровей прошел по этому ребру - добавляем феромоны, если не ходил - то феромоны просто испяряются
function UpdatePheromones(pheromones, ants, dists){
   //для кадлого муравья проверяем каждое ребро
  for (let i = 0; i < pheromones.length; ++i){
    for (let j = i + 1; j < pheromones[i].length; ++j){
      for (let k = 0; k < ants.length; ++k){
        let length = getLength(ants[k], dists); 
        let decrease = (1.0 - rho) * pheromones[i][j]; //насколько феромоны уменьшатся
        let increase = 0.0; //насколько возрастут
        if (EdgeInTrail(i, j, ants[k]) == true) increase = (Q / length); //если ребра нет в пути - муравьи там не ходят - феромонов не добавиться
        pheromones[i][j] = decrease + increase;
        pheromones[j][i] = pheromones[i][j];
      }
    }
  }
}

//функция нахождения дисканции между двух городов
function Distance(cityX, cityY, matrix){
  return matrix[cityX][cityY];
}


//функция подсчета вероятности перехода
function CalculateProbabilities(cityX, visited, pheromones, dists){
  // for ant k, located at nodeX, with visited[], return the prob of moving to each city

  let numCities = pheromones.length;
  let taueta = new Array(numCities); //массив, содержащий tau^alpha*eta^beta для каждого города
  let sum = 0.0; //сумма всех tau^alpha*eta^beta
  for (let i = 0; i < taueta.length; ++i){
    if (i == cityX) taueta[i] = 0.0; //cityX - город, где мы находимя, вероятность пойти в самого себя равна нулю
    else if (visited[i] == true) taueta[i] = 0.0; //если мы уже были в каком-то городе - вероятность туда пойти равна нулю
    else{ taueta[i] = Math.pow(pheromones[cityX][i], alpha) * Math.pow((1.0 / Distance(cityX, i, dists)), beta);}//иначе считаем по формуле
    sum += taueta[i]; //добавляем тау*ета в общую сумму
  }

  //считаем вероятность перехода в каждый город по формуле по формуле
  let  probabilities = new Array(numCities);
  for (let i = 0; i <  probabilities.length; ++i)
     probabilities[i] = taueta[i] / sum;

  return  probabilities;
}

//функция для выбора города для перехода с учетом вероятности для каждого города
function NextCity(cityX, visited, phrmns, dists){

  //считаем вероятности
  let  probabilities = CalculateProbabilities(cityX, visited, phrmns, dists);
  
  //подсчет суммы вероятностей на каждом шаге (pi = p1 + p2 + ... + pi)
  let probs_sum = new Array( probabilities.length + 1);
  for (let k = 0; k < probs_sum.length; k++){
      probs_sum[k] = 0 ;
  }

  for (let i = 0; i <  probabilities.length; ++i) {
      probs_sum[i + 1] = probs_sum[i] +  probabilities[i]; 
  }

  //генерируем случайное число
  let p = Math.random();

  //выбираем город, на чей промежуток вероятности указало случайное число
  for (let i = 0; i < probs_sum.length - 1; ++i){
    if (p >= probs_sum[i] && p < probs_sum[i + 1]) return i;
  }
}

//функция для построения маршрута начиная с определенной вершины
function BuildTrail(start, phrs, dists){
  let numberOfCities = phrs.length;
  let singleTrial = new Array(numberOfCities + 1);
  let visited = new Array(numberOfCities);

  //начальная вершина равна заданому start - мы в ней находимся - значит посетили
  singleTrial[0] = start;
  visited[start] = true;

  //цикл для создания маршрута из всех городов
  for (let i = 0; i < numberOfCities - 1; ++i){
    let cityX = singleTrial[i]; //сам город где мы
    let next = NextCity(cityX, visited, phrs, dists); //находим следующий город
    singleTrial[i + 1] = next;
    visited[next] = true; //отмечаем, что были там
  }

  //после того как он обошел все города, он точно вернется в город с которого начал
  singleTrial[singleTrial.length - 1] = start;
  return singleTrial;
}

//обновляем поколение муравьев
function UpdateAnts(ants, pherses, dists){
  let numCities = pherses.length;
  //каждому муравью создаем новый маршрут
  for (let k = 0; k < ants.length; ++k){
    let start = Math.round(Math.random() * (numCities - 1)); //стартовая вершина определяется случайно
    let newTrail = BuildTrail(start, pherses, dists);
    ants[k] = newTrail;
  }
}

//создаем матрицу феремонов
function InitPheromones(numCities){
  let phers = new Array(numCities);

  for (let i = 0; i < numCities; ++i) phers[i] = new Array(numCities);

  //начальное значение феромонов равно заданому параметру c
  for (let i = 0; i < phers.length; ++i){
    for (let j = 0; j < phers[i].length; ++j){
      phers[i][j] = c; 
    }
  }
  return phers;
}

//находим лучший путь
function BestTrail(ants, dists){
  let bestLen = getLength(ants[0], dists);
  let idxBestLength = 0;

  //находим индекс минимального пути муравья
  for (let k = 1; k < ants.length; ++k){
    let len = getLength(ants[k], dists);
    if (len < bestLen){
        bestLen = len;
      idxBestLength = k;
    }
  }

  let numCities = ants[0].length;
  let bestTril = new Array(numCities);

  //лучший путь равен пути муравья с наименьшей длинной
  bestTril = ants[idxBestLength].slice()

  return bestTril;
}

//создаем случайный путь дкаждого муравья
function RandomTrail(start, numCities){
      let trail = new Array(numCities);

      //создаем маршрут
      for (let i = 0; i < numCities; ++i) trail[i] = i; 
      
      //перемешываем вершины в случайном порядке
      for (let i = 0; i < numCities; ++i) {
        let r =  Math.round(Math.random() * (numCities - 1));
        let tmp = trail[r]; 
        trail[r] = trail[i];
        trail[i] = tmp;
      }

      //возвращаем стартовую вершину на первую и последнюю позиции
      let idx = IndexOfTarget(trail, start); 
      trail.push(trail[idx]);
      let temp = trail[0];
      trail[0] = trail[idx];
      trail[idx] = temp;

      return trail;
    }

//инициализируем муравьев
function InitAnts(numAnts, numCities){
    let murav = new Array (numAnts);
    for (let k = 0; k < numAnts; ++k){
      let start = Math.round(Math.random() * (numCities - 1)); //начальная вершина генерируется случайным образом
      murav[k] = RandomTrail(start, numCities); //каждый мурав равен случайно созданому маршруту
    }
  return murav;
}

//инициализируем матрицу расстояний
function InitDistances(graph){
    NumberofCities = graph.getNodeIds().length;
    pathsLengthes = [];
    for (let i = 0; i < NumberofCities; i++){
        pathsLengthes.push(new Array(NumberofCities));
    }
    for (let i = 0; i < NumberofCities; i++){
        for (let j = 0; j < NumberofCities; j++){
            if (i == j){
                pathsLengthes[i][j] = 1000000000; //в самого себя нельзя сходить - поэтому сделаем расстояние максимально невыгодным
            }
            else{
              //заполняем матрицу
              pathsLengthes[i][j] = graph.getDistance(i, j);
              pathsLengthes[j][i] = graph.getDistance(i, j); 
            }
        }
    }
    return pathsLengthes;
}

//основная функция
function StartAntAlgorithm(graph){

    var numCities = graph.getNodeIds().length; //число городов (вершин графа) для обхода
    var dists = InitDistances(graph); //матрица расстояний
    var ants = InitAnts(numAnts, numCities); // initialize ants to random trails

    let bestTrail = BestTrail(ants, dists); //создаем первый лучший маршрут
    let bestLength = getLength(bestTrail, dists); //находим его длину
    let pheromones = InitPheromones(numCities);//матрица феромонов
    let time = 0; //на каком повторе цикла мы находимся

    let answer = setInterval(function(){
      if (time<maxTime && begin == true) {
          time++;

          UpdateAnts(ants, pheromones, dists); //обновляем муравьев
          UpdatePheromones(pheromones, ants, dists); //обновляем феромоны

          let currBestTrail = BestTrail(ants, dists); //находим лучший путь на конкретном шаго
          let currBestLength = getLength(currBestTrail, dists); //обновляем его длину

          //если длина пути на данном шаге меньше длины лучшего пути вообще - обновляем самых короткий путь 
          if (currBestLength < bestLength){
            bestLength = currBestLength;
            bestTrail = currBestTrail;
            console.log("New best length of " + bestLength + " found at time " + time);

            //рисуем заново путь
            showPath(bestTrail, graph, "canvas");

            //увеличиваем индексы самого лучшего пути на 1, для корректного отображения последовательности вершин
            let copy = [];
            copy = bestTrail.slice();
            for (let m = 0; m < copy.length; ++m) copy[m] += 1;
    
            //выводим лучший путь на данный момент и его длину
            showText('Current Path: '+ copy.join('-') + ',', "canvas", 45, 95, 'blue');
            showText(' length: ' + bestLength + '', "canvas", 45, 130, 'blue');
          }
          console.log("Best distance in " + time + ": " + bestLength); //выводим лучшую длину в консоль
        }
        else{
          if (time==maxTime){
            //если цикл закончился
            showPath(bestTrail, graph, "canvas"); //рисуем лучший путь
            console.log("Best Chromosom's length: " + bestLength);
            changeButton(); //кнопка остановки переходит в кнопку старта - тк цикл кончился

            //увеличиваем индексы самого лучшего пути на 1, для корректного отображения последовательности вершин
            let copy = [];
            copy = bestTrail.slice();
            for (let m = 0; m < copy.length; ++m) copy[m] += 1;
    
            //выводим лучший путь вообще и его длину
            showText('Best Path: '+ copy.join('-') + ',', "canvas", 45, 95, 'green');
            showText(' length: ' + bestLength + '', "canvas", 45, 130, 'green');

            //отчищаем интервал, для остановки функции
            clearInterval(answer);
          }
          else{
            //если функция была перезапущена - просто обновим интервал
            clearInterval(answer);
          }
        }
      }, delay);
    return answer;
}


