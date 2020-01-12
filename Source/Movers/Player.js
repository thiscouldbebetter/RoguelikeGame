
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

		entity.MoverData.movesThisTurn = 0;
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
			var moverData = entityPlayer.MoverData;
			var vitals = moverData.vitals.addSatietyToMover(world, -1, entityPlayer);

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
			var moverData = entity.MoverData;
			this.control = new ControlContainer
			(
				"containerMoverData",
				new Coords(0, 0), // pos
				new Coords(180, 272), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 16), "Name: " + entity.name),
					moverData.demographics.controlUpdate(world, entity, new Coords(10, 32)),
					moverData.traits.controlUpdate(world, entity, new Coords(10, 48)),
					moverData.vitals.controlUpdate(world, entity, new Coords(10, 64)),
					moverData.locus.controlUpdate(world, entity, new Coords(10, 112)),
					moverData.skills.controlUpdate(world, entity, new Coords(10, 128)),
					moverData.spells.controlUpdate(world, entity, new Coords(10, 144)),
					//entity.ItemHolder.controlUpdate(world, entity, new Coords(10, 160)),
				]
			);
		}

		return this.control;
	};
}
