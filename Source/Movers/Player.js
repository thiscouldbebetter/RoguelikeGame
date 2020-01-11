
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
				[] // entities
			);

			placeKnownLookup[place.name] = placeKnown;

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				world,
				placeKnown,
				place,
				entity.Locatable.loc.pos,
				entity.Player.sightRange
			);
		}
	}

	Player.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var moverData = entity.MoverData;
		if (moverData.movesThisTurn <= 0)
		{
			var vitals = moverData.vitals.addSatietyToMover(world, -1, entity);

			var propertyName = Turnable.name;
			var turnables = place.entities.filter(x => x.Turnable != null); // hack
			for (var i = 0; i < turnables.length; i++)
			{
				var entityTurnable = turnables[i];
				var turnable = entityTurnable.Turnable;
				turnable.updateForTurn(universe, world, place, entityTurnable);
			}

			world.turnsSoFar++;

			var placeKnown = entity.Player.placeKnownLookup[place.name];

			world.sightHelper.updatePlaceFromCompleteForViewerPosAndRange
			(
				world,
				placeKnown,
				place, // placeComplete
				entity.Locatable.loc.pos,
				entity.Player.sightRange
			);

			entity.MoverData.controlUpdate(world, entity);
		}
	};
}
