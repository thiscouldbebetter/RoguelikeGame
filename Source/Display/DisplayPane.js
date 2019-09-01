function DisplayPane(name, pos, size, colorFore, colorBack, children)
{
	this.name = name;
	this.pos = pos;
	this.sizeInPixels = size;
	this.children = children.addLookupsByName();

	this.childSelected = null;
	this.displayInner = new Display
	(
		[ this.sizeInPixels ],
		"Font", 10, // fontName, fontHeightInPixels,
		colorFore, colorBack
	);
}
{
	DisplayPane.prototype.childSelectByName = function(paneName)
	{
		this.childSelected = (paneName == null ? null : this.children[paneName]);
	};

	DisplayPane.prototype.displayToUse = function()
	{
		return (this.childSelected == null ? this.displayInner : this.childSelected);
	};

	DisplayPane.prototype.flush = function()
	{
		var child = this.childSelected;
		if (child != null)
		{
			this.displayInner.drawImage(child.toImage(), child.pos);
		}
	};

	DisplayPane.prototype.initialize = function()
	{
		this.displayInner.initialize();
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.initialize();
		}
	};

	DisplayPane.prototype.toDomElement = function(platformHelper)
	{
		return this.displayInner.toDomElement(platformHelper);
	};

	DisplayPane.prototype.toImage = function()
	{
		return this.displayInner.toImage();
	};

	// drawing

	DisplayPane.prototype.clear = function()
	{
		this.displayToUse().clear();
	};

	DisplayPane.prototype.drawBackground = function(colorBorder, colorBack)
	{
		this.displayToUse().drawBackground(colorBorder, colorBack);
	};

	DisplayPane.prototype.drawImage = function(imageToDraw, pos)
	{
		this.displayToUse().drawImage(imageToDraw, pos);
	};

	DisplayPane.prototype.drawImagePartial = function(imageToDraw, pos, boundsToShow)
	{
		this.displayToUse().drawImagePartial(imageToDraw, pos, boundsToShow);
	};

	DisplayPane.prototype.drawImageScaled = function(imageToDraw, pos, size)
	{
		this.displayToUse().drawImageScaled(imageToDraw, pos, size);
	};

	DisplayPane.prototype.drawCircle = function
	(
		pos,
		radius,
		colorFill,
		colorBorder
	)
	{
		this.displayToUse().drawCircle
		(
			pos,
			radius,
			colorFill,
			colorBorder
		);
	};

	DisplayPane.prototype.drawRectangle = function
	(
		pos,
		size,
		colorFill,
		colorBorder,
		areColorsReversed
	)
	{
		this.displayToUse().drawRectangle
		(
			pos,
			size,
			colorFill,
			colorBorder,
			areColorsReversed
		);
	};

	DisplayPane.prototype.drawText = function
	(
		text,
		fontHeightInPixels,
		pos,
		colorFill,
		colorOutline,
		areColorsReversed,
		isCentered,
		widthMaxInPixels
	)
	{
		this.displayToUse().drawText
		(
			text,
			fontHeightInPixels,
			pos,
			colorFill,
			colorOutline,
			areColorsReversed,
			isCentered,
			widthMaxInPixels
		);
	};

	DisplayPane.prototype.scaleFactor = function()
	{
		return this.displayToUse().scaleFactor();
	}

	DisplayPane.prototype.sizeDefault = function()
	{
		return this.sizeInPixels;
	}
}
