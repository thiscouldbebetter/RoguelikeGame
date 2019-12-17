
function EquippableDefn(equipmentSocketDefnSet)
{
	this.equipmentSocketDefnSet = equipmentSocketDefnSet;
}

{
	EquippableDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		entity.EquippableData = new EquippableData
		(
			entity.EquippableDefn
		);
	}
}
