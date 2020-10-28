"use strict";
class Mappable extends EntityProperty {
    constructor(defn) {
        super();
        this.defn = defn;
        this.mapCellOccupied = null;
        this.entitiesAlreadyCollidedWith = []; // hack
        this.collider = new Sphere(new Coords(0, 0, 0), 0);
    }
}
