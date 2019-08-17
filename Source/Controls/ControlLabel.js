
function ControlLabel(name, pos, textFormat, dataContexts, bindingPaths)
{
	this.name = name;
	this.pos = pos;
	this.textFormat = textFormat;
	this.dataContexts = dataContexts;
	this.bindingPaths = bindingPaths;
}

{
	ControlLabel.prototype.draw = function(display)
	{
		var drawPos = Control.posAbsoluteOfControl(this);
		drawPos.y -= 10; // hack

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

		display.drawText(text, 10, drawPos, "Gray");
	}
}
