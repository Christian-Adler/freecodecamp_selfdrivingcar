class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.ctx = canvas.getContext('2d');

        this.selected = null;
        this.hovered = null;
        this.dragging = false;

        this.enabled = true;

        this.mouse = null; // from mousemove
    }

    enable() {
        this.#addEventListeners();
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.#removeEventListeners();
        this.selected = false;
        this.hovered = false;
    }

    #addEventListeners() {
        this.disable(); // just to be sure

        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundMouseUp = () => this.dragging = false;
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener('mousedown', this.boundMouseDown);
        this.canvas.addEventListener('mousemove', this.boundMouseMove);
        this.canvas.addEventListener('mouseup', this.boundMouseUp);
        this.canvas.addEventListener('contextmenu', this.boundContextMenu);

        window.addEventListener('keydown', (evt) => {
            if (this.hovered) {
                if (evt.key === 's') this.start = this.hovered;
                else if (evt.key === 'e') this.end = this.hovered;
            }
        });
    }

    #removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.boundMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundMouseUp);
        this.canvas.removeEventListener('contextmenu', this.boundContextMenu);
    }


    #handleMouseDown(evt) {
        if (evt.button === 2) { // right click
            if (this.selected)
                this.selected = null;
            else if (this.hovered)
                this.#removePoint(this.hovered);

        } else if (evt.button === 0) { // left click
            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) {
        graph.removePoint(point);
        this.hovered = null;
        if (point === this.selected)
            this.selected = null;
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        if (!this.enabled)
            return;
        this.graph.draw(ctx);
        if (this.hovered)
            this.hovered.draw(this.ctx, {fill: true});
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse; // snap to point
            new Segment(this.selected, intent).draw(ctx, {color: 'rgba(0,0,0,0.5)', dash: [3, 3]});
            this.selected.draw(this.ctx, {outline: true});
        }

        const path = this.graph.getShortestPath(this.start, this.end)
        for (const point of path) {
            point.draw(this.ctx, {size: 50, color: 'blue'});
            if (point.prev) {
                new Segment(point, point.prev).draw(this.ctx, {width: 5});
            }
        }
    }

}