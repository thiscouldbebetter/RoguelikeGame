
function VisualSet(name, visuals)
{
	this.name = name;
	this.visuals = visuals;
}

{
	VisualSet.prototype.clone = function()
	{
		return this; // todo
	}

	VisualSet.prototype.draw = function(universe, world, display, drawable)
	{
		for (var i = 0; i < this.visuals.length; i++)
		{
			var visual = this.visuals[i];

			visual.draw(universe, world, display, drawable);
		}
	}

	VisualSet.prototype.updateForVenue = function(entity, venue)
	{
		// do nothing
	}
}
