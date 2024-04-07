const carCanvas = window.document.getElementById('carCanvas');
carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;
const carCtx = carCanvas.getContext('2d');

const miniMapCanvas = window.document.getElementById('miniMapCanvas');
miniMapCanvas.width = 300;
miniMapCanvas.height = 300;

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);

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

let roadBorders;
const target = world.markings.find(m => m instanceof Target);
if (target) {
    world.generateCorridor(myCar, target.center);
    roadBorders = world.corridor.borders.map(s => [s.p1, s.p2]);
} else
    roadBorders = world.roadBorders.map(s => [s.p1, s.p2]);

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

    const carSeg = getNearestSegment(myCar, world.corridor.skeleton);
    for (let i = 0; i < world.corridor.skeleton.length; i++) {
        const s = world.corridor.skeleton[i];
        s.draw(carCtx, {color: 'red', width: 5})
        if (s.equals(carSeg)) {
            const proj = s.projectPoint(myCar);
            proj.point.draw(carCtx);
            break;
        }
    }

    requestAnimationFrame(animate);
}