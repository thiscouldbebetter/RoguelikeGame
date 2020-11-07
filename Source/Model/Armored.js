"use strict";
class Armored extends EntityProperty {
    constructor() {
        super();
    }
    armorClassCalculate(u, w, p, e) {
        return 10; // todo
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
