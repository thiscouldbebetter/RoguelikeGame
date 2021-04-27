"use strict";
class Emplacement {
    constructor(appearance, use) {
        this.appearance = appearance;
        this._use = use;
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
