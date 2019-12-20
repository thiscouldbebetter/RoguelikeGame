
function MoverTransport(entityMover, locDestination)
{
	this.entityMover = entityMover;
	this.locDestination = locDestination;
}
{
	MoverTransport.prototype.initializeEntityForVenue = function(universe, world, venue, entityTransport)
	{
		var moverLoc = this.entityMover.LocatableRoguelike;

		var venueToDepart = moverLoc.venue(world);
		venueToDepart.entitiesToRemove.push(this.entityMover);

		// hack
		var collidable = this.entityMover.Collidable;
		var cellOccupied = collidable.mapCellOccupied;
		var entitiesPresentInCellOccupied = cellOccupied.entitiesPresent;
		entitiesPresentInCellOccupied.splice
		(
			entitiesPresentInCellOccupied.indexOf(this.entityMover),
			1
		);

		moverLoc.overwriteWith(this.locDestination);

		venue.entitiesToSpawn.push(this.entityMover);
		venue.entitiesToRemove.push(entityTransport);
	};
}
