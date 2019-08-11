
function MoverData_Locus()
{
}

{
	// controls

	MoverData_Locus.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Locus",
				pos,
				new Coords(200, 16), // size
				[
					new ControlLabel
					(
						"labelLocus",
						new Coords(10, 10),
						"Floor: ^ Turn: ^",
						[
							entity.loc.venue(world).depth,
							world
						],
						[
							null,
							"turnsSoFar"
						]
					),
				]
			);
		}

		return this.control;
	}
}
