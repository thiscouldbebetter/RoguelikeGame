
function Mappable(defn)
{
	this.defn = defn;
	this.mapCellOccupied = null;

	this.entitiesAlreadyCollidedWith = []; // hack
}
{
	Mappable.prototype.collider = function()
	{
		return new Sphere(0, 0);
	}
}
