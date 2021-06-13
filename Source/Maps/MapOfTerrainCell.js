"use strict";
class MapOfTerrainCell {
    constructor(terrainCode, entitiesPresent) {
        this.terrainCode = terrainCode;
        this.entitiesPresent = entitiesPresent || new Array();
    }
    blocksVision(map) {
        var returnValue = this.terrain(map).blocksVision;
        if (returnValue == false) {
            for (var i = 0; i < this.entitiesPresent.length; i++) {
                var entityPresent = this.entitiesPresent[i];
                if (entityPresent.mappableDefn().blocksVision(entityPresent)) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    }
    costToTraverse(map, mover) {
        var terrain = this.terrain(map);
        var returnValue = mover.costToTraverseTerrain(terrain);
        for (var i = 0; i < this.entitiesPresent.length; i++) {
            var entityPresent = this.entitiesPresent[i];
            if (entityPresent.mappableDefn().blocksMovement(entityPresent)) {
                returnValue = MapTerrain.AlmostInfinity;
                break;
            }
        }
        return returnValue;
    }
    overwriteWith(other) {
        this.terrainCode = other.terrainCode;
        this.entitiesPresent.length = 0;
        this.entitiesPresent.push(...other.entitiesPresent);
        return this;
    }
    terrain(map) {
        return map.terrainsByCode.get(this.terrainCode);
    }
}
