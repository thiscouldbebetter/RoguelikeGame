"use strict";
class Player {
    constructor(sightRange) {
        this.sightRange = sightRange;
        this.messageLog = new MessageLog();
        this.placeKnownLookup = new Map();
    }
    initialize(universe, worldAsWorld, placeAsPlace, entityAsEntity) {
        var world = worldAsWorld;
        var place = placeAsPlace;
        var entity = entityAsEntity;
        entity.locatable().loc.pos.z = PlaceLevel.ZLayers().Movers;
        entity.mover().movesThisTurn = 0;
        entity.turnable().hasActedThisTurn = true;
        var placeKnownLookup = entity.player().placeKnownLookup;
        var placeKnown = placeKnownLookup.get(place.name);
        if (placeKnown == null) {
            var mapComplete = place.map;
            var mapKnown = this.initialize_MapBuildBlank(mapComplete.name + "_Known", mapComplete.terrains, mapComplete.cellSizeInPixels, mapComplete.sizeInCells);
            placeKnown = new PlaceLevel(place.name + "_Known", place.displayName, place.depth, place.defn2, place.sizeInPixels, mapKnown, place.zones, [] // entities
            );
            placeKnownLookup.set(place.name, placeKnown);
            world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange(placeKnown, place, entity.locatable().loc.pos, entity.player().sightRange);
        }
    }
    initialize_MapBuildBlank(name, terrains, cellSizeInPixels, sizeInCells) {
        var cellsAsStrings = [];
        var terrainBlank = terrains[0]; // hack
        for (var y = 0; y < sizeInCells.y; y++) {
            var cellRowAsString = "";
            for (var x = 0; x < sizeInCells.x; x++) {
                cellRowAsString += terrainBlank.codeChar;
            }
            cellsAsStrings.push(cellRowAsString);
        }
        var returnValue = new MapOfTerrain(name, terrains, cellSizeInPixels, cellsAsStrings);
        return returnValue;
    }
    updateForTimerTick(universe, worldAsWorld, placeAsPlace, entityPlayerAsEntity) {
        var world = worldAsWorld;
        var place = placeAsPlace;
        var entityPlayer = entityPlayerAsEntity;
        if (entityPlayer.turnable().hasActedThisTurn) {
            entityPlayer.starvable2().satietyAdd(world, -1, entityPlayer);
            var turnables = place.entities.filter((x) => x.turnable() != null); // hack
            for (var i = 0; i < turnables.length; i++) {
                var entityTurnable = turnables[i];
                var turnable = entityTurnable.turnable();
                turnable.updateForTurn(universe, world, place, entityTurnable);
            }
            world.turnsSoFar++;
        }
        if (place.hasBeenUpdatedSinceDrawn) {
            var player = entityPlayer.player();
            var placeKnown = player.placeKnownLookup.get(place.name);
            world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange(placeKnown, place, // placeComplete
            entityPlayer.locatable().loc.pos, player.sightRange);
            //player.controlUpdate(world, entityPlayer);
        }
    }
    // controls
    toControl(universe, size, entity, venuePrev) {
        return this.toControlOverlay(universe, size, entity);
    }
    toControlOverlay(universe, size, entity) {
        var world = universe.world;
        var entity2 = entity;
        if (this.control == null) {
            var controlLocus = new ControlContainer("containerLocus", new Coords(10, 48, 0), // pos
            new Coords(160, 16, 0), // size
            [
                ControlLabel.fromPosAndText(new Coords(10, 5, 0), new DataBinding(this, (c) => {
                    var loc = entity.locatable().loc;
                    var place = loc.place(world);
                    var zone = place.displayName;
                    var depth = place.depth;
                    var turn = world.turnsSoFar;
                    var returnValue = "Turn: " + turn + " Zone: " + zone + " Depth: " + depth;
                    return returnValue;
                }, null))
            ], null, null);
            this.control = new ControlContainer("containerMover", Coords.create(), // pos
            new Coords(180, 272, 0), // size
            [
                ControlLabel.fromPosAndText(new Coords(10, 16, 0), "Name: " + entity.name),
                entity2.demographics().toControl(world, entity, new Coords(10, 32, 0)),
                entity2.starvable2().toControl(world, entity, new Coords(10, 64, 0)),
                controlLocus,
            ], null, null);
        }
        return this.control;
    }
    controlUpdate(w, e) {
        // todo - Remove this.
    }
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // EntityProperty.
    finalize(u, w, p, e) { }
}
