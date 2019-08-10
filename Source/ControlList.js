
function ControlList(name, pos, size, bindingPath, listables)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.bindingPath = bindingPath;
	this.listables = listables;
}

{
	ControlList.prototype.drawToGraphics = function(graphics)
	{
		var drawPos = Control.posAbsoluteOfControl(this);

		graphics.fillStyle = "rgba(0, 0, 0, 0)";
		graphics.strokeStyle = "Gray";
		graphics.fillRect(drawPos.x, drawPos.y, this.size.x, this.size.y);
		graphics.strokeRect(drawPos.x, drawPos.y, this.size.x, this.size.y);

		graphics.fillStyle = "Gray";
		for (var i = 0; i < this.listables.length; i++)
		{
			var listable = this.listables[i];
			drawPos.y += 10; // hack
			var itemText = Control.getValueFromObjectAtBindingPath
			(
				listable,
				this.bindingPath
			);
			graphics.fillText
			(
				itemText,
				drawPos.x,
				drawPos.y
			)
		}
	}
}
