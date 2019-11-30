
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
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5),
						new DataBinding
						(
							this,
							function get(c)
							{
								var floor = entity.loc.venue(world).depth;
								var turn = world.turnsSoFar;
								return "Floor: " + floor + " Turn: " + turn;
							}
						)
					)
				]
			);
		}

		return this.control;
	}
}
