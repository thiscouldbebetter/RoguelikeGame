
function MoverData_Demographics(species, role, rank)
{
	this.species = species;
	this.role = role;
	this.rank = rank;
}

{
	// controls

	MoverData_Demographics.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Demographics",
				pos,
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5),
						"Level " + this.rank + " " + this.species + " " + this.role
					),
				]
			);
		}

		return this.control;
	}
}
