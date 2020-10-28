
class DisplayPane implements Display, Namable
{
	name: string;
	pos: Coords;
	size: Coords;
	colorFore: string;
	colorBack: string;
	children: DisplayPane[];
	childrenByName: Map<string, DisplayPane>;

	childSelected: DisplayPane;
	fontHeightInPixels: number;
	fontName: string;
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;
	sizesAvailable: Coords[];

	displayInner: Display;
	_displayToUse: Display;

	constructor
	(
		name: string, pos: Coords, size: Coords,
		colorFore: string, colorBack: string, children: DisplayPane[]
	)
	{
		this.name = name;
		this.pos = pos;
		this.sizeInPixels = size;
		this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
		this.sizesAvailable = [ size ];
		this.children = children;
		this.childrenByName = ArrayHelper.addLookupsByName(children);

		this.childSelected = null;
		this.displayInner = new Display2D
		(
			[ this.sizeInPixels ],
			"Font", 10, // fontName, fontHeightInPixels,
			colorFore, colorBack,
			(children.length == 0 ? true : false) // isInvisible
		);
	}

	childSelectByName(paneName: string)
	{
		this.childSelected = (paneName == null ? null : this.childrenByName.get(paneName) );
		this._displayToUse = null;
	}

	displayToUse()
	{
		if (this._displayToUse == null)
		{
			this._displayToUse =
			(
				this.childSelected == null
				? (this.displayInner as Display)
				: (this.childSelected as Display)
			);
		}
		return this._displayToUse;
	}

	flush()
	{
		var child = this.childSelected;
		if (child != null)
		{
			this.displayInner.drawImage(child.toImage(), child.pos);
		}
	}

	initialize(universe: Universe): Display
	{
		this.displayInner.initialize(universe);
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.initialize(universe);
		}
		return this;
	}

	toDomElement()
	{
		return this.displayInner.toDomElement();
	}

	textWidthForFontHeight(textToMeasure: string, fontHeightInPixels: number)
	{
		return this.displayInner.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
	}

	toImage()
	{
		return this.displayInner.toImage();
	}

	// drawing

	clear()
	{
		this.displayToUse().clear();
	}

	drawBackground(colorBack: string, colorBorder: string)
	{
		this.displayToUse().drawBackground(colorBorder, colorBack);
	}

	drawImage(imageToDraw: Image2, pos: Coords)
	{
		this.displayToUse().drawImage(imageToDraw, pos);
	}

	drawImagePartial(imageToDraw: Image2, pos: Coords, boundsToShow: Box)
	{
		this.displayToUse().drawImagePartial(imageToDraw, pos, boundsToShow);
	}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords)
	{
		this.displayToUse().drawImageScaled(imageToDraw, pos, size);
	}

	drawCircle
	(
		pos: Coords,
		radius: number,
		colorFill: string,
		colorBorder: string,
		borderThickness: number
	)
	{
		this.displayToUse().drawCircle
		(
			pos,
			radius,
			colorFill,
			colorBorder,
			borderThickness
		);
	}

	drawRectangle
	(
		pos: Coords, size: Coords,
		colorFill: string, colorBorder: string, areColorsReversed: boolean
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
	}

	drawText
	(
		text: string,
		fontHeightInPixels: number,
		pos: Coords,
		colorFill: string,
		colorOutline: string,
		areColorsReversed: boolean,
		isCentered: boolean,
		widthMaxInPixels: number
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

	// DisplayPane implementation defaults.

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: string,
		colorBorder: string
	) {}
	drawCircleWithGradient(center: Coords, radius: number, gradientFill: ValueBreakGroup, colorBorder: string) {}
	drawCrosshairs(center: Coords, radius: number, color: string) {}
	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: string, colorBorder: string
	) {}
	drawImagePartialScaled(imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords) {}
	drawLine(fromPos: Coords, toPos: Coords, color: string, lineThickness: number) {}
	drawMeshWithOrientation(mesh: MeshTextured, meshOrientation: Orientation) {}
	drawPath(vertices: Coords[], color: string, lineThickness: number, isClosed: boolean) {}
	drawPixel(pos: Coords, color: string) {}
	drawPolygon(vertices: Coords[], colorFill: string, colorBorder: string) {}
	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: string, colorBorder: string
	) {}
	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: string, colorBorder: string
	) {}
	eraseModeSet(value: boolean) {}
	fontSet(fontName: string, fontHeightInPixels: number) {}
	hide(universe: Universe) {}
	rotateTurnsAroundCenter(turnsToRotate: number, centerOfRotation: Coords) {}
	stateRestore() {}
	stateSave() {}

}
