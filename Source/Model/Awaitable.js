"use strict";
class Awaitable extends EntityProperty {
    constructor() {
        super();
        this.isDone = false;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
