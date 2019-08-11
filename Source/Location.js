
function Location(venueName, posInCells)
{
	this.venueName = venueName;
	this.posInCells = posInCells;
	this.heading = 0;
}

{
	Location.prototype.overwriteWith = function(other)
	{
		this.venueName = other.venueName;
		this.posInCells.overwriteWith(other.posInCells);
		this.heading = other.heading;
	}

	Location.prototype.venue = function()
	{
		return Globals.Instance.world.venues[this.venueName];
	}
}
