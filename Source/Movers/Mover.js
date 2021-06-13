"use strict";
class Mover {
    constructor(movesPerTurn, costToTraverseTerrain) {
        this.movesPerTurn = movesPerTurn;
        this._costToTraverseTerrain = costToTraverseTerrain;
    }
    static fromMovesPerTurn(movesPerTurn) {
        return new Mover(movesPerTurn, null);
    }
    costToTraverseTerrain(terrainToTraverse) {
        var returnValue;
        if (this._costToTraverseTerrain == null) {
            returnValue = terrainToTraverse.costToTraverse;
        }
        else {
            returnValue = this._costToTraverseTerrain(terrainToTraverse);
        }
        return returnValue;
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
    // EntityProperty.
    finalize(u, w, p, e) { }
}
