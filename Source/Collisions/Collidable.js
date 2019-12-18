
function Collidable(defn)
{
	this.defn = defn;
	this.mapCellOccupied = null;
}
{
	Collidable.prototype.collider = function()
	{
		return new Sphere(0, 0);
	}
}
