"use strict";
class Activity2 extends Activity {
    constructor(defnName, target) {
        super(defnName, null);
        this.targetSet(target);
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
