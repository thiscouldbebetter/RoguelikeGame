"use strict";
class PlaceDefnLevel extends PlaceDefn {
    constructor(name, propertyNamesToProcess, terrains, placeGenerate) {
        super(name, null, null, propertyNamesToProcess, null, null);
        this.terrains = terrains;
        this.placeGenerate = placeGenerate;
        this.terrainsByCode = ArrayHelper.addLookups(this.terrains, (element) => element.codeChar);
        this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);
    }
}
