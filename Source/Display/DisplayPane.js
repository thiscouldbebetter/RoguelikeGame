function DisplayPane(name, pos, size, children)
{
	this.name = name;
	this.pos = pos;
	this.sizeInPixels = size;
	this.children = children.addLookupsByName();

	this.childSelected = null;
	this.displayInner = new Display
	(
		[ this.sizeInPixels ],
		"todo", 10, // fontName, fontHeightInPixels,
		"Gray", "Black" // colorFore, colorBack
	);
}
{
	DisplayPane.prototype.childSelectByName = function(paneName)
	{
		this.childSelected = this.children[paneName];
	};

	DisplayPane.prototype.childrenDraw = function()
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			this.displayInner.drawImage
			(
				child.toImage(), child.pos
			);
		}
	};

	DisplayPane.prototype.displayToUse = function()
	{
		return (this.childSelected == null ? this.displayInner : this.childSelected);
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

	DisplayPane.prototype.drawImage = function(imageToDraw, pos, size)
	{
		this.displayToUse().drawImage(imageToDraw, pos, size);
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
}
