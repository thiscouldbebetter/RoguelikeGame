"use strict";
class ActorData {
    activity_Get() { return this._activity; }
    activity_Set(universe, world, place, actor, value) {
        this._activity = value;
        //this._activity.initialize(universe, world, place, actor);
    }
    entityBeingFaced(u, w, place, actor) {
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
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
