"use strict";
class ActorData {
    activity() { return this._activity; }
    actionAdd(action) {
        this.actions.push(action);
    }
    activitySet(uwpe, value) {
        this._activity = value;
        //this._activity.initialize(universe, world, place, actor);
    }
    entityBeingFaced(uwpe) {
        var place = uwpe.place;
        var actor = uwpe.entity;
        var returnValue = null;
        var actorLoc = actor.locatable().loc;
        var directionFacing = actorLoc.orientation.forward.clone().directions();
        var posInCellsDestination = actorLoc.pos.clone().add(directionFacing);
        var map = place.map;
        var cellDestination = map.cellAtPos(posInCellsDestination);
        if (cellDestination != null) {
            var entitiesInCellDestination = cellDestination.entitiesPresent;
            if (entitiesInCellDestination.length > 0) {
                returnValue = entitiesInCellDestination[0];
            }
        }
        return returnValue;
    }
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
