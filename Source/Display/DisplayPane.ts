
class DisplayPane implements Display, Namable
{
	name: string;
	pos: Coords;
	size: Coords;
	colorFore: Color;
	colorBack: Color;
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
		colorFore: Color, colorBack: Color, children: DisplayPane[]
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

	drawBackground(colorBack: Color, colorBorder: Color): void
	{
		this.displayToUse().drawBackground(colorBorder, colorBack);
	}

	drawImage(imageToDraw: Image2, pos: Coords): void
	{
		this.displayToUse().drawImage(imageToDraw, pos);
	}

	drawImagePartial(imageToDraw: Image2, pos: Coords, boundsToShow: Box): void
	{
		this.displayToUse().drawImagePartial(imageToDraw, pos, boundsToShow);
	}

	drawImageScaled(imageToDraw: Image2, pos: Coords, size: Coords): void
	{
		this.displayToUse().drawImageScaled(imageToDraw, pos, size);
	}

	drawCircle
	(
		pos: Coords,
		radius: number,
		colorFill: Color,
		colorBorder: Color,
		borderThickness: number
	): void
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
		colorFill: Color, colorBorder: Color, areColorsReversed: boolean
	): void
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
		colorFill: Color,
		colorOutline: Color,
		areColorsReversed: boolean,
		isCentered: boolean,
		widthMaxInPixels: number
	): void
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

	scaleFactor(): Coords
	{
		return this.displayToUse().scaleFactor();
	}

	sizeDefault(): Coords
	{
		return this.sizeInPixels;
	}

	// DisplayPane implementation defaults.

	drawArc
	(
		center: Coords, radiusInner: number, radiusOuter: number,
		angleStartInTurns: number, angleStopInTurns: number, colorFill: Color,
		colorBorder: Color
	): void {}
	drawCircleWithGradient
	(
		center: Coords, radius: number, gradientFill: ValueBreakGroup, colorBorder: Color
	): void {}
	drawCrosshairs(center: Coords, radius: number, color: Color): void {}
	drawEllipse
	(
		center: Coords, semimajorAxis: number, semiminorAxis: number,
		rotationInTurns: number, colorFill: Color, colorBorder: Color
	): void {}
	drawImagePartialScaled
	(
		imageToDraw: Image2, pos: Coords, regionToDrawAsBox: Box, sizeToDraw: Coords
	): void {}
	drawLine(fromPos: Coords, toPos: Coords, color: Color, lineThickness: number): void {}
	drawMeshWithOrientation(mesh: MeshTextured, meshOrientation: Orientation): void {}
	drawPath(vertices: Coords[], color: Color, lineThickness: number, isClosed: boolean): void {}
	drawPixel(pos: Coords, color: Color): void {}
	drawPolygon(vertices: Coords[], colorFill: Color, colorBorder: Color): void {}
	drawRectangleCentered
	(
		pos: Coords, size: Coords, colorFill: Color, colorBorder: Color
	): void {}
	drawWedge
	(
		center: Coords, radius: number, angleStartInTurns: number,
		angleStopInTurns: number, colorFill: Color, colorBorder: Color
	): void {}
	eraseModeSet(value: boolean): void {}
	fontSet(fontName: string, fontHeightInPixels: number): void {}
	hide(universe: Universe): void {}
	rotateTurnsAroundCenter(turnsToRotate: number, centerOfRotation: Coords): void {}
	stateRestore(): void {}
	stateSave(): void {}

}
