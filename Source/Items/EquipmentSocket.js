
function EquipmentSocket(defn, itemEquipped)
{
	this.defn = defn;
	this.itemEquipped = itemEquipped;
}

{
	// control

	EquipmentSocket.prototype.controlUpdate = function(world, entity)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerEquipmentSocket",
				new Coords(0, 0), // pos
				new Coords(100, 100), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 10), this.defn.name),
				]
			);
		}

		return this.control;
	};
}
