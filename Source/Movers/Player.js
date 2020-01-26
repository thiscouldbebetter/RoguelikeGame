
function Player(sightRange)
{
	this.sightRange = sightRange;
	this.messageLog = new MessageLog();
	this.placeKnownLookup = [];
}
{
	Player.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		entity.Locatable.loc.pos.z = PlaceLevel.ZLayers.Movers;

		entity.Mover.movesThisTurn = 0;
		entity.Turnable.hasActedThisTurn = true;

		var placeKnownLookup = entity.Player.placeKnownLookup;
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
				entity.Locatable.loc.pos,
				entity.Player.sightRange
			);
		}
	}

	Player.prototype.updateForTimerTick = function(universe, world, place, entityPlayer)
	{
		if (entityPlayer.Turnable.hasActedThisTurn)
		{
			entityPlayer.Starvable.satietyAdd(world, -1, entityPlayer);

			var propertyName = Turnable.name;
			var turnables = place.entities.filter(x => x.Turnable != null); // hack
			for (var i = 0; i < turnables.length; i++)
			{
				var entityTurnable = turnables[i];
				var turnable = entityTurnable.Turnable;
				turnable.updateForTurn(universe, world, place, entityTurnable);
			}

			world.turnsSoFar++;

			var player = entityPlayer.Player;
			var placeKnown = player.placeKnownLookup[place.name];

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				placeKnown,
				place, // placeComplete
				entityPlayer.Locatable.loc.pos,
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
								var loc = entity.Locatable.loc;
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

			var mover = entity.Mover;
			this.control = new ControlContainer
			(
				"containerMover",
				new Coords(0, 0), // pos
				new Coords(180, 272), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 16), "Name: " + entity.name),
					entity.Demographics.controlUpdate(world, entity, new Coords(10, 32)),
					entity.Starvable.controlUpdate(world, entity, new Coords(10, 64)),
					controlLocus,
				]
			);
		}

		return this.control;
	};
}
