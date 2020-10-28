"use strict";
class Mover extends EntityProperty {
    constructor(movesPerTurn) {
        super();
        this.movesPerTurn = movesPerTurn;
    }
    initialize(universe, world, place, entityAsEntity) {
        var entity = entityAsEntity;
        var mover = entity.mover();
        mover.movesThisTurn = mover.movesPerTurn;
        if (entity.turnable() == null) {
            var turnable = new Turnable((universe, world, place, entityAsEntity) => {
                var entity = entityAsEntity;
                var mover = entity.mover();
                mover.movesThisTurn += mover.movesPerTurn;
                var effectable = entity.effectable2();
                if (effectable != null) {
                    effectable.updateForTurn(universe, world, place, entity);
                }
                entity.turnable().hasActedThisTurn = false;
            });
            entity.propertyAddForPlace(turnable, place);
        }
    }
    updateForTimerTick(universe, world, placeAsPlace, entity) {
        var place = placeAsPlace;
        var entityLoc = entity.locatable().loc;
        entityLoc.pos.trimToRangeMax(place.map.sizeInCellsMinusOnes);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
