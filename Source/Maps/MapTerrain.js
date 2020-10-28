"use strict";
class MapTerrain {
    constructor(name, codeChar, costToTraverse, blocksVision, color, visual) {
        this.name = name;
        this.codeChar = codeChar;
        this.costToTraverse = costToTraverse || MapTerrain.AlmostInfinity;
        this.blocksVision = blocksVision;
        this.color = color;
        this.visual = visual;
    }
}
// Pathfinding seems to take longer using real infinity.
MapTerrain.AlmostInfinity = 1000000;
