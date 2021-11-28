"use strict";
class DisplayPane {
    constructor(name, pos, size, colorFore, colorBack, children) {
        this.name = name;
        this.pos = pos;
        this.sizeInPixels = size;
        this.sizeInPixelsHalf = this.sizeInPixels.clone().half();
        this.sizesAvailable = [size];
        this.children = children;
        this.childrenByName = ArrayHelper.addLookupsByName(children);
        this.childSelected = null;
        this.displayInner = new Display2D([this.sizeInPixels], "Font", 10, // fontName, fontHeightInPixels,
        colorFore, colorBack, (children.length == 0 ? true : false) // isInvisible
        );
    }
    childSelectByName(paneName) {
        this.childSelected = (paneName == null ? null : this.childrenByName.get(paneName));
        this._displayToUse = null;
    }
    displayToUse() {
        if (this._displayToUse == null) {
            this._displayToUse =
                (this.childSelected == null
                    ? this.displayInner
                    : this.childSelected);
        }
        return this._displayToUse;
    }
    flush() {
        var child = this.childSelected;
        if (child != null) {
            this.displayInner.drawImage(child.toImage(), child.pos);
        }
    }
    initialize(universe) {
        this.displayInner.initialize(universe);
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.initialize(universe);
        }
        return this;
    }
    toDomElement() {
        return this.displayInner.toDomElement();
    }
    textWidthForFontHeight(textToMeasure, fontHeightInPixels) {
        return this.displayInner.textWidthForFontHeight(textToMeasure, fontHeightInPixels);
    }
    toImage() {
        return this.displayInner.toImage();
    }
    // drawing
    clear() {
        this.displayToUse().clear();
    }
    drawBackground(colorBack, colorBorder) {
        this.displayToUse().drawBackground(colorBorder, colorBack);
    }
    drawImage(imageToDraw, pos) {
        this.displayToUse().drawImage(imageToDraw, pos);
    }
    drawImagePartial(imageToDraw, pos, boundsToShow) {
        this.displayToUse().drawImagePartial(imageToDraw, pos, boundsToShow);
    }
    drawImageScaled(imageToDraw, pos, size) {
        this.displayToUse().drawImageScaled(imageToDraw, pos, size);
    }
    drawCircle(pos, radius, colorFill, colorBorder, borderThickness) {
        this.displayToUse().drawCircle(pos, radius, colorFill, colorBorder, borderThickness);
    }
    drawRectangle(pos, size, colorFill, colorBorder) {
        this.displayToUse().drawRectangle(pos, size, colorFill, colorBorder);
    }
    drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius) {
        this.displayToUse().drawRectangleWithRoundedCorners(pos, size, colorFill, colorBorder, cornerRadius);
    }
    drawText(text, fontHeightInPixels, pos, colorFill, colorOutline, isCentered, widthMaxInPixels) {
        this.displayToUse().drawText(text, fontHeightInPixels, pos, colorFill, colorOutline, isCentered, widthMaxInPixels);
    }
    scaleFactor() {
        return this.displayToUse().scaleFactor();
    }
    sizeDefault() {
        return this.sizeInPixels;
    }
    // DisplayPane implementation defaults.
    drawArc(center, radiusInner, radiusOuter, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
    drawCircleWithGradient(center, radius, gradientFill, colorBorder) { }
    drawCrosshairs(center, numberOfLines, radiusOuter, radiusInner, color, lineThickness) { }
    drawEllipse(center, semimajorAxis, semiminorAxis, rotationInTurns, colorFill, colorBorder) { }
    drawImagePartialScaled(imageToDraw, pos, regionToDrawAsBox, sizeToDraw) { }
    drawLine(fromPos, toPos, color, lineThickness) { }
    drawMeshWithOrientation(mesh, meshOrientation) { }
    drawPath(vertices, color, lineThickness, isClosed) { }
    drawPixel(pos, color) { }
    drawPolygon(vertices, colorFill, colorBorder) { }
    drawRectangleCentered(pos, size, colorFill, colorBorder) { }
    drawWedge(center, radius, angleStartInTurns, angleStopInTurns, colorFill, colorBorder) { }
    eraseModeSet(value) { }
    fontSet(fontName, fontHeightInPixels) { }
    hide(universe) { }
    rotateTurnsAroundCenter(turnsToRotate, centerOfRotation) { }
    stateRestore() { }
    stateSave() { }
}
