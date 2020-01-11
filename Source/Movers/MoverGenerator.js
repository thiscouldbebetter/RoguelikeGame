
function MoverGenerator(chanceOfSpawnPerZoneInitial, chanceOfSpawnPerTurn, zones)
{
	this.chanceOfSpawnPerZoneInitial = chanceOfSpawnPerZoneInitial;
	this.chanceOfSpawnPerTurn = chanceOfSpawnPerTurn;
	this.zones = zones;
	this.turnLastMoved = null;
}
{
	MoverGenerator.prototype.activityPerform = function(universe, world, place, actor, activity)
	{
		var randomizer = universe.randomizer;
		if (this.turnLastMoved == null)
		{
			for (var i = 0; i < this.zones.length; i++)
			{
				var zone = this.zones[i];
				var randomNumber = randomizer.getNextRandom();
				if (randomNumber < this.chanceOfSpawnPerZoneInitial)
				{
					this.moverSpawn(universe, world, place, zone);
				}
			}
			this.turnLastMoved = world.turnsSoFar;
		}
		else if (world.turnsSoFar > this.turnLastMoved)
		{
			this.turnLastMoved = world.turnsSoFar;

			var agentsInPlace = place.entitiesByPropertyName[MoverDefn.name];

			var numberOfAgentsMax = 1; // 100; // hack 

			if (agentsInPlace.length < numberOfAgentsMax)
			{
				var randomNumber = randomizer.getNextRandom();

				if (randomNumber <= this.chanceOfSpawnPerTurn)
				{
					var zoneToSpawnInto = this.zones.random(randomizer);
					this.moverSpawn(universe, world, place, zoneToSpawnInto);
				}
			}
		}
	};

	MoverGenerator.prototype.moverSpawn = function(universe, world, place, zoneToSpawnInto)
	{
		var randomizer = universe.randomizer;
		var difficulty = 1; // hack

		var entityDefnGroupName = "AgentsOfDifficulty" + difficulty;
		var entityDefnGroup = world.defn.entityDefnGroups[entityDefnGroupName];
		var entityDefnsForAgentsOfDifficulty = entityDefnGroup.entityDefns;
		var entityDefnForAgentToSpawn =
			entityDefnsForAgentsOfDifficulty.random(randomizer);

		var zoneBounds = zoneToSpawnInto.bounds;
		var offsetWithinZone = new Coords().randomize(randomizer).multiply
		(
			zoneBounds.sizeHalf.clone().subtract(Coords.Instances().Ones)
		).clearZ();
		var posToSpawnAt = offsetWithinZone.add(zoneBounds.center).floor();
		posToSpawnAt.z = 3; // todo

		var entityName =
			entityDefnForAgentToSpawn.name + universe.idHelper.idNext();

		var entityForAgent = EntityHelper.new
		(
			entityName,
			entityDefnForAgentToSpawn,
			[
				new Locatable(new Location(posToSpawnAt))
			]
		);

		place.entitiesToSpawn.push(entityForAgent);
	};
}
