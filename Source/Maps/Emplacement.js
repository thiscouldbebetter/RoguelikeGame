"use strict";
class Emplacement extends EntityProperty {
    constructor(appearance, use) {
        super();
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
}
