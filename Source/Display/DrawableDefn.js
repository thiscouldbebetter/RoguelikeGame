
function DrawableDefn(visual, sizeInPixels, zIndex)
{
	this.visual = visual;
	this.sizeInPixels = sizeInPixels;
	this.zIndex = zIndex;

	if (this.sizeInPixels == null)
	{
		this.sizeInPixels = Coords.Instances().Zeroes;
	}

	if (this.zIndex == null)
	{
		this.zIndex = 0;
	}

	this.sizeInPixelsHalf = this.sizeInPixels.clone().divideScalar(2);
}

{
	DrawableDefn.prototype.name = function() { return "Drawable"; };

	DrawableDefn.prototype.initializeEntityForVenue = function(universe, world, entity, venue)
	{
		entity.drawableData = new DrawableData
		(
			true // isVisible
		);

		var drawableData = entity.drawableData;
		var drawableDefn = entity.defn(world).Drawable;
		drawableData.visual = drawableDefn.visual; //.clone();
	};

	DrawableDefn.prototype.updateEntityForVenue = function(universe, world, entity, venue)
	{
		//entity.drawableData.visual.updateForVenue(entity, venue);
	};
}
