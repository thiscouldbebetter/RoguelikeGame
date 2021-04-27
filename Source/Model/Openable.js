"use strict";
class Openable {
    constructor(isOpen, isLocked) {
        this.isOpen = isOpen;
        this.isLocked = isLocked;
    }
    clone() {
        return new Openable(this.isOpen, this.isLocked);
    }
    overwriteWith(other) {
        this.isOpen = other.isOpen;
        this.isLocked = other.isLocked;
        return this;
    }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
