"use strict";
class Generatable extends EntityProperty {
    constructor(relativeFrequency) {
        super();
        this.relativeFrequency = relativeFrequency;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
