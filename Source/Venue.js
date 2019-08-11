
function Venue(name, depth, defn, sizeInPixels, map, entities)
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

	this.camera = new Camera
	(
		"Camera",
		Camera.ViewSizeStandard
	);

	this.camera.entity.loc.venueName = this.name;

	this.entitiesToSpawn.push(this.camera.entity);
}

{
	// instance methods

	Venue.prototype.entitiesWithPropertyNamePresentAtCellPos = function(propertyName, cellPosToCheck)
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

	Venue.prototype.entitySpawn = function(world, entityToSpawn)
	{
		entityToSpawn.loc.venueName = this.name;

		this.entities.push(entityToSpawn);
		this.entities[entityToSpawn.name] = entityToSpawn;

		var entityProperties = entityToSpawn.defn(world).properties;
		for (var c = 0; c < entityProperties.length; c++)
		{
			var entityProperty = entityProperties[c];
			var entityPropertyName = entityProperty.name();

			var entityListForPropertyName = this.entitiesByPropertyName[entityPropertyName];

			if (entityListForPropertyName != null)
			{
				entityListForPropertyName.push(entityToSpawn);

				if (entityProperty.initializeEntityForVenue != null)
				{
					entityProperty.initializeEntityForVenue(world, entityToSpawn, this);
				}
			}
		}
	}

	Venue.prototype.initialize = function(world)
	{
		for (var b = 0; b < this.entities.length; b++)
		{
			var entity = this.entities[b];

			var entityDefnProperties = entity.defn(world).properties;
			for (var c = 0; c < entityDefnProperties.length; c++)
			{
				var entityProperty = entityDefnProperties[c];
				var entityPropertyName = entityProperty.name();

				if (entityProperty.initializeEntityForVenue != null)
				{
					entityProperty.initializeEntityForVenue(world, entity, this);
				}
			}
		}
	}

	Venue.prototype.update = function(world)
	{
		this.update_EntitiesToSpawn(world);

		var player = world.entityForPlayer;
		var venueKnown = player.playerData.venueKnownLookup[this.name];

		if (venueKnown != null)
		{
			var display = Globals.Instance.display;
			venueKnown.draw(world, display);
			var venueKnownAsControl = venueKnown.controlUpdate(world);
			venueKnownAsControl.drawToGraphics(display.graphics);
			this.map.drawEntities
			(
				display,
				this.ephemerals() // hack
			);
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
					entityDefnProperty.updateEntityForVenue(world, entity, this);
				}
			}
		}

		this.update_Collidables(world);

		this.update_EntitiesToRemove(world);
	}

	Venue.prototype.update_EntitiesToRemove = function(world)
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

	Venue.prototype.update_EntitiesToSpawn = function(world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entityToSpawn = this.entitiesToSpawn[i];
			this.entitySpawn(world, entityToSpawn);
		}

		this.entitiesToSpawn.length = 0;
	}

	Venue.prototype.update_Collidables = function(world)
	{
		var emplacements = this.entitiesByPropertyName["Emplacement"];
		var enemies = this.entitiesByPropertyName["Enemy"];
		var items = this.entitiesByPropertyName["Item"];
		var players = this.entitiesByPropertyName["Player"]
		var portals = this.entitiesByPropertyName["Portal"];
		var projectiles = this.entitiesByPropertyName["Projectile"];

		var collisionHelper = Globals.Instance.collisionHelper;

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

	Venue.prototype.controlUpdate = function(world)
	{
		if (this.control == null)
		{
			var entityForPlayer = world.entityForPlayer;
			this.control = new ControlContainer
			(
				"containerVenue",
				new Coords(10, 10), // pos
				new Coords(220, 240), // size
				// children
				[
					entityForPlayer.moverData.controlUpdate(world, entityForPlayer),
				]
			);
		}

		return this.control;
	}

	// drawable

	Venue.prototype.draw = function(world, display)
	{
		var turnsSoFar = world.turnsSoFar;
		if (this.turnLastDrawn != turnsSoFar)
		{
			this.turnLastDrawn = turnsSoFar;
			this.map.draw(world, display, this);
		}
	};

	// entities

	Venue.prototype.ephemerals = function()
	{
		return this.entitiesByPropertyName["Ephemeral"];
	}
}
