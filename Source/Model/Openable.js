"use strict";
class Openable extends EntityProperty {
    constructor(isOpen) {
        super();
        this.isOpen = isOpen;
    }
    clone() {
        return new Openable(this.isOpen);
    }
    overwriteWith(other) {
        return this; // todo
    }
}
