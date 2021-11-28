"use strict";
class MappableDefn {
    constructor(blocksMovement, blocksVision) {
        this.blocksMovement = blocksMovement;
        this.blocksVision = blocksVision;
    }
    static Instances() {
        if (MappableDefn._instances == null) {
            MappableDefn._instances = new MappableDefn_Instances();
        }
        return MappableDefn._instances;
    }
    // entity
    initialize(uwpe) {
        var place = uwpe.place;
        var entity = uwpe.entity;
        var mappable = new Mappable(entity.mappableDefn());
        var map = place.map;
        var entityPosInCells = entity.locatable().loc.pos;
        var mapCellOccupied = map.cellAtPos(entityPosInCells);
        mapCellOccupied.entitiesPresent.push(entity);
        mappable.mapCellOccupied = mapCellOccupied;
        entity.propertyAddForPlace(mappable, place);
        //entity.collidable = entity.mappable; // hack
    }
    updateForTimerTick(uwpe) {
        // todo
    }
    // Cloneable.
    clone() {
        return this; // hack
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
}
class MappableDefn_Instances {
    constructor() {
        this.Blocking = new MappableDefn((e) => true, (e) => true);
        this.Concealing = new MappableDefn((e) => false, (e) => true);
        this.Open = new MappableDefn((e) => false, (e) => false);
        this.Transparent = new MappableDefn((e) => true, (e) => false);
    }
}
