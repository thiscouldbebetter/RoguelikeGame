
function EquippableData(equippableDefn)
{
	this.equipmentSocketSet = new EquipmentSocketSet
	(
		equippableDefn.equipmentSocketDefnSet
	);
}

{
	// control

	EquippableData.prototype.controlUpdate = function(entity)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerEquippableData",
				new Coords(0, 0), // pos
				new Coords(100, 100), // size
				[
					new ControlLabel("labelEquipment", new Coords(10, 10), "Equipment:"),
				]
			);
		}

		return this.control;
	};
}
