
function EquippableDefn(equipmentSocketDefnSet)
{
	this.equipmentSocketDefnSet = equipmentSocketDefnSet;
}

{
	EquippableDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		entity.EquippableData = new EquippableData
		(
			entity.EquippableDefn
		);
	}
}
