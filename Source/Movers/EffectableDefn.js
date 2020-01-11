
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		entity.EffectData = new EffectData();
	}

	EffectableDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		// todo
	}
}
