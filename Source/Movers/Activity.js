"use strict";
class Activity2 {
    constructor(defnName, target) {
        this.defnName = defnName;
        this.target = target;
    }
    // instance methods
    defn(world) {
        return world.defn2.activityDefn2sByName.get(this.defnName);
    }
    initialize(universe, world, place, actor) {
        this.defn(world).initialize(universe, world, place, actor, this);
    }
    perform(universe, world, place, actor) {
        this.defn(world).perform(universe, world, place, actor, this);
    }
}
