
function KillableDefn(integrityMax)
{
	this.integrityMax = integrityMax;
}

{
	KillableDefn.prototype.name = function() { return "Killable"; }

	KillableDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		entity.killableData = new KillableData
		(
			entity.defn().Killable
		);
	}

	KillableDefn.prototype.updateEntityForVenue = function(entity, venue)
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
