
function PlayerDefn()
{
	// todo
}

{
	PlayerDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		if (entity.PlayerData == null)
		{
			entity.PlayerData = new PlayerData();
			entity.LocatableRoguelike.pos.z = 2;
		}

		entity.MoverData.movesThisTurn = 0;

		var venueKnownLookup = entity.PlayerData.venueKnownLookup;
		var venueKnown = venueKnownLookup[venue.name];
		if (venueKnown == null)
		{
			var mapComplete = venue.map;

			mapKnown = Map.buildBlank
			(
				mapComplete.name + "_Known",
				mapComplete.terrains,
				mapComplete.cellSizeInPixels,
				mapComplete.sizeInCells
			);

			venueKnown = new VenueLevel
			(
				venue.name + "_Known",
				venue.depth,
				venue.defn,
				venue.sizeInPixels,
				mapKnown,
				[] // entities
			);

			venueKnownLookup[venue.name] = venueKnown;

			var propertyName = "Drawable";
			var entitiesNotYetVisible = venue.entitiesByPropertyName[propertyName];
			for (var i = 0; i < entitiesNotYetVisible.length; i++)
			{
				var entity = entitiesNotYetVisible[i];
				entity.Drawable.isVisible = false;
			}

			world.sightHelper.updateVenueFromCompleteForViewerPosAndRange
			(
				world,
				venueKnown,
				venue,
				entity.LocatableRoguelike.pos,
				8 //sightRange
			);
		}
	}

	PlayerDefn.prototype.updateEntityForVenue = function(universe, world, venue, entity)
	{
		var moverData = entity.MoverData;
		if (moverData.movesThisTurn <= 0)
		{
			var vitals = moverData.vitals.addSatietyToMover(world, -1, entity);

			var propertyName = MoverDefn.name;
			var moversToRecharge = venue.entitiesByPropertyName[propertyName];
			for (var i = 0; i < moversToRecharge.length; i++)
			{
				var mover = moversToRecharge[i];
				mover.MoverData.movesThisTurn = mover.MoverDefn.movesPerTurn;
			}

			world.turnsSoFar++;

			var venueKnown = entity.PlayerData.venueKnownLookup[venue.name];

			world.sightHelper.updateVenueFromCompleteForViewerPosAndRange
			(
				world,
				venueKnown,
				venue, // venueComplete
				entity.LocatableRoguelike.pos,
				8 //sightRange
			);

			entity.MoverData.controlUpdate(world, entity);
		}
	}
}
