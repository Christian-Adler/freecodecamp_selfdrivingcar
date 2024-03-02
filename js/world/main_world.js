const canvas = window.document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;

let world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const graph = world.graph;

const viewport = new Viewport(canvas, world.zoom, world.offset);

const tools = {
    graph: {button: elById('graphBtn'), editor: new GraphEditor(viewport, graph)},
    stop: {button: elById('stopBtn'), editor: new StopEditor(viewport, world)},
    crossing: {button: elById('crossingBtn'), editor: new CrossingEditor(viewport, world)},
    start: {button: elById('startBtn'), editor: new StartEditor(viewport, world)},
    parking: {button: elById('parkingBtn'), editor: new ParkingEditor(viewport, world)},
    light: {button: elById('lightBtn'), editor: new LightEditor(viewport, world)},
    target: {button: elById('targetBtn'), editor: new TargetEditor(viewport, world)},
    yield: {button: elById('yieldBtn'), editor: new YieldEditor(viewport, world)},
};

setMode('graph');

let oldGraphHash = graph.hash();

animate();

function animate() {
    viewport.reset();

    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);

    ctx.globalAlpha = 0.8;
    for (const tool of Object.values(tools)) {
        tool.editor.display();
    }

    requestAnimationFrame(animate);
}

function dispose() {
    tools['graph'].editor.dispose();
    world.markings.length = 0;
}

function save() {
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const a = document.createElement('a');
    a.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(
        'if (!Settings || Settings.worldFromFile) world = World.load(' +
        JSON.stringify(world)
        + ');'));
    const fileName = "world.js";
    a.setAttribute('download', fileName);
    a.click();

    localStorage.setItem('world', JSON.stringify(world));
}

function load(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (evt) => {
        const fileContent = evt.target.result;
        const jsonData = JSON.parse(fileContent);

        world = World.load(jsonData);

        localStorage.setItem('world', JSON.stringify(world));
        location.reload();
    }
}

function setMode(mode) {
    disableEditors();

    const tool = tools[mode];
    tool.button.style.backgroundColor = 'white';
    tool.button.style.filter = '';
    tool.editor.enable();
}

function disableEditors() {
    for (const tool of Object.values(tools)) {
        tool.editor.disable();
        tool.button.style.backgroundColor = 'gray';
        tool.button.style.filter = 'grayscale(100%)';
    }
}

function openOsmPanel() {
    elById('osmPanel').style.display = 'block';
}

function closeOsmPanel() {
    elById('osmPanel').style.display = 'none';
}

function parseOsmData() {
    const data = elById('osmDataContainer').value;
    if (data === '') {
        alert('Paste data first');
        return;
    }

    const res = Osm.parseRoads(JSON.parse(data));
    graph.points = res.points;
    graph.segments = res.segments;
    closeOsmPanel();
}
