"use strict";
class ActorDefn {
    constructor(activityDefnNameInitial) {
        this.activityDefnNameInitial = activityDefnNameInitial;
    }
    initialize(uwpe) {
        var entity = uwpe.entity;
        var actorData = new ActorData();
        entity.propertyAddForPlace(actorData, uwpe.place);
        actorData.actions = [];
        var activity = Activity.fromDefnName(entity.actorDefn().activityDefnNameInitial);
        actorData.activitySet(uwpe, activity);
    }
    updateForTimerTick(uwpe) {
        var entity = uwpe.entity;
        if (entity.killable() == null || entity.killable().isAlive()) {
            var actorData = entity.actorData();
            actorData.activity().perform(uwpe);
            var entityActions = actorData.actions;
            for (var a = 0; a < entityActions.length; a++) {
                var action = entityActions[a];
                action.perform(uwpe);
            }
            if (entityActions.length > 0) {
                uwpe.place.hasBeenUpdatedSinceDrawn = true;
            }
            entityActions.length = 0;
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
}
