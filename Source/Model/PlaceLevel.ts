
class PlaceLevel extends Place
{
	name: string;
	displayName: string;
	depth: number;
	defn2: PlaceDefnLevel;
	sizeInPixels: Coords;
	map: MapOfTerrain;
	zones: Zone2[];
	entities: Entity[];

	control: ControlBase;
	_drawLoc: Disposition;
	entitiesByName: Map<string, Entity>;
	_entitiesByPropertyName: Map<string, Entity[]>;
	entitiesToRemove: Entity[];
	entitiesToSpawn: Entity[];
	hasBeenUpdatedSinceDrawn: boolean;
	sizeInPixelsHalf: Coords;

	constructor
	(
		name: string, displayName: string, depth: number, defn2: PlaceDefnLevel,
		sizeInPixels: Coords, map: MapOfTerrain, zones: Zone2[],
		entities: Entity[]
	)
	{
		super(name, defn2.name, sizeInPixels, entities);

		this.displayName = displayName;
		this.depth = depth;
		this.defn2 = defn2;
		this.sizeInPixels = sizeInPixels;
		this.map = map;
		this.zones = zones;
		this.entities = [];
		this.entitiesByName = new Map<string, Entity>();

		this.sizeInPixelsHalf = this.sizeInPixels.clone().divideScalar(2);

		this._entitiesByPropertyName = new Map<string,Entity[]>();
		var propertyNamesKnown = this.defn2.propertyNamesToProcess;
		for (var c = 0; c < propertyNamesKnown.length; c++)
		{
			var propertyName = propertyNamesKnown[c];

			var entitiesWithProperty = new Array<Entity>();
			//this._entitiesByPropertyName.push(entitiesWithProperty);
			this._entitiesByPropertyName.set(propertyName, entitiesWithProperty);
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
		this._drawLoc = new Disposition(Coords.create(), null, null);
	}

	static _zLayers: PlaceLevel_ZLayers;
	static ZLayers(): PlaceLevel_ZLayers
	{
		if (PlaceLevel._zLayers == null)
		{
			PlaceLevel._zLayers = new PlaceLevel_ZLayers();
		}
		return PlaceLevel._zLayers;
	}

	// instance methods

	entitiesByPropertyName(propertyName: string): Entity[]
	{
		var returnValues = this._entitiesByPropertyName.get(propertyName);
		if (returnValues == null)
		{
			returnValues = new Array<Entity>();
			this._entitiesByPropertyName.set(propertyName, returnValues);
		}
		return returnValues;
	}

	entitiesWithPropertyNamePresentAtCellPos
	(
		propertyName: string, cellPosToCheck: Coords
	): Entity[]
	{
		var returnEntities = new Array<Entity>();

		var entitiesWithPropertyName = this.entitiesByPropertyName(propertyName);

		if (entitiesWithPropertyName != null)
		{
			for (var i = 0; i < entitiesWithPropertyName.length; i++)
			{
				var entity = entitiesWithPropertyName[i];
				if (entity.locatable().loc.pos.equalsXY(cellPosToCheck) == true)
				{
					ArrayHelper.insertElementAt(returnEntities, entity, 0);
				}
			}
		}

		return returnEntities;
	}

	entitySpawn
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var entityToSpawn = uwpe.entity;

		this.entities.push(entityToSpawn);
		this.entitiesByName.set(entityToSpawn.name, entityToSpawn);

		var entityDefn = entityToSpawn;
		var entityDefnProperties = entityDefn.properties;
		for (var c = 0; c < entityDefnProperties.length; c++)
		{
			var entityDefnProperty = entityDefnProperties[c];
			var entityPropertyName = entityDefnProperty.constructor.name;

			var entityListForPropertyName = this.entitiesByPropertyName(entityPropertyName);

			if (entityListForPropertyName != null)
			{
				entityListForPropertyName.push(entityToSpawn);

				var entityProperty =
					entityToSpawn.propertyByName(entityPropertyName);

				if (entityDefnProperty.initialize == null)
				{
					var entityDefnPropertyAsAny = entityDefnProperty as any;

					if (entityProperty == null)
					{
						entityToSpawn.propertyAddForPlace
						(
							entityDefnPropertyAsAny.clone(), null
						);
					}
				}
				else
				{
					entityDefnProperty.initialize(uwpe);
				}
			}
		}
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.place = this;
		this.hasBeenUpdatedSinceDrawn = true;
		// Initialization of entities is handled in entitySpawn().
		this.update_EntitiesToSpawn(uwpe);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.place = this;

		this.update_EntitiesToSpawn(uwpe);

		var propertyNamesKnown = this.defn2.propertyNamesToProcess;
		for (var i = 0; i < propertyNamesKnown.length; i++)
		{
			var propertyName = propertyNamesKnown[i];
			var entitiesWithProperty = this.entitiesByPropertyName(propertyName);

			//propertyName = propertyName.lowercaseFirstCharacter();
			for (var b = 0; b < entitiesWithProperty.length; b++)
			{
				var entity = entitiesWithProperty[b];
				var entityDefn = entity;
				var entityDefnProperty = entityDefn.propertyByName(propertyName);
				uwpe.entity = entity;
				if (entityDefnProperty.updateForTimerTick != null)
				{
					entityDefnProperty.updateForTimerTick(uwpe);
				}
			}
		}

		this.update_Mappables(uwpe);

		this.update_EntitiesToRemove(uwpe);

		this.draw(uwpe.universe, uwpe.world, uwpe.universe.display);
	}

	update_EntitiesToRemove(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entityToRemove = this.entitiesToRemove[i] as Entity2;

			// hack
			var mappable = entityToRemove.mappable();
			if (mappable != null)
			{
				var entitiesInCell = mappable.mapCellOccupied.entitiesPresent;
				ArrayHelper.remove(entitiesInCell, entityToRemove);
			}

			ArrayHelper.remove(this.entities, entityToRemove);
			this.entitiesByName.delete(entityToRemove.name);

			var entityDefnProperties = entityToRemove.properties;
			for (var c = 0; c < entityDefnProperties.length; c++)
			{
				var entityDefnProperty = entityDefnProperties[c];
				var entityDefnPropertyName = entityDefnProperty.constructor.name;
				var entitiesWithProperty = this.entitiesByPropertyName(entityDefnPropertyName);

				if (entitiesWithProperty != null) // hack
				{
					ArrayHelper.remove(entitiesWithProperty, entityToRemove);
				}
			}
		}

		this.entitiesToRemove.length = 0;
	}

	update_EntitiesToSpawn(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entityToSpawn = this.entitiesToSpawn[i];
			uwpe.entity = entityToSpawn;
			this.entitySpawn(uwpe);
		}

		this.entitiesToSpawn.length = 0;
	}

	update_Mappables(uwpe: UniverseWorldPlaceEntities): void
	{
		var emplacements = this.emplacements();
		var enemies = this.enemies();
		var players = this.players();
		var projectiles = this.projectiles();

		var universe = uwpe.universe;
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

				var mappables = collision.entitiesColliding;

				for (var i = 0; i < mappables.length; i++)
				{
					var entityThis = mappables[i];

					for (var j = i + 1; j < mappables.length; j++)
					{
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

	toControl(universe: Universe, world: World): ControlBase
	{
		if (this.control == null)
		{
			var size = universe.display.sizeInPixels;
			var entityForPlayer = (world as World2).entityForPlayer as Entity2;
			this.control = new ControlContainer
			(
				"containerVenue",
				new Coords(10, 10, 0), // pos
				new Coords(180, 272, 0), // size
				// children
				[
					entityForPlayer.player().toControl(universe, size, entityForPlayer, null),
				],
				null, null
			);
		}

		return this.control;
	}

	// drawable

	draw(universe: Universe, world: World, display: Display): void
	{
		if (this.hasBeenUpdatedSinceDrawn)
		{
			this.hasBeenUpdatedSinceDrawn = false;

			var player = (world as World2).entityForPlayer;
			var placeKnown =
				(player as Entity2).player().placeKnownLookup.get(this.name);

			if (placeKnown != null)
			{
				placeKnown.drawAsKnown(universe, world, display);
			}
		}
	}

	drawAsKnown
	(
		universe: Universe, worldAsWorld: World, displayAsDisplay: Display
	): void
	{
		var world = worldAsWorld as World2;

		var display = displayAsDisplay as DisplayPane;
		display.childSelectByName(null);

		display.childSelectByName("Map");
		display.drawBackground(Color.byName("Black"), Color.byName("Black"));
		var uwpe = new UniverseWorldPlaceEntities(universe, world, this, null, null);
		this.map.draw(uwpe.placeSet(this), display);

		display.childSelectByName("Status");
		display.clear();
		var venueAsControl = this.toControl(universe, world);
		this._drawLoc.pos.clear();
		venueAsControl.draw(universe, display, this._drawLoc, null);
		display.flush();

		display.childSelectByName("Messages");
		display.clear();
		var messageLogAsControl =
			world.entityForPlayer.player().messageLog.controlUpdate(world);
		this._drawLoc.pos.clear();
		messageLogAsControl.draw(universe, display, this._drawLoc, null);
		display.flush();

		display.childSelectByName(null);
		display.drawRectangle
		(
			Coords.Instances().Zeroes,
			display.displayToUse().sizeInPixels,
			null, Color.byName("Gray")
		);
	}

	// entities

	awaitables(): Entity[] { return this.entitiesByPropertyName(Awaitable.name); }
	emplacements(): Entity[] { return this.entitiesByPropertyName(Emplacement.name); }
	enemies(): Entity[] { return this.entitiesByPropertyName("Enemy"); }
	ephemerals(): Entity[] { return this.entitiesByPropertyName(Ephemeral.name); }
	items(): Entity[] { return this.entitiesByPropertyName(Item.name); }
	mappables(): Entity[] { return this.entitiesByPropertyName(Mappable.name); }
	movers(): Entity[] { return this.entitiesByPropertyName(Mover.name); }
	player(): Entity { return this.players()[0]; }
	players(): Entity[] { return this.entitiesByPropertyName(Player.name); }
	portals(): Entity[] { return this.entitiesByPropertyName(Portal2.name); }
	projectiles(): Entity[] { return this.entitiesByPropertyName("Projectile"); }

}

class PlaceLevel_ZLayers
{
	Emplacements: number;
	Items: number;
	Movers: number;

	constructor()
	{
		this.Emplacements = 1;
		this.Items = 2;
		this.Movers = 3;
	}
}
