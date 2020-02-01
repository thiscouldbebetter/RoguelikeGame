
function Player(sightRange)
{
	this.sightRange = sightRange;
	this.messageLog = new MessageLog();
	this.placeKnownLookup = [];
}
{
	Player.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		entity.locatable.loc.pos.z = PlaceLevel.ZLayers.Movers;

		entity.mover.movesThisTurn = 0;
		entity.turnable.hasActedThisTurn = true;

		var placeKnownLookup = entity.player.placeKnownLookup;
		var placeKnown = placeKnownLookup[place.name];
		if (placeKnown == null)
		{
			var mapComplete = place.map;

			mapKnown = Map.buildBlank
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
				place.defn,
				place.sizeInPixels,
				mapKnown,
				place.zones,
				[] // entities
			);

			placeKnownLookup[place.name] = placeKnown;

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				placeKnown,
				place,
				entity.locatable.loc.pos,
				entity.player.sightRange
			);
		}
	}

	Player.prototype.updateForTimerTick = function(universe, world, place, entityPlayer)
	{
		if (entityPlayer.turnable.hasActedThisTurn)
		{
			entityPlayer.starvable.satietyAdd(world, -1, entityPlayer);

			var propertyName = Turnable.name;
			var turnables = place.entities.filter(x => x.turnable != null); // hack
			for (var i = 0; i < turnables.length; i++)
			{
				var entityTurnable = turnables[i];
				var turnable = entityTurnable.turnable;
				turnable.updateForTurn(universe, world, place, entityTurnable);
			}

			world.turnsSoFar++;

			var player = entityPlayer.player;
			var placeKnown = player.placeKnownLookup[place.name];

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				placeKnown,
				place, // placeComplete
				entityPlayer.locatable.loc.pos,
				player.sightRange
			);

			player.controlUpdate(world, entityPlayer);
		}
	};

	// controls

	Player.prototype.controlUpdate = function(world, entity)
	{
		if (this.control == null)
		{
			var controlLocus = new ControlContainer
			(
				"containerLocus",
				new Coords(10, 48), // pos
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5),
						new DataBinding
						(
							this,
							function get(c)
							{
								var loc = entity.locatable.loc;
								var place = loc.place(world);
								var zone = place.displayName;
								var depth = place.depth;
								var turn = world.turnsSoFar;
								var pos = loc.pos.toStringXY();
								var returnValue = "Turn: " + turn + " Zone: " + zone + " Depth: " + depth;
								return returnValue;
							}
						)
					)
				]
			);

			var mover = entity.mover;
			this.control = new ControlContainer
			(
				"containerMover",
				new Coords(0, 0), // pos
				new Coords(180, 272), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 16), "Name: " + entity.name),
					entity.demographics.controlUpdate(world, entity, new Coords(10, 32)),
					entity.starvable.controlUpdate(world, entity, new Coords(10, 64)),
					controlLocus,
				]
			);
		}

		return this.control;
	};
}
