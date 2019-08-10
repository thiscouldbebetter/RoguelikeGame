
function ControlLabel(name, pos, textFormat, dataContexts, bindingPaths)
{
	this.name = name;
	this.pos = pos;
	this.textFormat = textFormat;
	this.dataContexts = dataContexts;
	this.bindingPaths = bindingPaths;
}

{
	ControlLabel.prototype.drawToGraphics = function(graphics)
	{
		var drawPos = Control.posAbsoluteOfControl(this);

		var text = this.textFormat;

		if (this.dataContexts != null)
		{
			var textParts = text.split("^");

			text = "";

			for (var i = 0; i < this.dataContexts.length; i++)
			{
				var dataContext = this.dataContexts[i];
				var bindingPath = this.bindingPaths[i];

				var boundValue = Control.getValueFromObjectAtBindingPath
				(
					dataContext,
					bindingPath
				);

				text += textParts[i];
				text += boundValue;
			}

			if (textParts.length > this.dataContexts.length)
			{
				text += textParts[this.dataContexts.length];
			}
		}

		graphics.fillStyle = "Gray";
		graphics.fillText
		(
			text,
			drawPos.x, drawPos.y
		);
	}
}
