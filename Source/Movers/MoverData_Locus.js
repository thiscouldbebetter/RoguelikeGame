
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
								var loc = entity.Locatable.loc;
								var floor = loc.place(world).depth;
								var turn = world.turnsSoFar;
								var pos = loc.pos.toStringXY();
								var returnValue = "Turn: " + turn + " Floor: " + floor + " Pos: " + pos;
								return returnValue;
							}
						)
					)
				]
			);
		}

		return this.control;
	}
}
