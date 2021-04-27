"use strict";
class MoverTransport {
    constructor(entityMover, locDestination) {
        this.entityMover = entityMover;
        this.locDestination = locDestination;
    }
    initialize(universe, world, place, entityTransport) {
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
    // EntityProperty.
    finalize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
