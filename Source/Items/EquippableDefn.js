
function EquippableDefn(equipmentSocketDefnSet)
{
	this.equipmentSocketDefnSet = equipmentSocketDefnSet;
}

{
	EquippableDefn.prototype.name = function() { return "Equippable"; }

	EquippableDefn.prototype.initializeEntityForVenue = function(world, entity)
	{
		entity.equippableData = new EquippableData
		(
			entity.defn().Equippable
		);
	}
}
