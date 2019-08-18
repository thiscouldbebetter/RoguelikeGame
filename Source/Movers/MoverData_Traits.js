
function MoverData_Traits(traits)
{
	this.traits = traits;
}

{
	MoverData_Traits.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			var textForTraits = "";

			for (var i = 0; i < this.traits.length; i++)
			{
				var trait = this.traits[i];

				textForTraits += trait.defn.abbreviation + trait.rank + " ";
			}

			this.control = new ControlContainer
			(
				"containerMoverData_Traits",
				pos,
				new Coords(160, 16), // size
				[
					new ControlLabel("labelTraits", new Coords(10, 10), textForTraits),
				]
			);
		}

		return this.control;
	};
}
