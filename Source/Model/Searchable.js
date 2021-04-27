"use strict";
class Searchable {
    constructor(chanceOfDiscoveryPerSearch, isHidden, discover) {
        this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
        this.isHidden = isHidden || false;
        this.discover = discover;
    }
    clone() {
        return new Searchable(this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover);
    }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
