
function KillableDefn(integrityMax)
{
	this.integrityMax = integrityMax;
}

{
	KillableDefn.prototype.name = function() { return "Killable"; }

	KillableDefn.prototype.initializeEntityForVenue = function(universe, world, entity, venue)
	{
		entity.killableData = new KillableData
		(
			entity.defn(world).Killable
		);
	}

	KillableDefn.prototype.updateEntityForVenue = function(universe, world, entity, venue)
	{
		var killableData = entity.killableData;

		if (killableData.ticksToLive != null)
		{
			killableData.ticksToLive--;

			if (killableData.ticksToLive <= 0)
			{
				venue.entitiesToRemove.push(entity);
			}
		}

		if (killableData.integrity <= 0)
		{
			venue.entitiesToRemove.push(entity);
		}
	}
}
