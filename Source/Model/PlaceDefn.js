"use strict";
class PlaceDefn2 {
    constructor(name, propertyNamesToProcess, terrains, placeGenerate) {
        this.name = name;
        this.propertyNamesToProcess = propertyNamesToProcess;
        this.terrains = terrains;
        this.placeGenerate = placeGenerate;
        this.terrainsByCode = ArrayHelper.addLookups(this.terrains, (element) => element.codeChar);
        this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);
    }
}
