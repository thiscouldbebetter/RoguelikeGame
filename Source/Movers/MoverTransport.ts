
class MoverTransport implements EntityProperty
{
	entityMover: Entity2;
	locDestination: Disposition;

	constructor(entityMover: Entity2, locDestination: Disposition)
	{
		this.entityMover = entityMover;
		this.locDestination = locDestination;
	}

	initialize(universe: Universe, world: World, place: Place, entityTransport: Entity): void
	{
		var moverLoc = this.entityMover.locatable().loc;

		var placeToDepart = moverLoc.place(world);
		placeToDepart.entitiesToRemove.push(this.entityMover);

		// hack
		var collidable = this.entityMover.mappable();
		var cellOccupied = collidable.mapCellOccupied;
		var entitiesPresentInCellOccupied = cellOccupied.entitiesPresent;
		entitiesPresentInCellOccupied.splice
		(
			entitiesPresentInCellOccupied.indexOf(this.entityMover), 1
		);

		moverLoc.overwriteWith(this.locDestination);

		place.entitiesToSpawn.push(this.entityMover);
		place.entitiesToRemove.push(entityTransport);
	}

	// Clonable.
	clone(): MoverTransport { return this; }
	overwriteWith(other: MoverTransport): MoverTransport { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
