
function ControlList(name, pos, size, bindingPath, listables)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.bindingPath = bindingPath;
	this.listables = listables;
}

{
	ControlList.prototype.draw = function(display)
	{
		var drawPos = Control.posAbsoluteOfControl(this);

		display.drawRectangle(drawPos, this.size, null, "Gray");

		for (var i = 0; i < this.listables.length; i++)
		{
			var listable = this.listables[i];
			var itemText = Control.getValueFromObjectAtBindingPath
			(
				listable,
				this.bindingPath
			);
			display.drawText(itemText, 10, drawPos, "Gray");
		}
	}
}
