
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.name = function() { return "Effectable"; }

	EffectableDefn.prototype.initializeEntityForVenue = function(universe, world, entity, venue)
	{
		entity.effectData = new EffectData();
	}

	EffectableDefn.prototype.updateEntityForVenue = function(universe, world, entity, venue)
	{
		// todo
	}
}
