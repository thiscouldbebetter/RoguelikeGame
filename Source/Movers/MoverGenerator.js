
function MoverGenerator()
{
	// do nothing
}

{
	MoverGenerator.EntityDefn = function()
	{
		if (MoverGenerator._entityDefn == null)
		{
			MoverGenerator._entityDefn = new EntityDefn
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
