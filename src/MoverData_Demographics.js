
function MoverData_Demographics(species, role, rank)
{
	this.species = species;
	this.role = role;
	this.rank = rank;
}

{
	// controls

	MoverData_Demographics.prototype.controlUpdate = function(entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Demographics",
				pos,
				new Coords(200, 16), // size
				[
					new ControlLabel
					(
						"labelDemographics", 
						new Coords(10, 10), 
						"Level " + this.rank + " " + this.species + " " + this.role
					),
				]
			);
		}

		return this.control;				
	}
}
