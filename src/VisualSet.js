
function VisualSet(name, visuals)
{
	this.name = name;
	this.visuals = visuals;
}

{
	VisualSet.prototype.cloneAsVisual = function()
	{
		return this; // todo
	}

	VisualSet.prototype.drawToGraphicsAtPos = function(graphics, drawPos)
	{
		for (var i = 0; i < this.visuals.length; i++)
		{
			var visual = this.visuals[i];

			visual.drawToGraphicsAtPos(graphics, drawPos);
		}
	}

	VisualSet.prototype.updateForVenue = function(entity, venue)
	{
		// do nothing
	}
}
