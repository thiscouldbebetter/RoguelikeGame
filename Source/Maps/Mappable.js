
class Mappable
{
	constructor(defn)
	{
		this.defn = defn;
		this.mapCellOccupied = null;

		this.entitiesAlreadyCollidedWith = []; // hack
	}

	collider()
	{
		return new Sphere(0, 0);
	}
}
