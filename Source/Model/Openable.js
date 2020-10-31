"use strict";
class Openable extends EntityProperty {
    constructor(isOpen, isLocked) {
        super();
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
}
