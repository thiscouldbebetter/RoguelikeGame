"use strict";
class ActorDefn extends EntityProperty {
    constructor(activityDefnNameInitial) {
        super();
        this.activityDefnNameInitial = activityDefnNameInitial;
    }
    initialize(universe, world, place, entityAsEntity) {
        var entity = entityAsEntity;
        var actorData = new ActorData();
        entity.propertyAddForPlace(actorData, place);
        actorData.actions = [];
        var activity = new Activity2(entity.actorDefn().activityDefnNameInitial, null);
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
}
