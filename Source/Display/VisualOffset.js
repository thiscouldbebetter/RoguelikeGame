
function VisualOffset(visual, offset)
{
	this.visual = visual;
	this.offset = offset;

	this._drawPosSaved = new Coords();
}

{
	VisualOffset.prototype.draw = function(universe, world, display, drawable)
	{
		this._drawPosSaved.overwritewith(drawable.loc.pos);
		this.visual.draw
		(
			universe, world, display, drawable
		);
		drawable.loc.pos.overwriteWith(this._drawPosSaved);
	}
}
