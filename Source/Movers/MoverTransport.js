
function MoverTransport(entityMover, locDestination)
{
	this.entityMover = entityMover;
	this.locDestination = locDestination;
}
{
	MoverTransport.prototype.initializeEntityForPlace = function(universe, world, place, entityTransport)
	{
		var moverLoc = this.entityMover.locatable().loc;

		var placeToDepart = moverLoc.place(world);
		placeToDepart.entitiesToRemove.push(this.entityMover);

		// hack
		var collidable = this.entityMover.collidable();
		var cellOccupied = collidable.mapCellOccupied;
		var entitiesPresentInCellOccupied = cellOccupied.entitiesPresent;
		entitiesPresentInCellOccupied.remove(this.entityMover);

		moverLoc.overwriteWith(this.locDestination);

		place.entitiesToSpawn.push(this.entityMover);
		place.entitiesToRemove.push(entityTransport);
	};
}
