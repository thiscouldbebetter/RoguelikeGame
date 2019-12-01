
function ContainerData()
{
	this.items = [];
}

{

	// control

	ContainerData.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerContainerData",
				pos,
				new Coords(160, 100), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 10), "Items:"),
					ControlList.fromPosSizeItemsAndBindingForItemText
					(
						new Coords(10, 20), // pos
						new Coords(140, 70), // size
						this.items,
						new DataBinding
						(
							null,
							function get(c) { return c.defn(world).Item.appearance; }
						)
					)
				]
			);
		}

		return this.control;
	}
}
