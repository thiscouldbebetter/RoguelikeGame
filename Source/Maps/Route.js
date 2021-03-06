"use strict";
class Route2 {
    constructor(map, startPos, goalPos, lengthMax, mover) {
        this.map = map;
        this.startPos = startPos;
        this.goalPos = goalPos;
        this.lengthMax = lengthMax || Number.POSITIVE_INFINITY;
        this.mover = mover;
        // Helper variables.
        this._tempPos = Coords.create();
    }
    calculate() {
        var map = this.map;
        var startPos = this.startPos.clone();
        var goalPos = this.goalPos.clone();
        var tempPos = this._tempPos;
        var openList = new Array();
        var openLookup = new Map();
        var closedLookup = new Map();
        var costToGoalEstimated = tempPos.overwriteWith(goalPos).subtract(startPos).absolute().clearZ().sumOfDimensions();
        var startNode = new Route2Node(startPos, // cellPos
        0, // costFromStart
        costToGoalEstimated, null // prev
        );
        openList.push(startNode);
        var startIndex = startNode.cellPos.y
            * map.sizeInCells.x
            + startNode.cellPos.x;
        openLookup.set(startIndex, startNode);
        while (openList.length > 0) // && openList.length < this.lengthMax)
         {
            var current = openList[0];
            if (current.cellPos.equalsXY(goalPos)) {
                break;
            }
            openList.splice(0, 1);
            var currentIndex = current.cellPos.y
                * map.sizeInCells.x
                + current.cellPos.x;
            openLookup.delete(currentIndex);
            closedLookup.set(currentIndex, current);
            var neighbors = this.getNeighborsForNode(map, current, goalPos);
            for (var n = 0; n < neighbors.length; n++) {
                var neighbor = neighbors[n];
                var neighborPos = neighbor.cellPos;
                var neighborIndex = neighborPos.y
                    * map.sizeInCells.x
                    + neighborPos.x;
                if (closedLookup.get(neighborIndex) == null && openLookup.get(neighborIndex) == null) {
                    var i;
                    for (i = 0; i < openList.length; i++) {
                        var nodeFromOpenList = openList[i];
                        if (neighbor.costFromStart < nodeFromOpenList.costFromStart) {
                            break;
                        }
                    }
                    openList.splice(i, 0, neighbor);
                    openLookup.set(neighborIndex, neighbor);
                }
            }
        }
        this.nodes = new Array();
        var best = openList[0];
        if (best != null) {
            var current = best;
            while (current != null) {
                this.nodes.splice(0, 0, current);
                current = current.prev;
            }
        }
    }
    getNeighborsForNode(map, node, goalPos) {
        var returnValues = new Array();
        var originalPos = node.cellPos;
        var neighborPos = originalPos.clone();
        var neighborPositions = new Array();
        var mapSizeInCellsMinusOnes = map.sizeInCellsMinusOnes;
        var directions = Direction.Instances()._ByHeading;
        for (var i = 0; i < directions.length; i++) {
            var direction = directions[i];
            neighborPos.overwriteWith(originalPos).add(direction);
            if (neighborPos.isInRangeMax(mapSizeInCellsMinusOnes) == true) {
                neighborPositions.push(neighborPos.clone());
            }
        }
        var tempPos = this._tempPos;
        for (var i = 0; i < neighborPositions.length; i++) {
            var neighborPos = neighborPositions[i];
            var costToTraverse = map.cellAtPos(neighborPos).costToTraverse(map, this.mover);
            costToTraverse *= tempPos.overwriteWith(neighborPos).subtract(originalPos).magnitude();
            var neighborNode = new Route2Node(neighborPos, node.costFromStart + costToTraverse, costToTraverse + tempPos.overwriteWith(goalPos).subtract(neighborPos).absolute().clearZ().sumOfDimensions(), node);
            returnValues.push(neighborNode);
        }
        return returnValues;
    }
}
class Route2Node {
    constructor(cellPos, costFromStart, costToGoalEstimated, prev) {
        this.cellPos = cellPos;
        this.costFromStart = costFromStart;
        this.costToGoalEstimated = costToGoalEstimated;
        this.prev = prev;
    }
}
