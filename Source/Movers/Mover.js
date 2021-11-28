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
    initialize(uwpe) {
        var place = uwpe.place;
        var entity = uwpe.entity;
        var mover = entity.mover();
        mover.movesThisTurn = mover.movesPerTurn;
        if (entity.turnable() == null) {
            var turnable = new Turnable((uwpe) => {
                var entity = uwpe.entity;
                var mover = entity.mover();
                mover.movesThisTurn += mover.movesPerTurn;
                var effectable = entity.effectable2();
                if (effectable != null) {
                    effectable.updateForTurn(uwpe);
                }
                entity.turnable().hasActedThisTurn = false;
            });
            entity.propertyAddForPlace(turnable, place);
        }
    }
    updateForTimerTick(uwpe) {
        var place = uwpe.place;
        var entity = uwpe.entity;
        var entityLoc = entity.locatable().loc;
        entityLoc.pos.trimToRangeMax(place.map.sizeInCellsMinusOnes);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
}
