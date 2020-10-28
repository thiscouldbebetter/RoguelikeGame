"use strict";
class Effector extends EntityProperty {
    constructor(effects) {
        super();
        this.effects = effects || [];
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
