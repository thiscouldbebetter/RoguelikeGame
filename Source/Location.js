
function LocationRoguelike(venueName, posInCells)
{
	this.venueName = venueName;
	this.posInCells = posInCells;
	this.heading = 0;
}

{
	LocationRoguelike.prototype.overwriteWith = function(other)
	{
		this.venueName = other.venueName;
		this.posInCells.overwriteWith(other.posInCells);
		this.heading = other.heading;
	};

	LocationRoguelike.prototype.venue = function(world)
	{
		return world.venues[this.venueName];
	};
}
