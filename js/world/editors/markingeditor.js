class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;

        this.targetSegments = targetSegments;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.mouse = null;
        this.intent = null;

        this.markings = world.markings;

        this.enabled = false;
    }

    // to be overwritten
    createMarking(center, directionVector) {
        return center;
    }

    // may be overwritten
    getMarkingDistanceToSegmentEndThreshold() {
        return this.world.roadWidth / 2;
    }

    // used in main.js in for loop     tool.editor.enable();
    // noinspection JSUnusedGlobalSymbols
    enable() {
        this.#addEventListeners();
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.#removeEventListeners();
    }

    #addEventListeners() {
        this.disable(); // just to be sure

        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('contextmenu', this.boundContextMenu);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }


    #handleMouseDown(evt) {
        if (evt.button === 0) { // left click
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        } else if (evt.button === 2) { // right click
            for (let i = 0; i < this.markings.length; i++) {
                const marking = this.markings[i];
                const polygon = marking.polygon;
                if (polygon.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        const segment = getNearestSegment(this.mouse, this.targetSegments, 10 * this.viewport.zoom);
        if (segment) {
            const projection = segment.projectPoint(this.mouse);

            const markingDistanceToSegmentEndThreshold = this.getMarkingDistanceToSegmentEndThreshold();
            const projectionPoint = projection.point;

            if (projection.offset >= 0 && projection.offset <= 1
                && distance(projectionPoint, segment.p1) > markingDistanceToSegmentEndThreshold
                && distance(projectionPoint, segment.p2) > markingDistanceToSegmentEndThreshold
            )
                this.intent = this.createMarking(projection.point, segment.directionVector());
            else
                this.intent = null;
        } else
            this.intent = null;
    }

    // used in main.js in for loop     tool.editor.display();
    // noinspection JSUnusedGlobalSymbols
    display() {
        if (!this.enabled)
            return;

        if (this.intent)
            this.intent.draw(this.ctx);
    }
}