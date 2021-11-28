"use strict";
class Openable {
    constructor(isOpen, isLocked) {
        this.isOpen = isOpen;
        this.isLocked = isLocked;
    }
    // Clonable.
    clone() {
        return new Openable(this.isOpen, this.isLocked);
    }
    overwriteWith(other) {
        this.isOpen = other.isOpen;
        this.isLocked = other.isLocked;
        return this;
    }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
