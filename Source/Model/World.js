"use strict";
class World2 extends World {
    constructor(name, defn, places, entityForPlayer, randomizer) {
        super(name, null, defn, places);
        this.defn2 = defn;
        this.entityForPlayer = entityForPlayer;
        this.randomizer = randomizer;
        this.placesByName = ArrayHelper.addLookupsByName(this.places);
        if (this.entityForPlayer == null) {
            var place0 = this.places[0];
            var portal0 = place0.entitiesToSpawn[0]; // hack
            var portal0Pos = portal0.locatable().loc.pos.clone();
            var entityDefnPlayer = this.defn2.entityDefnByName("Player");
            this.entityForPlayer = Entity2.fromNameDefnAndProperties(entityDefnPlayer.name, entityDefnPlayer, [
                new Locatable(new Disposition(portal0Pos, null, place0.name))
            ]);
            this.entityForPlayer.demographics().rank = 1; // hack
            ArrayHelper.insertElementAt(place0.entitiesToSpawn, this.entityForPlayer, 0);
        }
        this.placeNext = this.placesByName.get(this.entityForPlayer.locatable().loc.placeName);
        this.turnsSoFar = 0;
        this.idHelper = IDHelper.Instance();
        this.sightHelper = new SightHelper(8);
        this.timerTicksSoFar = 0;
        var itemDefns = this.defn2.entityDefns.filter((x) => x.itemDefn() != null).map((x) => x.itemDefn());
        var itemDefnsByName = ArrayHelper.addLookupsByName(itemDefns);
        this.defns =
            {
                "itemDefns": itemDefnsByName
            };
    }
    static create(universe) {
        var randomizer = RandomizerLCG.default();
        var visualsForTiles = new Array();
        var imageTileset = universe.mediaLibrary.imageGetByName("Tiles");
        //var visualImageTileset = new VisualImageFromLibrary(imageTileset.name);
        var imageTilesetSizeInTiles = new Coords(40, 27, 0);
        var tileSizeInPixels = imageTileset.sizeInPixels.clone().divide(imageTilesetSizeInTiles);
        var imageBuilder = new ImageBuilder(Color.Instances()._All);
        for (var y = 0; y < imageTilesetSizeInTiles.y; y++) {
            var visualsForTilesRow = new Array();
            for (var x = 0; x < imageTilesetSizeInTiles.x; x++) {
                var tilePosInTiles = new Coords(x, y, 0);
                var tilePosInPixels = tilePosInTiles.clone().multiply(tileSizeInPixels);
                var imageTile = imageBuilder.copyRegionFromImage(imageTileset, tilePosInPixels, tileSizeInPixels);
                var visualTile = new VisualImageImmediate(imageTile, null);
                visualsForTilesRow.push(visualTile);
            }
            visualsForTiles.push(visualsForTilesRow);
        }
        var worldDefn = new DemoData_Main(randomizer).buildWorldDefn(universe, visualsForTiles);
        var places = worldDefn.buildPlaces(worldDefn);
        var world = new World2("World0", worldDefn, places, null, // entityForPlayer
        randomizer);
        return world;
    }
    draw() {
        // todo
    }
    initialize(universe) {
        if (this.placeCurrent != null) {
            this.placeCurrent.initialize(universe, this);
        }
    }
    updateForTimerTick(universe) {
        if (this.placeNext != null) {
            this.placeNext.initialize(universe, this);
            this.placeCurrent = this.placeNext;
            this.placeNext = null;
        }
        this.placeCurrent.updateForTimerTick(universe, this);
        this.timerTicksSoFar++;
    }
    // debugging
    logTicksPerSecond() {
        var reportingWindowInTicks = 10;
        if (this.timerTicksSoFar % reportingWindowInTicks == 0) {
            var now = new Date();
            var nowAsTicks = now.getTime();
            if (this.timeReportingWindowStarted != null) {
                var reportingWindowInMilliseconds = nowAsTicks - this.timeReportingWindowStarted.getTime();
                var reportingWindowInSeconds = reportingWindowInMilliseconds / 1000;
                var ticksPerSecond = Math.floor(reportingWindowInTicks / reportingWindowInSeconds);
                console.log(ticksPerSecond + " cps");
            }
            this.timeReportingWindowStarted = now;
        }
    }
    toControl() {
        return new ControlNone();
    }
}
