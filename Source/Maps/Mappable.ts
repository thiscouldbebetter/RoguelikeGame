
class Mappable implements EntityProperty
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

	// collider() { return new Sphere(0, 0); }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}
