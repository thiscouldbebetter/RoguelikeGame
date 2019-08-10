
function MoverData_Spells(spells)
{
	this.spells = spells;
}

{
	MoverData_Spells.prototype.controlUpdate = function(entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Spells",
				pos,
				new Coords(200, 16), // size
				[
					new ControlLabel("labelSpells", new Coords(10, 10), "Spells"),
				]
			);
		}

		return this.control;
	}
}
