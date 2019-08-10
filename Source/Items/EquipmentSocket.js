
function EquipmentSocket(defn, itemEquipped)
{
	this.defn = defn;
	this.itemEquipped = itemEquipped;
}

{
	// control

	EquipmentSocket.prototype.controlUpdate = function(entity)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerEquipmentSocket",
				new Coords(0, 0), // pos
				new Coords(100, 100), // size
				[
					new ControlLabel("labelName", new Coords(10, 10), this.defn.name),
				]
			);
		}

		return this.control;
	};
}
