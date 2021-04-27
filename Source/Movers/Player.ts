
class Player implements EntityProperty
{
	sightRange: number;
	messageLog: MessageLog;
	placeKnownLookup: Map<string, PlaceLevel>;

	control: ControlBase;

	constructor(sightRange: number)
	{
		this.sightRange = sightRange;

		this.messageLog = new MessageLog();
		this.placeKnownLookup = new Map<string, PlaceLevel>();
	}

	initialize
	(
		universe: Universe, worldAsWorld: World, placeAsPlace: Place,
		entityAsEntity: Entity
	)
	{
		var world = worldAsWorld as World2;
		var place = placeAsPlace as PlaceLevel;
		var entity = entityAsEntity as Entity2;

		entity.locatable().loc.pos.z = PlaceLevel.ZLayers().Movers;

		entity.mover().movesThisTurn = 0;
		entity.turnable().hasActedThisTurn = true;

		var placeKnownLookup = entity.player().placeKnownLookup;
		var placeKnown = placeKnownLookup.get(place.name) as PlaceLevel;
		if (placeKnown == null)
		{
			var mapComplete = place.map;

			var mapKnown = this.initialize_MapBuildBlank
			(
				mapComplete.name + "_Known",
				mapComplete.terrains,
				mapComplete.cellSizeInPixels,
				mapComplete.sizeInCells
			);

			placeKnown = new PlaceLevel
			(
				place.name + "_Known",
				place.displayName,
				place.depth,
				place.defn2,
				place.sizeInPixels,
				mapKnown,
				place.zones,
				[] // entities
			);

			placeKnownLookup.set(place.name, placeKnown);

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				placeKnown,
				place,
				entity.locatable().loc.pos,
				entity.player().sightRange
			);
		}
	}

	initialize_MapBuildBlank
	(
		name: string, terrains: MapTerrain[],
		cellSizeInPixels: Coords, sizeInCells: Coords
	)
	{
		var cellsAsStrings = [];

		var terrainBlank = terrains[0]; // hack

		for (var y = 0; y < sizeInCells.y; y++)
		{
			var cellRowAsString = "";

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellRowAsString += terrainBlank.codeChar;
			}

			cellsAsStrings.push(cellRowAsString);
		}

		var returnValue = new MapOfTerrain
		(
			name,
			terrains,
			cellSizeInPixels,
			cellsAsStrings
		);

		return returnValue;
	}

	updateForTimerTick
	(
		universe: Universe, worldAsWorld: World, placeAsPlace: Place, entityPlayerAsEntity: Entity
	)
	{
		var world = worldAsWorld as World2;
		var place = placeAsPlace as PlaceLevel;

		var entityPlayer = entityPlayerAsEntity as Entity2;
		if (entityPlayer.turnable().hasActedThisTurn)
		{
			entityPlayer.starvable2().satietyAdd(world, -1, entityPlayer);

			var turnables = place.entities.filter
			(
				(x: Entity) => (x as Entity2).turnable() != null
			); // hack
			for (var i = 0; i < turnables.length; i++)
			{
				var entityTurnable = turnables[i] as Entity2;
				var turnable = entityTurnable.turnable();
				turnable.updateForTurn(universe, world, place, entityTurnable);
			}

			world.turnsSoFar++;
		}

		if (place.hasBeenUpdatedSinceDrawn)
		{
			var player = entityPlayer.player();
			var placeKnown = player.placeKnownLookup.get(place.name) as PlaceLevel;

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				placeKnown,
				place, // placeComplete
				entityPlayer.locatable().loc.pos,
				player.sightRange
			);

			//player.controlUpdate(world, entityPlayer);
		}
	}

	// controls

	toControl(universe: Universe, size: Coords, entity: Entity, venuePrev: Venue): ControlBase
	{
		return this.toControlOverlay(universe, size, entity);
	}

	toControlOverlay(universe: Universe, size: Coords, entity: Entity)
	{
		var world = universe.world;
		var entity2: Entity2 = (entity as Entity2);

		if (this.control == null)
		{
			var controlLocus = new ControlContainer
			(
				"containerLocus",
				new Coords(10, 48, 0), // pos
				new Coords(160, 16, 0), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5, 0),
						new DataBinding
						(
							this,
							(c: any) =>
							{
								var loc = entity.locatable().loc;
								var place = loc.place(world) as PlaceLevel;
								var zone = place.displayName;
								var depth = place.depth;
								var turn = (world as World2).turnsSoFar;
								var returnValue = "Turn: " + turn + " Zone: " + zone + " Depth: " + depth;
								return returnValue;
							},
							null
						)
					)
				], null, null
			);

			this.control = new ControlContainer
			(
				"containerMover",
				Coords.create(), // pos
				new Coords(180, 272, 0), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 16, 0), "Name: " + entity.name),
					entity2.demographics().toControl(world, entity, new Coords(10, 32, 0)),
					entity2.starvable2().toControl(world, entity, new Coords(10, 64, 0)),
					controlLocus,
				],
				null, null
			);
		}

		return this.control;
	}

	controlUpdate(w: World, e: Entity)
	{
		// todo - Remove this.
	}

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other: Player)
	{
		return this; // todo
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}

}
