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
    collide(uwpe) {
        if (this._collide != null) {
            this._collide(uwpe);
        }
    }
    use(uwpe) {
        if (this._use == null) {
            uwpe.entity.player().messageLog.messageAdd("Nothing happens.");
        }
        else {
            this._use(uwpe);
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
