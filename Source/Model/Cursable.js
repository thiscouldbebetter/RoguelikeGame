"use strict";
class Cursable extends EntityProperty {
    constructor(blessingLevel) {
        super();
        this.blessingLevel = blessingLevel;
    }
    bless() {
        if (this.isBlessed() == false) {
            this.blessingLevel++;
        }
    }
    curse() {
        if (this.isCursed() == false) {
            this.blessingLevel--;
        }
    }
    isBlessed() {
        return (this.blessingLevel > 0);
    }
    isCursed() {
        return (this.blessingLevel < 0);
    }
    // Clonable.
    clone() {
        return new Cursable(this.blessingLevel);
    }
    overwriteWith(other) {
        this.blessingLevel = other.blessingLevel;
        return this;
    }
}
