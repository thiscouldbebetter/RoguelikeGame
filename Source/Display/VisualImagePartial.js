
function VisualImagePartial(visualImageParent, boundsToShow)
{
	this.visualImageParent = visualImageParent;
	this.boundsToShow = boundsToShow;

	this._drawPos = new Coords();
}
{
	VisualImagePartial.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var image = this.visualImageParent.image(universe);
		var imageSize = this.boundsToShow.size;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			drawable.loc.pos
		);
		display.drawImagePartial(image, drawPos, this.boundsToShow);
	}
}
