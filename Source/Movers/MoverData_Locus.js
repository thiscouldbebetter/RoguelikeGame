
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
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 5), "Floor: ^ Turn: ^"),
					/*
					[
						entity.loc.venue(world).depth,
						world
					],
					[
						null,
						"turnsSoFar"
					]
					*/
				]
			);
		}

		return this.control;
	}
}
