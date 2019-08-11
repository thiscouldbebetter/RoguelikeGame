
function DynamicDefn(vel, accel)
{
	this.vel = vel;
	this.accel = accel;
}

{
	DynamicDefn.prototype.name = function() { return "Dynamic"; }

	DynamicDefn.prototype.updateEntityForVenue = function(world, entity, venue)
	{
		entity.dynamicData = new DynamicData(entity.defn(world).Dynamic);
		var dynamicData = entity.dynamicData;
		entity.loc.posInCells.add(dynamicData.vel);
	}
}
