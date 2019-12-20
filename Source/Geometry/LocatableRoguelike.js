
function LocatableRoguelike(pos, venueName)
{
	this.venueName = venueName;
	this.pos = pos;
	this.heading = 0;
}

{
	LocatableRoguelike.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		this.venueName = venue.name;
	}

	LocatableRoguelike.prototype.overwriteWith = function(other)
	{
		this.venueName = other.venueName;
		this.pos.overwriteWithXY(other.pos);
		this.heading = other.heading;
	};

	LocatableRoguelike.prototype.venue = function(world)
	{
		return world.venues[this.venueName];
	};
}
