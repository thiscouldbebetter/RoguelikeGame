
class MoverTransport implements EntityProperty<MoverTransport>
{
	entityMover: Entity2;
	locDestination: Disposition;

	constructor(entityMover: Entity2, locDestination: Disposition)
	{
		this.entityMover = entityMover;
		this.locDestination = locDestination;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var place = uwpe.place;
		var entityTransport = uwpe.entity;

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

	// Equatable.
	equals(other: MoverTransport) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
