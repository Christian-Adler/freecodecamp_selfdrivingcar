const carCanvas = window.document.getElementById('carCanvas');
carCanvas.width = window.innerWidth - 330;
carCanvas.height = window.innerHeight;
const carCtx = carCanvas.getContext('2d');

const networkCanvas = window.document.getElementById('networkCanvas');
networkCanvas.width = 300;
networkCanvas.height = window.innerHeight - 310;
const networkCtx = networkCanvas.getContext('2d');

const miniMapCanvas = window.document.getElementById('miniMapCanvas');
miniMapCanvas.width = 300;
miniMapCanvas.height = 300;

if (!Settings.worldFromFile) {
    const worldString = localStorage.getItem('world');
    const worldInfo = worldString ? JSON.parse(worldString) : null;

    world = worldInfo ? World.load(worldInfo) : new World(new Graph());
}
// else
//   world already defined in big_world.js

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

const useCarImg = Settings.useCarImage; // Only low N if using img!
const N = Settings.numCars; // useCarImg ? 100 : 1000;
const cars = generateCars(N, useCarImg);
let bestCar = cars[0];
const savedBrain = localStorage.getItem("bestBrain");
if (savedBrain) {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.brain = JSON.parse(savedBrain);
        if (i !== 0)
            NeuralNetwork.mutate(car.brain, 0.15);
    }
}

const traffic = [];
const roadBorders = world.roadBorders.map(s => [s.p1, s.p2]);

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(N, useCarImg) {
    const startPoints = world.markings.filter(m => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir) + Math.PI / 2;
    const cars = [];
    for (let i = 0; i < N; i++) {
        const car = new Car(startPoint.x, startPoint.y, 30, 50, Settings.controlType, startAngle, 3, "purple", useCarImg);
        car.load(carInfo)
        cars.push(car);
    }
    return cars;
}

function animate(time) {
    for (const c of traffic) {
        c.update(roadBorders, []);
    }
    for (const car of cars) {
        car.update(roadBorders, traffic);
    }

    const carsMaxFitness = Math.max(...cars.map(c => c.fitness));
    bestCar = cars.find(c => c.fitness === carsMaxFitness);
    if (!bestCar) bestCar = cars[0];

    world.cars = cars;
    world.bestCar = bestCar;

    // follow car (but panning is no longer possible)
    if (bestCar) {
        viewport.offset.x = -bestCar.x;
        viewport.offset.y = -bestCar.y;
    } else {
        console.log("no best car?");
    }

    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);

    miniMap.update(viewPoint);

    for (const c of traffic) {
        c.draw(carCtx);
    }

    networkCtx.lineDashOffset = -time / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    if (bestCar)
        Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}