"use strict";
class MoverTransport {
    constructor(entityMover, locDestination) {
        this.entityMover = entityMover;
        this.locDestination = locDestination;
    }
    initialize(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var entityTransport = uwpe.entity;
        var moverLoc = this.entityMover.locatable().loc;
        var placeToDepart = moverLoc.place(world);
        placeToDepart.entitiesToRemove.push(this.entityMover);
        // hack
        var collidable = this.entityMover.mappable();
        var cellOccupied = collidable.mapCellOccupied;
        var entitiesPresentInCellOccupied = cellOccupied.entitiesPresent;
        entitiesPresentInCellOccupied.splice(entitiesPresentInCellOccupied.indexOf(this.entityMover), 1);
        moverLoc.overwriteWith(this.locDestination);
        place.entitiesToSpawn.push(this.entityMover);
        place.entitiesToRemove.push(entityTransport);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
