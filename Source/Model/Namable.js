"use strict";
class Namable2 extends EntityProperty {
    constructor(name, appearance) {
        super();
        this.name = name;
        this.appearance = appearance;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
