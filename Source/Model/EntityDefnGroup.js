"use strict";
class EntityDefnGroup {
    constructor(name, relativeFrequency, entityDefns) {
        this.name = name;
        this.relativeFrequency = relativeFrequency;
        this.entityDefns = entityDefns;
        this._entityDefnsByName = ArrayHelper.addLookupsByName(entityDefns);
    }
    entityDefnByName(entityDefnName) {
        return this._entityDefnsByName.get(entityDefnName);
    }
}
