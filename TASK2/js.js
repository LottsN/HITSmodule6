let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

let Points = []; //координаты точек
let Centroids = []; //координаты центроидов
let PointIndexToCentroidIndex = {}; //индекс каждой точки : индекс ее центроида
let AddPointByClick = false; //добавление точек кликом
let AddCentroidByClick = false; //добавление центроидов кликом
let Steps = [UpdatePoints,UpdateCentroids]; //массив функций для кластеризации
let Current;
let NextStepAfter;
let Pause;
let CycleActivation = false; //вкл-выкл цикл
let distance;
let DistancesTypes = {"Euclid": Euclid,"Manhatten": Manhatten}; //Выбор функции, по которой ищем расстояние

let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']; //цвета

//Привязка кнопок к функциям
let ButtonAddPointByClick = document.getElementById('AddPointByClick');
let ButtonRandomlyAddPoints = document.getElementById('RandomlyAddPoints');
let ButtonDeleteAllPoints = document.getElementById('DeleteAllPoints');
let ButtonAddCentroidByClick = document.getElementById('AddCentroidByClick');
let ButtonRandomlyAddCentroids = document.getElementById('RandomlyAddCentroids');
let ButtonDeleteAllCentroids = document.getElementById('DeleteAllCentroids');
let ButtonUpdatePoints = document.getElementById('UpdatePoints');
let ButtonUpdateCentroids = document.getElementById('UpdateCentroids');
let ButtonStart = document.getElementById('Start');
let AmoutOfRandomPoints = document.getElementById('AmoutOfRandomPoints');
let AmoutOfRandomCentroids = document.getElementById('AmoutOfRandomCentroids');
let DelayOfCycle = document.getElementById('DelayOfCycle');
let SelectDistance = document.getElementById('WhosDistance');


//Обработка нажатий на кнопки
canvas.addEventListener('click', (event) => Add(getPointClickedOnCanvas(event)), false);

//для точек
ButtonAddPointByClick.addEventListener('click', SwitchAddPointByClick, false);
ButtonRandomlyAddPoints.addEventListener('click', () => addDataPointsRandomly(+AmoutOfRandomPoints.value), false);
ButtonDeleteAllPoints.addEventListener('click', DeleteAllPoints, false);

//для центроидов
ButtonAddCentroidByClick.addEventListener('click', SwitchAddCentroidByClick, false);
ButtonRandomlyAddCentroids.addEventListener('click', () => addCentroidsRandomly(+AmoutOfRandomCentroids.value), false);
ButtonDeleteAllCentroids.addEventListener('click', DeleteAllCentroids, false);

//для цикла
ButtonUpdatePoints.addEventListener('click', UpdatePoints, false);
ButtonUpdateCentroids.addEventListener('click', UpdateCentroids, false);
ButtonStart.addEventListener('click', StartCycle, false);

//импортируем вводимые значения
AmoutOfRandomPoints.addEventListener('keyup', (event) => () => ButtonRandomlyAddPoints.click());
AmoutOfRandomCentroids.addEventListener('keyup', (event) => () => ButtonRandomlyAddCentroids.click());
DelayOfCycle.addEventListener('keyup', (event) =>  RestartCycle);

RenameDistanceHTML(); //отображение выбранного расстояния
ChangeDistance(); //изменяем функция подсчета на выбранную
SelectDistance.addEventListener('change', ChangeDistance, false); //получаем метод расчёта


//Функция для добавления точек \ центроидов(если их лимит не превышен)
function Add(point) {
    if (AddPointByClick) {
        Points.push(point);
        RedrawAllElements();
    } else if (AddCentroidByClick) {
        if (TryAddCentroid(point)) {
            RedrawAllElements();
        } else {
            alert('Max number of colors is 50!');
            SwitchAddCentroidByClick();
        }
    }
}


function getPointClickedOnCanvas(event) {
    let canvasRect = canvas.getBoundingClientRect();
    return [
        event.clientX - canvasRect.left - 1,
        event.clientY - canvasRect.top - 1
    ];
};

//функция для смены добавления с точек на центроид или выключения добавления кликом
function SwitchAddPointByClick() {
    if (AddCentroidByClick) {
        SwitchAddCentroidByClick();
    }
    AddPointByClick = !AddPointByClick;
    SwitchButtonText(ButtonAddPointByClick);
}

//случайное добавление точек
function addDataPointsRandomly(count) {
    for (let i = 0; i < count; ++i) {
        let NewPoint;
        do {
            NewPoint = [
                RandomNumber(0, canvas.width - 1),
                RandomNumber(0, canvas.height - 1)
            ];
        } while (NewPoint in Centroids);
        Points.push(NewPoint);
    }
    RedrawAllElements();
}

//удаление всех точек
function DeleteAllPoints() {
    Points = [];
    PointIndexToCentroidIndex = {};
    RedrawAllElements();
}

//функция для смены текста, когда меняем добавление кликом с точки на центроид
function SwitchAddCentroidByClick() {
    if (!AddCentroidByClick && CheckLimitOfColors()) {
        alert('Max number of colors is 50!');
        return;
    }
    if (AddPointByClick) {
        SwitchAddPointByClick();
    }
    AddCentroidByClick = !AddCentroidByClick;
    SwitchButtonText(ButtonAddCentroidByClick);
}

//рандомное добавление кол-ва точек
function addCentroidsRandomly(count) {
    let ReachedMaxAmount = false;
    for (let i = 0; i < count; ++i) {
        let NewCentroid;
        do {
            NewCentroid = [
                RandomNumber(0, canvas.width - 1),
                RandomNumber(0, canvas.height - 1)
            ];
        } while (NewCentroid in Centroids);
        if (!TryAddCentroid(NewCentroid)) {
            ReachedMaxAmount = true;
            break;
        }
    }
    RedrawAllElements();
    if (ReachedMaxAmount) {
        alert('Max number of colors is 50!');
    }
}

//Удаляем все центроиды
function DeleteAllCentroids() {
    Centroids = [];
    PointIndexToCentroidIndex = {};
    RedrawAllElements();
}

//обновляем принадлежность точек
function UpdatePoints() {
    Points.map((point, i) => {     //для каждой точки
        let MinDistance = 10000000000;  //находим расстояние
        let IndexOfClosestCentroid = undefined;
        Centroids.map((Centroid, k) => { //до каждого центроида
            let dist = distance(point, Centroid);
            if (dist < MinDistance) { //это будет наименьшее растояние
                MinDistance = dist; 
                IndexOfClosestCentroid = k;
            }
        });
        PointIndexToCentroidIndex[i] = IndexOfClosestCentroid; //приписывем к каждой точке ближайшей к ней центроид
    });
    RedrawAllElements();
}

//обновляем позицию центроидов
function UpdateCentroids() {
    Centroids.map((Centroid, i) => { //для каждого цетроида
        let PointsOfCentroid = Points.filter((_, k) => PointIndexToCentroidIndex[k] == i); //перебираем точки, для которых он ближайший
        let sumx = 0;
        let sumy = 0;
        if (PointsOfCentroid.length == 0) return;
        PointsOfCentroid.map(([x, y]) => {sumx += x; sumy += y;}); //суммируем их координаты
        Centroid[0] = sumx / PointsOfCentroid.length; //делим на количество и находим позицию центроида
        Centroid[1] = sumy / PointsOfCentroid.length;
    });
    RedrawAllElements();
}

//Функция начала цикла
function StartCycle() {
    SwitchButtonText(ButtonStart);
    if (!CycleActivation) {
        CycleActivation = true;
        Current = 0; //нынешний шаг
        NextStepAfter = +DelayOfCycle.value; //задержка
        if (isNaN(NextStepAfter) || NextStepAfter <= 0) {
            alert('Frequency must be not-negative number!');
            return;
        }
        NextStep(0);
    } else {
        clearTimeout(Pause); //выключаем таймер
        CycleActivation = false; //завершаем цикл
    }
}

//перезапуск цикл, если был остановлен
function RestartCycle() {
    if (CycleActivation) {
        StartCycle();
    }
    StartCycle();
}

//расстояние через Евклида
function Euclid(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

//расстояние через Манхэттана
function Manhatten(point1, point2) {
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

//Изменяем расстояние на выбранное на странице
function RenameDistanceHTML() {
    for (let name in DistancesTypes) {
        let option = document.createElement('option');
        option.value = option.innerHTML = name;
        SelectDistance.appendChild(option);
    }
}

//Изменить функцию подсчета на выбранное
function ChangeDistance() {
    distance = DistancesTypes[SelectDistance.value];
}

//перерисовка всех элементов
function RedrawAllElements() {
    canvas.width = canvas.width;
    Points.map(DrawSinglePoint);
    Centroids.map(DrawSingleCentroid);
}

//пробуем добавить центроид (проверка на лимит)
function TryAddCentroid(point) {
    if (CheckLimitOfColors()) {
        return false;
    }
    Centroids.push(point);
    return true;
}

//функция для смены текста на странице
function SwitchButtonText(button) {
    let text = button.innerHTML;
    button.innerHTML = button.getAttribute('data-toggle');
    button.setAttribute('data-toggle', text);
}


//генерация случайного целого числа по двум аргументам
function RandomNumber(min, max) {
    if (arguments.length == 1) {
        max = arguments[0];
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//проверка на лимит цветов
function CheckLimitOfColors() {
    return Centroids.length >= colors.length;
}

//функция для следущего шага после задержки
function NextStep(ChangeDelay) {
    let Delay = ChangeDelay != undefined ? ChangeDelay : NextStepAfter; //если задержки не было - присваеваем ее
    Pause = setTimeout(() => { Steps[Current](); Current = (Current + 1) % Steps.length; NextStep(); }, Delay); //выполнить следущий шаг после таймаута
}

//Рисуем одну точку
function DrawSinglePoint([x, y], index) {
    ctx.save();
        ctx.fillStyle = colors[PointIndexToCentroidIndex[index]];
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
    ctx.restore();
}

//Рисуем один центроид
function DrawSingleCentroid([x, y], index) {
    ctx.save()
        ctx.strokeStyle = ctx.fillStyle = colors[index];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
    ctx.restore();
}
