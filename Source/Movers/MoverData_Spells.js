
function MoverData_Spells(spells)
{
	this.spells = spells;
}

{
	MoverData_Spells.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Spells",
				pos,
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 5), "Spells"),
				]
			);
		}

		return this.control;
	}
}
