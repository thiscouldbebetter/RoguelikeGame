
function EphemeralDefn(ticksToLive)
{
	this.ticksToLive = ticksToLive;
}

{
	EphemeralDefn.prototype.name = function() { return "Ephemeral"; }

	EphemeralDefn.prototype.initializeEntityForVenue = function(world, entity, venue)
	{
		entity.ephemeralData = new EphemeralData
		(
			entity.defn(world).Ephemeral
		);
	}

	EphemeralDefn.prototype.updateEntityForVenue = function(world, entity, venue)
	{
		var ephemeralData = entity.ephemeralData;

		ephemeralData.ticksToLive--;
		if (ephemeralData.ticksToLive <= 0)
		{
			venue.entitiesToRemove.push(entity);
		}
	}
}
