class StartEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Start(center, directionVector, this.world.roadWidth / 2, world.roadWidth / 2);
    }

    getMarkingDistanceToSegmentEndThreshold() {
        return this.world.roadWidth / 2;
    }
}