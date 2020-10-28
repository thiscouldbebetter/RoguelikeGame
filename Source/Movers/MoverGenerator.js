"use strict";
class MoverGenerator extends EntityProperty {
    constructor(chanceOfSpawnPerZoneInitial, chanceOfSpawnPerTurn, zones) {
        super();
        this.chanceOfSpawnPerZoneInitial = chanceOfSpawnPerZoneInitial;
        this.chanceOfSpawnPerTurn = chanceOfSpawnPerTurn;
        this.zones = zones;
        this.turnLastMoved = null;
    }
    activityPerform(universe, worldAsWorld, placeAsPlace, actor, activity) {
        var world = worldAsWorld;
        var place = placeAsPlace;
        var randomizer = universe.randomizer;
        if (this.turnLastMoved == null) {
            for (var i = 0; i < this.zones.length; i++) {
                var zone = this.zones[i];
                var randomNumber = randomizer.getNextRandom();
                if (randomNumber < this.chanceOfSpawnPerZoneInitial) {
                    this.moverSpawn(universe, world, place, zone);
                }
            }
            this.turnLastMoved = world.turnsSoFar;
        }
        else if (world.turnsSoFar > this.turnLastMoved) {
            this.turnLastMoved = world.turnsSoFar;
            var agentsInPlace = place.movers();
            var numberOfAgentsMax = 100; // hack
            if (agentsInPlace.length < numberOfAgentsMax) {
                var randomNumber = randomizer.getNextRandom();
                if (randomNumber <= this.chanceOfSpawnPerTurn) {
                    var zoneToSpawnInto = ArrayHelper.random(this.zones, randomizer);
                    this.moverSpawn(universe, world, place, zoneToSpawnInto);
                }
            }
        }
    }
    moverSpawn(universe, worldAsWorld, place, zoneToSpawnInto) {
        var world = worldAsWorld;
        var randomizer = universe.randomizer;
        var playerRank = world.entityForPlayer.demographics().rank;
        var difficultyMin = 1; // todo
        var placeLevel = place;
        var difficultyMax = Math.ceil((placeLevel.depth + playerRank) / 2);
        var difficultyMaxMax = 10; // hack - Haven't added all monsters yet.
        if (difficultyMax > difficultyMaxMax) {
            difficultyMax = difficultyMaxMax;
        }
        var difficultyRange = difficultyMax - difficultyMin + 1;
        var difficulty = difficultyMin + Math.floor(Math.random() * difficultyRange);
        var entityDefnGroupName = "AgentsOfDifficulty" + difficulty;
        var entityDefnGroup = world.defn2.entityDefnGroupsByName.get(entityDefnGroupName);
        var entityDefnsForAgentsOfDifficulty = entityDefnGroup.entityDefns;
        var relativeFrequencyTotal = entityDefnsForAgentsOfDifficulty.map((x) => x.generatable().relativeFrequency).reduce((sum, addend) => sum + addend, 0);
        var randomNumber = randomizer.getNextRandom();
        var cumulativeFrequencyToStopAt = randomNumber * relativeFrequencyTotal;
        var cumulativeFrequencySoFar = 0;
        var entityDefnForAgentToSpawn;
        for (var i = 0; i < entityDefnsForAgentsOfDifficulty.length; i++) {
            var entityDefn = entityDefnsForAgentsOfDifficulty[i];
            cumulativeFrequencySoFar += entityDefn.generatable().relativeFrequency;
            if (cumulativeFrequencySoFar > cumulativeFrequencyToStopAt) {
                entityDefnForAgentToSpawn = entityDefn;
                break;
            }
        }
        var zoneBounds = zoneToSpawnInto.bounds;
        var ones = Coords.Instances().Ones;
        var zoneBoundsSizeHalfMinusOnes = zoneBounds.sizeHalf.clone().subtract(ones);
        var offsetWithinZone = new Coords(0, 0, 0).randomize(randomizer).multiply(zoneBoundsSizeHalfMinusOnes).clearZ();
        var posToSpawnAt = offsetWithinZone.add(zoneBounds.center).floor();
        posToSpawnAt.z = PlaceLevel.ZLayers().Movers;
        var entityName = entityDefnForAgentToSpawn.name + universe.idHelper.idNext();
        var entityForAgent = Entity2.fromNameDefnAndProperties(entityName, entityDefnForAgentToSpawn, [
            new Locatable(new Disposition(posToSpawnAt, null, null))
        ]);
        place.entitiesToSpawn.push(entityForAgent);
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
