
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		entity.EffectData = new EffectData();
	}

	EffectableDefn.prototype.updateForTimerTick = function(universe, world, venue, entity)
	{
		// todo
	}
}
