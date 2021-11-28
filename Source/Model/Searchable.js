"use strict";
class Searchable {
    constructor(chanceOfDiscoveryPerSearch, isHidden, discover) {
        this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
        this.isHidden = isHidden || false;
        this.discover = discover;
    }
    // Clonable.
    clone() {
        return new Searchable(this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover);
    }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
