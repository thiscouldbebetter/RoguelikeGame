
function MoverGenerator()
{
	// do nothing
}

{
	MoverGenerator.EntityDefn = function()
	{
		if (MoverGenerator._entityDefn == null)
		{
			MoverGenerator._entityDefn = new Entity
			(
				"MoverGenerator",
				// properties
				[
					new ActorDefn("Generate Movers"),
				]
			);
		}

		return MoverGenerator._entityDefn;
	}
}
