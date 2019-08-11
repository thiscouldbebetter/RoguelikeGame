
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.name = function() { return "Effectable"; }

	EffectableDefn.prototype.initializeEntityForVenue = function(world, entity, venue)
	{
		entity.effectData = new EffectData();
	}

	EffectableDefn.prototype.updateEntityForVenue = function(world, entity, venue)
	{
		// todo
	}
}
