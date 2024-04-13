class CrossingEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.graph.segments);
    }

    createMarking(center, directionVector) {
        return new Crossing(center, directionVector, this.world.roadWidth, this.world.roadWidth / 2);
    }

    getMarkingDistanceToSegmentEndThreshold() {
        return this.world.roadWidth * 3 / 4;
    }
}