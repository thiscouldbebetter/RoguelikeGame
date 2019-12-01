
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.name = function() { return "Effectable"; }

	EffectableDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		entity.effectData = new EffectData();
	}

	EffectableDefn.prototype.updateEntityForVenue = function(universe, world, venue, entity)
	{
		// todo
	}
}
