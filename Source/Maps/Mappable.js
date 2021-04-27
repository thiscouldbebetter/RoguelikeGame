"use strict";
class Mappable {
    constructor(defn) {
        this.defn = defn;
        this.mapCellOccupied = null;
        this.entitiesAlreadyCollidedWith = []; // hack
        this.collider = new Sphere(Coords.create(), 0);
    }
    // collider() { return new Sphere(0, 0); }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
