
class Mappable extends EntityProperty
{
	defn: MappableDefn;

	mapCellOccupied: MapOfTerrainCell;
	entitiesAlreadyCollidedWith: Entity[];
	collider: Sphere;

	constructor(defn: MappableDefn)
	{
		super();

		this.defn = defn;
		this.mapCellOccupied = null;

		this.entitiesAlreadyCollidedWith = []; // hack
		this.collider = new Sphere(new Coords(0, 0, 0), 0);
	}

	// collider() { return new Sphere(0, 0); }
}
