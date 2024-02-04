const carCanvas = window.document.getElementById('carCanvas');
carCanvas.width = window.innerWidth - 330;
carCanvas.height = window.innerHeight;

const networkCanvas = window.document.getElementById('networkCanvas');
networkCanvas.width = 300;
networkCanvas.height = window.innerHeight;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;

const world = worldInfo ? World.load(worldInfo) : new World(new Graph());

const viewport = new Viewport(carCanvas, world.zoom, world.offset);

// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 3, "blue");
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3, "blue");
const useCarImg = true; // Only low N if using img!
const N = 1; // useCarImg ? 100 : 1000;
const cars = generateCars(N, useCarImg);
let bestCar = cars[0];
const savedBrain = localStorage.getItem("bestBrain");
if (savedBrain) {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.brain = JSON.parse(savedBrain);
        if (i !== 0)
            NeuralNetwork.mutate(car.brain, 0.05);
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
        cars.push(new Car(startPoint.x, startPoint.y, 30, 50, "KEYS", startAngle, 3, "purple", useCarImg));
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

    const carsMinY = Math.min(...cars.map(c => c.y));
    bestCar = cars.find(c => c.y === carsMinY);

    world.cars = cars;
    world.bestCar = bestCar;

    // follow car (but panning is no longer possible)
    viewport.offset.x = -bestCar.x;
    viewport.offset.y = -bestCar.y;

    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);

    for (const c of traffic) {
        c.draw(carCtx);
    }

    networkCtx.lineDashOffset = -time / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}