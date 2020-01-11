
function PlaceLevel(name, depth, defn, sizeInPixels, map, entities)
{
	this.name = name;
	this.depth = depth;
	this.defn = defn;
	this.sizeInPixels = sizeInPixels;
	this.map = map;
	this.entities = [];

	this.sizeInPixelsHalf = this.sizeInPixels.clone().divideScalar(2);

	this.entitiesByPropertyName = [];
	var propertyNamesKnown = this.defn.propertyNamesKnown;
	for (var c = 0; c < propertyNamesKnown.length; c++)
	{
		var propertyName = propertyNamesKnown[c];

		var entitiesWithProperty = [];
		this.entitiesByPropertyName.push(entitiesWithProperty);
		this.entitiesByPropertyName[propertyName] = entitiesWithProperty;
	}

	this.entitiesToSpawn = [];
	this.entitiesToRemove = [];

	for (var i = 0; i < entities.length; i++)
	{
		var entity = entities[i];
		this.entitiesToSpawn.push(entity);
	}

	// Helper variables.

	this._drawLoc = new Location(new Coords());
}

{
	// instance methods

	PlaceLevel.prototype.entitiesWithPropertyNamePresentAtCellPos = function(propertyName, cellPosToCheck)
	{
		var returnEntities = [];

		var entitiesWithPropertyName = this.entitiesByPropertyName[propertyName];

		if (entitiesWithPropertyName != null)
		{
			for (var i = 0; i < entitiesWithPropertyName.length; i++)
			{
				var entity = entitiesWithPropertyName[i];
				if (entity.Locatable.loc.pos.equalsXY(cellPosToCheck) == true)
				{
					returnEntities.insertElementAt(entity, 0);
				}
			}
		}

		return returnEntities;
	}

	PlaceLevel.prototype.entitySpawn = function(universe, world, entityToSpawn)
	{
		this.entities.push(entityToSpawn);
		this.entities[entityToSpawn.name] = entityToSpawn;

		var entityDefn = entityToSpawn;
		var entityDefnProperties = entityDefn.properties;
		for (var c = 0; c < entityDefnProperties.length; c++)
		{
			var entityDefnProperty = entityDefnProperties[c];
			var entityPropertyName = entityDefnProperty.constructor.name;

			var entityListForPropertyName = this.entitiesByPropertyName[entityPropertyName];

			if (entityListForPropertyName != null)
			{
				entityListForPropertyName.push(entityToSpawn);

				var entityProperty = entityToSpawn[entityPropertyName];

				if (entityDefnProperty.initializeEntityForVenue == null)
				{
					if (entityProperty == null && entityDefnProperty.clone != null)
					{
						entityToSpawn[entityPropertyName] = entityDefnProperty.clone();
					}
				}
				else
				{
					entityDefnProperty.initializeEntityForVenue
					(
						universe, world, this, entityToSpawn
					);
				}
			}
		}
	}

	PlaceLevel.prototype.initialize = function(universe, world)
	{
		// Do nothing.
		// Initialization of entities is handled in entitySpawn().
	}

	PlaceLevel.prototype.update = function(universe, world)
	{
		this.update_EntitiesToSpawn(universe, world);

		var propertyNamesKnown = this.defn.propertyNamesKnown;
		for (var i = 0; i < propertyNamesKnown.length; i++)
		{
			var propertyName = propertyNamesKnown[i];
			var entitiesWithProperty = this.entitiesByPropertyName[propertyName];

			for (var b = 0; b < entitiesWithProperty.length; b++)
			{
				var entity = entitiesWithProperty[b];
				var entityDefn = entity;
				var entityDefnProperty = entityDefn[propertyName];
				if (entityDefnProperty.updateForTimerTick != null)
				{
					entityDefnProperty.updateForTimerTick(universe, world, this, entity);
				}
			}
		}

		this.update_Collidables(universe, world);

		this.update_EntitiesToRemove(universe, world);

		var player = world.entityForPlayer;
		var venueKnown = player.Player.venueKnownLookup[this.name];

		if (venueKnown != null)
		{
			var display = universe.display;

			venueKnown.draw(universe, world, display);

			this.map.drawEntities
			(
				universe, world, display, this.ephemerals() // hack
			);
		}
	}

	PlaceLevel.prototype.update_EntitiesToRemove = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entityToRemove = this.entitiesToRemove[i];

			// hack
			var collidable = entityToRemove.Collidable;
			if (collidable != null)
			{
				var entitiesInCell = collidable.mapCellOccupied.entitiesPresent;
				entitiesInCell.remove(entityToRemove);
			}

			this.entities.remove(entityToRemove);
			delete this.entities[entityToRemove.name];

			var entityDefnProperties = entityToRemove.properties;
			for (var c = 0; c < entityDefnProperties.length; c++)
			{
				var entityDefnProperty = entityDefnProperties[c];
				var entityDefnPropertyName = entityDefnProperty.constructor.name;
				var entitiesWithProperty = this.entitiesByPropertyName[entityDefnPropertyName];

				if (entitiesWithProperty != null) // hack
				{
					entitiesWithProperty.remove(entityToRemove);
				}
			}
		}

		this.entitiesToRemove.length = 0;
	}

	PlaceLevel.prototype.update_EntitiesToSpawn = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entityToSpawn = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entityToSpawn);
		}

		this.entitiesToSpawn.length = 0;
	}

	PlaceLevel.prototype.update_Collidables = function(universe, world)
	{
		var emplacements = this.entitiesByPropertyName[Emplacement.name];
		var enemies = this.entitiesByPropertyName["Enemy"];
		var items = this.entitiesByPropertyName["Item"];
		var players = this.entitiesByPropertyName[Player.name]
		var portals = this.entitiesByPropertyName[Portal.name];
		var projectiles = this.entitiesByPropertyName["Projectile"];

		var collisionHelper = universe.collisionHelper;

		var collisionSets =
		[
			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				players,
				emplacements
			),

			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				players,
				enemies
			),

			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				players,
				items
			),

			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				players,
				portals
			),

			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				enemies,
				projectiles
			),
		];

		for (var s = 0; s < collisionSets.length; s++)
		{
			var collisions = collisionSets[s];

			for (var c = 0; c < collisions.length; c++)
			{
				var collision = collisions[c];

				var collidables = collision.collidables;

				for (var i = 0; i < collidables.length; i++)
				{
					var entityThis = collidables[i];

					for (var j = i + 1; j < collidables.length; j++)
					{
						var entityOther = collidables[j];

						collisionHelper.collideEntities
						(
							world, collision, entityThis, entityOther
						);
						collisionHelper.collideEntities
						(
							world, collision, entityOther, entityThis
						);
					}
				}
			}
		}
	}

	// controls

	PlaceLevel.prototype.controlUpdate = function(world)
	{
		if (this.control == null)
		{
			var entityForPlayer = world.entityForPlayer;
			this.control = new ControlContainer
			(
				"containerVenue",
				new Coords(10, 10), // pos
				new Coords(180, 272), // size
				// children
				[
					entityForPlayer.MoverData.controlUpdate(world, entityForPlayer),
				]
			);
		}

		return this.control;
	}

	// drawable

	PlaceLevel.prototype.draw = function(universe, world, display)
	{
		display.childSelectByName(null);

		var turnsSoFar = world.turnsSoFar;
		if (this.turnLastDrawn != turnsSoFar)
		{
			this.turnLastDrawn = turnsSoFar;
			display.childSelectByName("Map");
			display.drawBackground("Black");
			this.map.draw(universe, world, display, this);

			display.childSelectByName("Status");
			display.clear();
			var venueAsControl = this.controlUpdate(world);
			this._drawLoc.pos.clear();
			venueAsControl.draw(universe, display, this._drawLoc);
			display.flush();

			display.childSelectByName("Messages");
			display.clear();
			var messageLogAsControl = world.entityForPlayer.Player.messageLog.controlUpdate(world);
			this._drawLoc.pos.clear();
			messageLogAsControl.draw(universe, display, this._drawLoc);
			display.flush();
		}

		display.childSelectByName(null);
		display.drawRectangle
		(
			Coords.Instances().Zeroes,
			display.displayToUse().sizeInPixels,
			null, "Gray"
		);
	};

	// entities

	PlaceLevel.prototype.ephemerals = function()
	{
		return this.entitiesByPropertyName[Ephemeral.name];
	}

	PlaceLevel.prototype.player = function()
	{
		return this.entitiesByPropertyName[Player.name][0];
	}
}
