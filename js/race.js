const rightPanelWidth = 300;

const carCanvas = window.document.getElementById('carCanvas');
carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;
const carCtx = carCanvas.getContext('2d');

const miniMapCanvas = window.document.getElementById('miniMapCanvas');
miniMapCanvas.width = rightPanelWidth;
miniMapCanvas.height = rightPanelWidth;

const statisticsDiv = window.document.getElementById('statistics');
statisticsDiv.style.width = rightPanelWidth + 'px';
statisticsDiv.style.height = window.innerHeight - rightPanelWidth - 60 + 'px';


const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, rightPanelWidth);

const useCarImg = Settings.useCarImage; // Only low N if using img!
const N = Settings.numCars; // useCarImg ? 100 : 1000;
const cars = generateCars(1, useCarImg, 'KEYS').concat(generateCars(N, useCarImg, 'AI'));
const myCar = cars[0];
const savedBrain = localStorage.getItem("bestBrain");
if (savedBrain) {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.brain = JSON.parse(savedBrain);
        if (i > 1) // 0 == myCar -> 1 is saved brain - others mutate
            NeuralNetwork.mutate(car.brain, Settings.mutationFactor);
    }
}

for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    const div = document.createElement('div');
    div.id = 'stat_' + i;
    div.innerText = i;
    div.style.color = car.color;
    div.classList.add('stat');
    statisticsDiv.appendChild(div);
}

let roadBorders;
const target = world.markings.find(m => m instanceof Target);
if (target) {
    world.generateCorridor(myCar, target.center);
    roadBorders = world.corridor.borders.map(s => [s.p1, s.p2]);
} else
    roadBorders = world.roadBorders.map(s => [s.p1, s.p2]);

let frameCount = 0;
animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(myCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(N, useCarImg, type) {
    const startPoints = world.markings.filter(m => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir) + Math.PI / 2;
    const cars = [];
    for (let i = 0; i < N; i++) {
        const color = type === 'AI' ? getRandomColor() : 'purple';
        const car = new Car(startPoint.x, startPoint.y, 30, 50, type, startAngle, 3, color, useCarImg);
        car.load(carInfo)
        cars.push(car);
    }
    return cars;
}

function updateCarProgress(car) {
    if (!car.finishTime) {
        car.progress = 0;
        const carSeg = getNearestSegment(car, world.corridor.skeleton);
        for (let i = 0; i < world.corridor.skeleton.length; i++) {
            const s = world.corridor.skeleton[i];
            if (s.equals(carSeg)) {
                const proj = s.projectPoint(car);
                // proj.point.draw(carCtx);
                const firstPartOfSegment = new Segment(s.p1, proj.point);
                // firstPartOfSegment.draw(carCtx, {color: 'red', width: 5})
                car.progress += firstPartOfSegment.length();
                break;
            } else {
                // s.draw(carCtx, {color: 'red', width: 5})
                car.progress += s.length();
            }
        }
        const totalDistance = world.corridor.skeleton.reduce((acc, s) => acc + s.length(), 0);
        car.progress /= totalDistance;
        if (car.progress > 1) {
            car.progress = 1;
            car.finishTime = frameCount;
            console.log(car.finishTime);
        }
        console.log(car.progress);
    }
}

function animate() {
    for (const car of cars) {
        car.update(roadBorders, []);
    }

    world.cars = cars;
    world.bestCar = myCar;

    // follow car (but panning is no longer possible)
    if (myCar) {
        viewport.offset.x = -myCar.x;
        viewport.offset.y = -myCar.y;
    } else {
        console.log("no best car?");
    }

    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);

    miniMap.update(viewPoint);

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        updateCarProgress(car);
    }

    cars.sort((a, b) => b.progress - a.progress);

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        updateCarProgress(car);
        const stat = document.getElementById('stat_' + i);
        stat.style.color = car.color;
        stat.innerText = (i + 1) + ' : ' + (cars[i].progress * 100).toFixed(1) + '%';
    }

    frameCount++;

    requestAnimationFrame(animate);
}