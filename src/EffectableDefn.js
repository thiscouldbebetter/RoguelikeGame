
function EffectableDefn()
{
	// do nothing
}

{
	EffectableDefn.prototype.name = function() { return "Effectable"; }

	EffectableDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		entity.effectData = new EffectData();
	}

	EffectableDefn.prototype.updateEntityForVenue = function(entity, venue)
	{
		// todo
	}		 
}
