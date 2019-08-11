
function PlayerDefn()
{
	// todo
}

{
	PlayerDefn.prototype.name = function() { return "Player"; }

	PlayerDefn.prototype.initializeEntityForVenue = function(world, entity, venue)
	{
		entity.playerData = new PlayerData();

		entity.moverData.movesThisTurn = 0;

		var venueKnownLookup = entity.playerData.venueKnownLookup;
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

			venueKnown = new Venue
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
				entity.drawableData.isVisible = false;
			}

			Globals.Instance.sightHelper.updateVenueFromCompleteForViewerPosAndRange
			(
				world,
				venueKnown,
				venue,
				entity.loc.posInCells,
				8 //sightRange
			);

		}
	}

	PlayerDefn.prototype.updateEntityForVenue = function(world, entity, venue)
	{
		if (entity.moverData.movesThisTurn <= 0)
		{
			var vitals = entity.moverData.vitals.addSatietyToMover(world, -1, entity);

			var propertyName = "Mover";
			var moversToRecharge = venue.entitiesByPropertyName[propertyName];
			for (var i = 0; i < moversToRecharge.length; i++)
			{
				var mover = moversToRecharge[i];
				mover.moverData.movesThisTurn = mover.defn(world).Mover.movesPerTurn;
			}

			world.turnsSoFar++;

			var venueKnown = entity.playerData.venueKnownLookup[venue.name];

			Globals.Instance.sightHelper.updateVenueFromCompleteForViewerPosAndRange
			(
				world, 
				venueKnown,
				venue, // venueComplete
				entity.loc.posInCells,
				8 //sightRange
			);

			entity.moverData.controlUpdate(world, entity);
		}
	}
}
