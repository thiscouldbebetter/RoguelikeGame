
function Mappable(defn)
{
	this.defn = defn;
	this.mapCellOccupied = null;
}
{
	Mappable.prototype.collider = function()
	{
		return new Sphere(0, 0);
	}
}
