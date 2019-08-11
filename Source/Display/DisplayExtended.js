
function DisplayExtended(display)
{
	this.display = display;

	// Helper variables.
	this.cellPos = new Coords();
	this.drawPos = new Coords();
	this.drawLoc = { pos: this.drawPos };
	this.drawable = { loc: this.drawLoc };
	this.entitiesSortedBottomToTop = [];
}
{
	DisplayExtended.prototype.drawControl = function(controlToDraw)
	{
		controlToDraw.drawToGraphics(this.display.graphics);
	};

	DisplayExtended.prototype.drawEntitiesForMap = function(entities, map)
	{
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			this.drawEntityForMap(entity, map);
		}
	};

	DisplayExtended.prototype.drawEntityForMap = function(entity, map)
	{
		var visual = entity.drawableData.visual;
		this.drawable.loc.pos.overwriteWith
		(
			entity.loc.posInCells
		).multiply
		(
			map.cellSizeInPixels
		);

		visual.draw
		(
			null, null, // universe, world
			this.display,
			this.drawable
		);
	};

	DisplayExtended.prototype.drawMap = function(map)
	{
		var cellPos = this.cellPos;
		var drawPos = this.drawPos;
		for (var y = 0; y < map.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < map.sizeInCells.x; x++)
			{
				cellPos.x = x;

				this.drawMapCellAtPos
				(
					map,
					cellPos,
					false // drawMovers
				);

			} // end for x

		} // end for y

		var fieldOfView = Globals.Instance.sightHelper.fieldOfView;
		var numberOfCellsVisible = fieldOfView.numberOfCellsVisible;
		var cellPositionsVisible = fieldOfView.cellPositionsVisible;
		for (var i = 0; i < numberOfCellsVisible; i++)
		{
			var cellPos = cellPositionsVisible[i];
			this.drawMapCellAtPos(map, cellPos, true);
		}
	};

	DisplayExtended.prototype.drawMapCellAtPos = function(map, cellPos, drawMovers)
	{
		var cell = map.cellAtPos(cellPos);
		var cellTerrain = cell.terrain;
		var terrainImage = cellTerrain.image;
		var drawPos = this.drawable.loc.pos;

		drawPos.overwriteWith
		(
			cellPos
		).multiply
		(
			map.cellSizeInPixels
		);

		this.display.graphics.drawImage
		(
			terrainImage.systemImage,
			drawPos.x, drawPos.y
		);

		var entitiesInCell = cell.entitiesPresent;
		var entitiesSortedBottomToTop = this.entitiesSortedBottomToTop;
		entitiesSortedBottomToTop.length = 0;

		for (var i = 0; i < entitiesInCell.length; i++)
		{
			var entityToSort = entitiesInCell[i];
			var entityToSortZIndex = entityToSort.defn().Drawable.zIndex;
			var j;
			for (j = 0; j < entitiesSortedBottomToTop.length; j++)
			{
				var entitySorted = entitiesSortedBottomToTop[j];
				var entitySortedZIndex = entitySorted.defn().Drawable.zIndex;
				if (entityToSortZIndex <= entitySortedZIndex)
				{
					break;
				}
			}
			entitiesSortedBottomToTop.splice(j, 0, entityToSort);
		}

		drawPos.add(map.cellSizeInPixels.clone().half());

		for (var i = 0; i < entitiesSortedBottomToTop.length; i++)
		{
			var entity = entitiesSortedBottomToTop[i];
			if (entity.moverData == null || drawMovers == true)
			{
				var visual = entity.drawableData.visual;
				visual.draw
				(
					null, null, // universe, world
					this.display,
					this.drawable
				);
			}

		} // end for entitiesSortedBottomToTop

	};

	DisplayExtended.prototype.drawVenue = function(venue)
	{
		var turnsSoFar = Globals.Instance.universe.turnsSoFar;
		if (venue.turnLastDrawn != turnsSoFar)
		{
			venue.turnLastDrawn = turnsSoFar;
			var map = venue.map;
			this.drawMap(map);
		}
	};
}
