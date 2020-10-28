"use strict";
class Searchable extends EntityProperty {
    constructor(chanceOfDiscoveryPerSearch, isHidden, discover) {
        super();
        this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
        this.isHidden = isHidden || false;
        this.discover = discover;
    }
    clone() {
        return new Searchable(this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover);
    }
    overwriteWith(other) { return this; }
}
