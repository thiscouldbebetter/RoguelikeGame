
function Direction()
{
	// static class
}
{
	function Direction_Instances()
	{
		this.E 		= new Coords(1, 0);
		this.N 		= new Coords(0, -1);
		this.NE 	= new Coords(1, -1);
		this.NW 	= new Coords(-1, -1);
		this.S 		= new Coords(0, 1);
		this.SE 	= new Coords(1, 1);
		this.SW 	= new Coords(-1, 1);
		this.W 		= new Coords(-1, 0);

		this._ByHeading =
		[
			this.E,
			this.SE,
			this.S,
			this.SW,
			this.W,
			this.NW,
			this.N,
			this.NE,
		];
	};

	Direction.Instances = function()
	{
		if (Direction._instances == null)
		{
			Direction._instances = new Direction_Instances();
		}

		return Direction._instances;
	};
}