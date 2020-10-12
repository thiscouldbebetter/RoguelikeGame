
class Mappable
{
	constructor(defn)
	{
		this.defn = defn;
		this.mapCellOccupied = null;

		this.entitiesAlreadyCollidedWith = []; // hack
		this.collider = new Sphere(0, 0);
	}

	// collider() { return new Sphere(0, 0); }
}
