
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
		this.posInCells = other.posInCells.clone();
		this.heading = other.heading;
	}

	Location.prototype.venue = function()
	{
		return Globals.Instance.universe.venues[this.venueName];
	}
}
