
class Mappable implements EntityProperty<Mappable>
{
	defn: MappableDefn;

	mapCellOccupied: MapOfTerrainCell;
	entitiesAlreadyCollidedWith: Entity[];
	collider: Sphere;

	constructor(defn: MappableDefn)
	{
		this.defn = defn;
		this.mapCellOccupied = null;

		this.entitiesAlreadyCollidedWith = []; // hack
		this.collider = new Sphere(Coords.create(), 0);
	}

	// Equatable.
	equals(other: Mappable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}
