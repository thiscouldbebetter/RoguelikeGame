
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
	ControlContainer.prototype.draw = function(display)
	{
		var drawPos = Control.posAbsoluteOfControl(this);

		display.drawRectangle(drawPos, this.size, null, "Gray");

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(display);
		}
	}
8}
