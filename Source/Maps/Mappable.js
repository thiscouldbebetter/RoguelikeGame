"use strict";
class Mappable {
    constructor(defn) {
        this.defn = defn;
        this.mapCellOccupied = null;
        this.entitiesAlreadyCollidedWith = []; // hack
        this.collider = new Sphere(Coords.create(), 0);
    }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
