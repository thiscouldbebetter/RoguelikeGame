
function EquippableDefn(equipmentSocketDefnSet)
{
	this.equipmentSocketDefnSet = equipmentSocketDefnSet;
}

{
	EquippableDefn.prototype.name = function() { return "Equippable"; }

	EquippableDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		entity.equippableData = new EquippableData
		(
			entity.defn(world).Equippable
		);
	}
}
