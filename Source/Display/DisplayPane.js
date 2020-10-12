
class DisplayPane
{
	constructor(name, pos, size, colorFore, colorBack, children)
	{
		this.name = name;
		this.pos = pos;
		this.sizeInPixels = size;
		this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
		this.sizesAvailable = [ size ];
		this.children = children.addLookupsByName();

		this.childSelected = null;
		this.displayInner = new Display2D
		(
			[ this.sizeInPixels ],
			"Font", 10, // fontName, fontHeightInPixels,
			colorFore, colorBack,
			(children.length == 0 ? true : false) // isInvisible
		);
	}

	childSelectByName(paneName)
	{
		this.childSelected = (paneName == null ? null : this.children[paneName]);
		this._displayToUse = null;
	};

	displayToUse()
	{
		if (this._displayToUse == null)
		{
			this._displayToUse = (this.childSelected == null ? this.displayInner : this.childSelected);
		}
		return this._displayToUse;
	};

	flush()
	{
		var child = this.childSelected;
		if (child != null)
		{
			this.displayInner.drawImage(child.toImage(), child.pos);
		}
	};

	initialize(universe)
	{
		this.displayInner.initialize(universe);
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.initialize(universe);
		}
	};

	toDomElement(platformHelper)
	{
		return this.displayInner.toDomElement(platformHelper);
	};

	textWidthForFontHeight(textToMeasure, fontHeightInPixels)
	{
		return this.displayInner.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
	};

	toImage()
	{
		return this.displayInner.toImage();
	};

	// drawing

	clear()
	{
		this.displayToUse().clear();
	};

	drawBackground(colorBack, colorBorder)
	{
		this.displayToUse().drawBackground(colorBorder, colorBack);
	};

	drawImage(imageToDraw, pos)
	{
		this.displayToUse().drawImage(imageToDraw, pos);
	};

	drawImagePartial(imageToDraw, pos, boundsToShow)
	{
		this.displayToUse().drawImagePartial(imageToDraw, pos, boundsToShow);
	};

	drawImageScaled(imageToDraw, pos, size)
	{
		this.displayToUse().drawImageScaled(imageToDraw, pos, size);
	};

	drawCircle
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

	drawRectangle
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

	drawText
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
	}

	scaleFactor()
	{
		return this.displayToUse().scaleFactor();
	}

	sizeDefault()
	{
		return this.sizeInPixels;
	}
}
