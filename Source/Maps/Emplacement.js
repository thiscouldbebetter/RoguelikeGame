"use strict";
class Emplacement {
    constructor(appearance, collide, use) {
        this.appearance = appearance;
        this._collide = collide;
        this._use = use;
    }
    static fromAppearance(appearance) {
        return new Emplacement(appearance, null, null);
    }
    static fromAppearanceAndCollide(appearance, collide) {
        return new Emplacement(appearance, collide, null);
    }
    static fromAppearanceAndUse(appearance, use) {
        return new Emplacement(appearance, null, use);
    }
    collide(universe, world, place, entityColliding, entityCollidedWith) {
        if (this._collide != null) {
            this._collide(universe, world, place, entityColliding, entityCollidedWith);
        }
    }
    use(universe, world, place, entityUsing, entityUsed) {
        if (this._use == null) {
            entityUsing.player().messageLog.messageAdd("Nothing happens.");
        }
        else {
            this._use(universe, world, place, entityUsing, entityUsed);
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
