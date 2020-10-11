
class PlaceLevel
{
	constructor(name, displayName, depth, defn, sizeInPixels, map, zones, entities)
	{
		this.name = name;
		this.displayName = displayName;
		this.depth = depth;
		this.defn = defn;
		this.sizeInPixels = sizeInPixels;
		this.map = map;
		this.zones = zones;
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

		this.hasBeenUpdatedSinceDrawn = true;

		// Helper variables.
		this._drawLoc = new Location(new Coords());
	}

	static ZLayers()
	{
		if (PlaceLevel._zLayers == null)
		{
			PlaceLevel._zLayers = new PlaceLevel_ZLayers();
		}
		return PlaceLevel._zLayers;
	}

	// instance methods

	entitiesWithPropertyNamePresentAtCellPos(propertyName, cellPosToCheck)
	{
		var returnEntities = [];

		var entitiesWithPropertyName = this.entitiesByPropertyName[propertyName];

		if (entitiesWithPropertyName != null)
		{
			for (var i = 0; i < entitiesWithPropertyName.length; i++)
			{
				var entity = entitiesWithPropertyName[i];
				if (entity.locatable.loc.pos.equalsXY(cellPosToCheck) == true)
				{
					returnEntities.insertElementAt(entity, 0);
				}
			}
		}

		return returnEntities;
	}

	entitySpawn(universe, world, entityToSpawn)
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

				if (entityDefnProperty.initializeEntityForPlace == null)
				{
					if (entityProperty == null && entityDefnProperty.clone != null)
					{
						entityToSpawn[entityPropertyName] = entityDefnProperty.clone();
					}
				}
				else
				{
					entityDefnProperty.initializeEntityForPlace
					(
						universe, world, this, entityToSpawn
					);
				}
			}
		}
	}

	initialize(universe, world)
	{
		this.hasBeenUpdatedSinceDrawn = true;
		// Initialization of entities is handled in entitySpawn().
	}

	update(universe, world)
	{
		this.update_EntitiesToSpawn(universe, world);

		var propertyNamesKnown = this.defn.propertyNamesKnown;
		for (var i = 0; i < propertyNamesKnown.length; i++)
		{
			var propertyName = propertyNamesKnown[i];
			var entitiesWithProperty = this.entitiesByPropertyName[propertyName];

			propertyName = propertyName.lowercaseFirstCharacter();
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

		this.update_Mappables(universe, world);

		this.update_EntitiesToRemove(universe, world);

		this.draw(universe, world);
	}

	update_EntitiesToRemove(universe, world)
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entityToRemove = this.entitiesToRemove[i];

			// hack
			var mappable = entityToRemove.mappable;
			if (mappable != null)
			{
				var entitiesInCell = mappable.mapCellOccupied.entitiesPresent;
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

	update_EntitiesToSpawn(universe, world)
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entityToSpawn = this.entitiesToSpawn[i];
			this.entitySpawn(universe, world, entityToSpawn);
		}

		this.entitiesToSpawn.length = 0;
	}

	update_Mappables(universe, world)
	{
		var emplacements = this.entitiesByPropertyName[Emplacement.name];
		var enemies = this.entitiesByPropertyName["Enemy"];
		var items = this.entitiesByPropertyName[Item.name];
		var players = this.entitiesByPropertyName[Player.name]
		var portals = this.entitiesByPropertyName[Portal.name];
		var projectiles = this.entitiesByPropertyName["Projectile"];

		var collisionHelper = universe.collisionHelper;

		var collisionSets =
		[
			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				players, emplacements
			),

			collisionHelper.collisionsOfEntitiesCollidableInSets
			(
				enemies, projectiles
			),
		];

		for (var s = 0; s < collisionSets.length; s++)
		{
			var collisions = collisionSets[s];

			for (var c = 0; c < collisions.length; c++)
			{
				var collision = collisions[c];

				var mappables = collision.mappables;

				for (var i = 0; i < mappables.length; i++)
				{
					var entityThis = mappables[i];

					for (var j = i + 1; j < mappables.length; j++)
					{
						var entityOther = mappables[j];

						collisionHelper.collideEntities
						(
	-						world, collision, entityThis, entityOther
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

	controlUpdate(world)
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
					entityForPlayer.player.controlUpdate(world, entityForPlayer),
				]
			);
		}

		return this.control;
	}

	// drawable

	draw(universe, world)
	{
		if (this.hasBeenUpdatedSinceDrawn)
		{
			this.hasBeenUpdatedSinceDrawn = false;

			var player = world.entityForPlayer;
			var placeKnown = player.player.placeKnownLookup[this.name];

			if (placeKnown != null)
			{
				placeKnown.drawAsKnown(universe, world);
			}
		}
	}

	drawAsKnown(universe, world)
	{
		var display = universe.display;

		display.childSelectByName(null);

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
		var messageLogAsControl = world.entityForPlayer.player.messageLog.controlUpdate(world);
		this._drawLoc.pos.clear();
		messageLogAsControl.draw(universe, display, this._drawLoc);
		display.flush();

		display.childSelectByName(null);
		display.drawRectangle
		(
			Coords.Instances().Zeroes,
			display.displayToUse().sizeInPixels,
			null, "Gray"
		);
	}

	// entities

	awaitables()
	{
		return this.entitiesByPropertyName[Awaitable.name];
	}

	ephemerals()
	{
		return this.entitiesByPropertyName[Ephemeral.name];
	}

	movers()
	{
		return this.entitiesByPropertyName[Mover.name];
	}

	player()
	{
		return this.entitiesByPropertyName[Player.name][0];
	}
}

class PlaceLevel_ZLayers
{
	constructor()
	{
		this.Emplacements = 1;
		this.Items = 2;
		this.Movers = 3;
	}
}
