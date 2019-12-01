
function VenueLevel(name, depth, defn, sizeInPixels, map, entities)
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
		entity.loc.venueName = this.name;
		this.entitiesToSpawn.push(entity);
	}

	// Helper variables.

	this._drawLoc = new Location(new Coords());
}

{
	// instance methods

	VenueLevel.prototype.entitiesWithPropertyNamePresentAtCellPos = function(propertyName, cellPosToCheck)
	{
		var returnEntities = [];

		var entitiesWithPropertyName = this.entitiesByPropertyName[propertyName];

		if (entitiesWithPropertyName != null)
		{
			for (var i = 0; i < entitiesWithPropertyName.length; i++)
			{
				var entity = entitiesWithPropertyName[i];
				if (entity.loc.posInCells.equals(cellPosToCheck) == true)
				{
					returnEntities.splice(0, 0, entity);
				}
			}
		}

		return returnEntities;
	}

	VenueLevel.prototype.entitySpawn = function(universe, world, entityToSpawn)
	{
		entityToSpawn.loc.venueName = this.name;

		this.entities.push(entityToSpawn);
		this.entities[entityToSpawn.name] = entityToSpawn;

		var entityProperties = entityToSpawn.defn(world).properties;
		for (var c = 0; c < entityProperties.length; c++)
		{
			var entityProperty = entityProperties[c];
			var entityPropertyName =
				( entityProperty.name == null ? entityProperty.constructor.name : entityProperty.name() );

			var entityListForPropertyName = this.entitiesByPropertyName[entityPropertyName];

			if (entityListForPropertyName != null)
			{
				entityListForPropertyName.push(entityToSpawn);

				if (entityProperty.initializeEntityForVenue == null)
				{
					if (entityProperty.clone != null)
					{
						entityToSpawn[entityPropertyName] = entityProperty.clone();
					}
				}
				else
				{
					entityProperty.initializeEntityForVenue
					(
						universe, world, entityToSpawn, this
					);
				}
			}
		}
	}

	VenueLevel.prototype.initialize = function(universe, world)
	{
		for (var b = 0; b < this.entities.length; b++)
		{
			var entity = this.entities[b];

			var entityDefnProperties = entity.defn(world).properties;
			for (var c = 0; c < entityDefnProperties.length; c++)
			{
				var entityProperty = entityDefnProperties[c];
				var entityPropertyName =
					( entityProperty.name == null ? entityProperty.constructor.name : entityProperty.name() );

				if (entityProperty.initializeEntityForVenue != null)
				{
					entityProperty.initializeEntityForVenue(null, world, entity, this);
				}
			}
		}
	}

	VenueLevel.prototype.update = function(universe, world)
	{
		this.update_EntitiesToSpawn(universe, world);

		var player = world.entityForPlayer;
		var venueKnown = player.playerData.venueKnownLookup[this.name];

		if (venueKnown != null)
		{
			var display = universe.display;

			venueKnown.draw(universe, world, display);

			this.map.drawEntities
			(
				universe, world, display, this.ephemerals() // hack
			);

			display.childSelectByName("Status");
			display.clear();
			var venueKnownAsControl = venueKnown.controlUpdate(world);
			this._drawLoc.pos.clear();
			venueKnownAsControl.draw(universe, display, this._drawLoc);
			display.flush();

			display.childSelectByName("Messages");
			display.clear();
			var messageLogAsControl = player.playerData.messageLog.controlUpdate(world);
			this._drawLoc.pos.clear();
			messageLogAsControl.draw(universe, display, this._drawLoc);
			display.flush();

			display.childSelectByName(null);
		}

		var propertyNamesKnown = this.defn.propertyNamesKnown;
		for (var i = 0; i < propertyNamesKnown.length; i++)
		{
			var propertyName = propertyNamesKnown[i];
			var entitiesWithProperty = this.entitiesByPropertyName[propertyName];

			for (var b = 0; b < entitiesWithProperty.length; b++)
			{
				var entity = entitiesWithProperty[b];
				var entityDefnProperty = entity.defn(world).properties[propertyName];
				if (entityDefnProperty.updateEntityForVenue != null)
				{
					entityDefnProperty.updateEntityForVenue(universe, world, entity, this);
				}
			}
		}

		this.update_Collidables(universe, world);

		this.update_EntitiesToRemove(universe, world);
	}

	VenueLevel.prototype.update_EntitiesToRemove = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entityToRemove = this.entitiesToRemove[i];

			// hack
			if (entityToRemove.collidableData != null)
			{
				var entitiesInCell = entityToRemove.collidableData.mapCellOccupied.entitiesPresent;
				entitiesInCell.splice
				(
					entitiesInCell.indexOf(entityToRemove),
					1
				);
			}

			this.entities.splice(this.entities.indexOf(entityToRemove), 1);
			delete this.entities[entityToRemove.name];

			var entityDefnProperties = entityToRemove.defn(world).properties;
			for (var c = 0; c < entityDefnProperties.length; c++)
			{
				var entityDefnProperty = entityDefnProperties[c];
				var entityDefnPropertyName = entityDefnProperty.name();
				var entitiesWithProperty = this.entitiesByPropertyName[entityDefnPropertyName];

				entitiesWithProperty.splice
				(
					entitiesWithProperty.indexOf(entityToRemove),
					1
				);
			}
		}

		this.entitiesToRemove.length = 0;
	}

	VenueLevel.prototype.update_EntitiesToSpawn = function(universe, world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entityToSpawn = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entityToSpawn);
		}

		this.entitiesToSpawn.length = 0;
	}

	VenueLevel.prototype.update_Collidables = function(universe, world)
	{
		var emplacements = this.entitiesByPropertyName["Emplacement"];
		var enemies = this.entitiesByPropertyName["Enemy"];
		var items = this.entitiesByPropertyName["Item"];
		var players = this.entitiesByPropertyName["Player"]
		var portals = this.entitiesByPropertyName["Portal"];
		var projectiles = this.entitiesByPropertyName["Projectile"];

		var collisionHelper = universe.collisionHelper;

		var collisionSets =
		[
			collisionHelper.findCollisionsBetweenEntitiesInSets
			(
				players,
				emplacements
			),

			collisionHelper.findCollisionsBetweenEntitiesInSets
			(
				players,
				enemies
			),

			collisionHelper.findCollisionsBetweenEntitiesInSets
			(
				players,
				items
			),

			collisionHelper.findCollisionsBetweenEntitiesInSets
			(
				players,
				portals
			),

			collisionHelper.findCollisionsBetweenEntitiesInSets
			(
				enemies,
				projectiles
			),
		];

		for (var s = 0; s < collisionSets.length; s++)
		{
			var collisions = collisionSets[s];

			var numberOfCollisions = collisions.length;
			for (var c = 0; c < numberOfCollisions; c++)
			{
				var collision = collisions[c];

				var numberOfEntities = collision.entities.length;

				for (var b0 = 0; b0 < numberOfEntities; b0++)
				{
					var entityThis = collision.entities[b0];
					for (var b1 = b0 + 1; b1 < numberOfEntities; b1++)
					{
						var entityOther = collision.entities[b1];

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

	VenueLevel.prototype.controlUpdate = function(world)
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
					entityForPlayer.moverData.controlUpdate(world, entityForPlayer),
				]
			);
		}

		return this.control;
	}

	// drawable

	VenueLevel.prototype.draw = function(universe, world, display)
	{
		display.childSelectByName(null);

		var turnsSoFar = world.turnsSoFar;
		if (this.turnLastDrawn != turnsSoFar)
		{
			this.turnLastDrawn = turnsSoFar;
			display.childSelectByName("Map");
			display.drawBackground();
			this.map.draw(universe, world, display, this);
		}

		//display.childrenDraw();

		display.childSelectByName(null);
		display.drawRectangle
		(
			Coords.Instances().Zeroes,
			display.displayToUse().sizeInPixels,
			null, "Gray"
		);
	};

	// entities

	VenueLevel.prototype.ephemerals = function()
	{
		return this.entitiesByPropertyName["Ephemeral"];
	}

	VenueLevel.prototype.player = function()
	{
		return this.entitiesByPropertyName["Player"][0];
	}
}
