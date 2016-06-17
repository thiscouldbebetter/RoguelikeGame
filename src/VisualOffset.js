
function VisualOffset(visual, offset)
{
	this.visual = visual;
	this.offset = offset;
}

{
	VisualOffset.prototype.drawToGraphicsAtPos = function(graphics, drawPos)
	{	
		this.visual.drawToGraphicsAtPos
		(
			graphics,
			drawPos.clone().add(this.offset)
		);
	}
}
