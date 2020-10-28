"use strict";
class ActorData extends EntityProperty {
    constructor() {
        super();
    }
    activity_Get() { return this._activity; }
    activity_Set(universe, world, place, actor, value) {
        this._activity = value;
        this._activity.initialize(universe, world, place, actor);
    }
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
}
