
function MoverTransport(entityMover, locDestination)
{
	this.entityMover = entityMover;
	this.locDestination = locDestination;
}
{
	MoverTransport.prototype.initializeEntityForVenue = function(universe, world, venue, entityTransport)
	{
		var moverLoc = this.entityMover.Locatable.loc;

		var venueToDepart = moverLoc.place(world);
		venueToDepart.entitiesToRemove.push(this.entityMover);

		// hack
		var collidable = this.entityMover.Collidable;
		var cellOccupied = collidable.mapCellOccupied;
		var entitiesPresentInCellOccupied = cellOccupied.entitiesPresent;
		entitiesPresentInCellOccupied.remove(this.entityMover);

		moverLoc.overwriteWith(this.locDestination);

		venue.entitiesToSpawn.push(this.entityMover);
		venue.entitiesToRemove.push(entityTransport);
	};
}
