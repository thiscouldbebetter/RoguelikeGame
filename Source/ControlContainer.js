
function ControlContainer(name, pos, size, children)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.children = children;

	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];

		child.parent = this;
		this.children[child.name] = child;
	}
}

{
	ControlContainer.prototype.drawToGraphics = function(graphics)
	{
		var drawPos = Control.posAbsoluteOfControl(this);

		graphics.fillStyle = "rgba(0, 0, 0, 0)";
		graphics.strokeStyle = "Gray";
		graphics.fillRect(drawPos.x, drawPos.y, this.size.x, this.size.y);
		graphics.strokeRect(drawPos.x, drawPos.y, this.size.x, this.size.y);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.drawToGraphics(graphics);
		}
	}
}
