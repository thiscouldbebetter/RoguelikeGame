"use strict";
class PlaceLevel extends Place {
    constructor(name, displayName, depth, defn2, sizeInPixels, map, zones, entities) {
        super(name, defn2.name, sizeInPixels, entities);
        this.displayName = displayName;
        this.depth = depth;
        this.defn2 = defn2;
        this.sizeInPixels = sizeInPixels;
        this.map = map;
        this.zones = zones;
        this.entities = [];
        this.entitiesByName = new Map();
        this.sizeInPixelsHalf = this.sizeInPixels.clone().divideScalar(2);
        this._entitiesByPropertyName = new Map();
        var propertyNamesKnown = this.defn2.propertyNamesToProcess;
        for (var c = 0; c < propertyNamesKnown.length; c++) {
            var propertyName = propertyNamesKnown[c];
            var entitiesWithProperty = new Array();
            //this._entitiesByPropertyName.push(entitiesWithProperty);
            this._entitiesByPropertyName.set(propertyName, entitiesWithProperty);
        }
        this.entitiesToSpawn = [];
        this.entitiesToRemove = [];
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            this.entitiesToSpawn.push(entity);
        }
        this.hasBeenUpdatedSinceDrawn = true;
        // Helper variables.
        this._drawLoc = new Disposition(new Coords(0, 0, 0), null, null);
    }
    static ZLayers() {
        if (PlaceLevel._zLayers == null) {
            PlaceLevel._zLayers = new PlaceLevel_ZLayers();
        }
        return PlaceLevel._zLayers;
    }
    // instance methods
    entitiesByPropertyName(propertyName) {
        return this._entitiesByPropertyName.get(propertyName);
    }
    entitiesWithPropertyNamePresentAtCellPos(propertyName, cellPosToCheck) {
        var returnEntities = new Array();
        var entitiesWithPropertyName = this.entitiesByPropertyName(propertyName);
        if (entitiesWithPropertyName != null) {
            for (var i = 0; i < entitiesWithPropertyName.length; i++) {
                var entity = entitiesWithPropertyName[i];
                if (entity.locatable().loc.pos.equalsXY(cellPosToCheck) == true) {
                    ArrayHelper.insertElementAt(returnEntities, entity, 0);
                }
            }
        }
        return returnEntities;
    }
    entitySpawn(universe, world, entityToSpawn) {
        this.entities.push(entityToSpawn);
        this.entitiesByName.set(entityToSpawn.name, entityToSpawn);
        var entityDefn = entityToSpawn;
        var entityDefnProperties = entityDefn.properties;
        for (var c = 0; c < entityDefnProperties.length; c++) {
            var entityDefnProperty = entityDefnProperties[c];
            var entityPropertyName = entityDefnProperty.constructor.name;
            var entityListForPropertyName = this.entitiesByPropertyName(entityPropertyName);
            if (entityListForPropertyName != null) {
                entityListForPropertyName.push(entityToSpawn);
                var entityProperty = entityToSpawn.propertyByName(entityPropertyName);
                if (entityDefnProperty.initialize == null) {
                    var entityDefnPropertyAsAny = entityDefnProperty;
                    if (entityProperty == null) {
                        entityToSpawn.propertyAddForPlace(entityDefnPropertyAsAny.clone(), null);
                    }
                }
                else {
                    entityDefnProperty.initialize(universe, world, this, entityToSpawn);
                }
            }
        }
    }
    initialize(universe, world) {
        this.hasBeenUpdatedSinceDrawn = true;
        // Initialization of entities is handled in entitySpawn().
    }
    updateForTimerTick(universe, world) {
        this.update_EntitiesToSpawn(universe, world);
        var propertyNamesKnown = this.defn2.propertyNamesToProcess;
        for (var i = 0; i < propertyNamesKnown.length; i++) {
            var propertyName = propertyNamesKnown[i];
            var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
            //propertyName = propertyName.lowercaseFirstCharacter();
            for (var b = 0; b < entitiesWithProperty.length; b++) {
                var entity = entitiesWithProperty[b];
                var entityDefn = entity;
                var entityDefnProperty = entityDefn.propertyByName(propertyName);
                if (entityDefnProperty.updateForTimerTick != null) {
                    entityDefnProperty.updateForTimerTick(universe, world, this, entity);
                }
            }
        }
        this.update_Mappables(universe, world);
        this.update_EntitiesToRemove(universe, world);
        this.draw(universe, world);
    }
    update_EntitiesToRemove(universe, world) {
        for (var i = 0; i < this.entitiesToRemove.length; i++) {
            var entityToRemove = this.entitiesToRemove[i];
            // hack
            var mappable = entityToRemove.mappable();
            if (mappable != null) {
                var entitiesInCell = mappable.mapCellOccupied.entitiesPresent;
                ArrayHelper.remove(entitiesInCell, entityToRemove);
            }
            ArrayHelper.remove(this.entities, entityToRemove);
            this.entitiesByName.delete(entityToRemove.name);
            var entityDefnProperties = entityToRemove.properties;
            for (var c = 0; c < entityDefnProperties.length; c++) {
                var entityDefnProperty = entityDefnProperties[c];
                var entityDefnPropertyName = entityDefnProperty.constructor.name;
                var entitiesWithProperty = this.entitiesByPropertyName(entityDefnPropertyName);
                if (entitiesWithProperty != null) {
                    ArrayHelper.remove(entitiesWithProperty, entityToRemove);
                }
            }
        }
        this.entitiesToRemove.length = 0;
    }
    update_EntitiesToSpawn(universe, world) {
        for (var i = 0; i < this.entitiesToSpawn.length; i++) {
            var entityToSpawn = this.entitiesToSpawn[i];
            this.entitySpawn(universe, world, entityToSpawn);
        }
        this.entitiesToSpawn.length = 0;
    }
    update_Mappables(universe, world) {
        var emplacements = this.emplacements();
        var enemies = this.enemies();
        var players = this.players();
        var projectiles = this.projectiles();
        var collisionHelper = universe.collisionHelper;
        var collisionSets = [
            collisionHelper.collisionsOfEntitiesCollidableInSets(players, emplacements),
            collisionHelper.collisionsOfEntitiesCollidableInSets(enemies, projectiles),
        ];
        for (var s = 0; s < collisionSets.length; s++) {
            var collisions = collisionSets[s];
            for (var c = 0; c < collisions.length; c++) {
                var collision = collisions[c];
                var mappables = collision.collidables;
                for (var i = 0; i < mappables.length; i++) {
                    var entityThis = mappables[i];
                    for (var j = i + 1; j < mappables.length; j++) {
                        var entityOther = mappables[j];
                        console.log("Collide: " + entityThis + entityOther);
                        // todo
                        /*
                        collisionHelper.collideEntities
                        (
    -						world, collision, entityThis, entityOther
                        );
                        collisionHelper.collideEntities
                        (
                            world, collision, entityOther, entityThis
                        );
                        */
                    }
                }
            }
        }
    }
    // controls
    toControl(universe, world) {
        if (this.control == null) {
            var size = universe.display.sizeInPixels;
            var entityForPlayer = world.entityForPlayer;
            this.control = new ControlContainer("containerVenue", new Coords(10, 10, 0), // pos
            new Coords(180, 272, 0), // size
            // children
            [
                entityForPlayer.player().toControl(universe, size, entityForPlayer, null),
            ], null, null);
        }
        return this.control;
    }
    // drawable
    draw(universe, world) {
        if (this.hasBeenUpdatedSinceDrawn) {
            this.hasBeenUpdatedSinceDrawn = false;
            var player = world.entityForPlayer;
            var placeKnown = player.player().placeKnownLookup.get(this.name);
            if (placeKnown != null) {
                placeKnown.drawAsKnown(universe, world);
            }
        }
    }
    drawAsKnown(universe, worldAsWorld) {
        var display = universe.display;
        var world = worldAsWorld;
        display.childSelectByName(null);
        display.childSelectByName("Map");
        display.drawBackground("Black", "Black");
        this.map.draw(universe, world, this, display);
        display.childSelectByName("Status");
        display.clear();
        var venueAsControl = this.toControl(universe, world);
        this._drawLoc.pos.clear();
        venueAsControl.draw(universe, display, this._drawLoc, null);
        display.flush();
        display.childSelectByName("Messages");
        display.clear();
        var messageLogAsControl = world.entityForPlayer.player().messageLog.controlUpdate(world);
        this._drawLoc.pos.clear();
        messageLogAsControl.draw(universe, display, this._drawLoc, null);
        display.flush();
        display.childSelectByName(null);
        display.drawRectangle(Coords.Instances().Zeroes, display.displayToUse().sizeInPixels, null, "Gray", null);
    }
    // entities
    awaitables() { return this.entitiesByPropertyName(Awaitable.name); }
    emplacements() { return this.entitiesByPropertyName(Emplacement.name); }
    enemies() { return this.entitiesByPropertyName("Enemy"); }
    ephemerals() { return this.entitiesByPropertyName(Ephemeral.name); }
    items() { return this.entitiesByPropertyName(Item.name); }
    mappables() { return this.entitiesByPropertyName(Mappable.name); }
    movers() { return this.entitiesByPropertyName(Mover.name); }
    player() { return this.players()[0]; }
    players() { return this.entitiesByPropertyName(Player.name); }
    portals() { return this.entitiesByPropertyName(Portal2.name); }
    projectiles() { return this.entitiesByPropertyName("Projectile"); }
}
class PlaceLevel_ZLayers {
    constructor() {
        this.Emplacements = 1;
        this.Items = 2;
        this.Movers = 3;
    }
}
