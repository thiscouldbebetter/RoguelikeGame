"use strict";
class ActorDefn {
    constructor(activityDefnNameInitial) {
        this.activityDefnNameInitial = activityDefnNameInitial;
    }
    initialize(universe, world, place, entityAsEntity) {
        var entity = entityAsEntity;
        var actorData = new ActorData();
        entity.propertyAddForPlace(actorData, place);
        actorData.actions = [];
        var activity = Activity.fromDefnName(entity.actorDefn().activityDefnNameInitial);
        actorData.activity_Set(universe, world, place, entity, activity);
    }
    updateForTimerTick(universe, world, place, entityAsEntity) {
        var entity = entityAsEntity;
        if (entity.killable() == null || entity.killable().isAlive()) {
            var actorData = entity.actorData();
            actorData.activity_Get().perform(universe, world, place, entity);
            var entityActions = actorData.actions;
            for (var a = 0; a < entityActions.length; a++) {
                var action = entityActions[a];
                action.perform(universe, world, place, entity);
            }
            if (entityActions.length > 0) {
                place.hasBeenUpdatedSinceDrawn = true;
            }
            entityActions.length = 0;
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(u, w, p, e) { }
}
