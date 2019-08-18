
function Map(name, terrains, cellSizeInPixels, cellsAsStrings)
{
	this.name = name;
	this.terrains = terrains;
	this.cellSizeInPixels = cellSizeInPixels;

	this.sizeInCells = new Coords
	(
		cellsAsStrings[0].length,
		cellsAsStrings.length,
		1
	);

	this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
	(
		Coords.Instances().Ones
	);

	this.sizeInPixels = this.sizeInCells.clone().multiply(this.cellSizeInPixels);

	this.cellIndicesModified = [];

	this.cells = [];

	var cellPos = new Coords(0, 0, 0);
	for (var y = 0; y < this.sizeInCells.y; y++)
	{
		cellPos.y = y;
		for (var x = 0; x < this.sizeInCells.x; x++)
		{
			cellPos.x = x;

			var cellAsChar = cellsAsStrings[cellPos.y][cellPos.x];
			var cellTerrain = this.terrains[cellAsChar];

			var cell = new MapCell(cellTerrain);
			this.cells.push(cell);
		}
	}

	// Helper variables.
	this.cellPos = new Coords();
	this.drawPos = new Coords();
	this.drawLoc = { pos: this.drawPos };
	this.drawable = { loc: this.drawLoc };
	this.entitiesSortedBottomToTop = [];
}

{
	// static methods

	Map.buildBlank = function(name, terrains, cellSizeInPixels, sizeInCells)
	{
		var cellsAsStrings = [];

		var terrainBlank = terrains[0]; // hack

		for (var y = 0; y < sizeInCells.y; y++)
		{
			var cellRowAsString = "";

			for (var x = 0; x < sizeInCells.x; x++)
			{
				cellRowAsString += terrainBlank.codeChar;
			}

			cellsAsStrings.push(cellRowAsString);
		}

		var returnValue = new Map
		(
			name,
			terrains,
			cellSizeInPixels,
			cellsAsStrings
		);

		return returnValue;
	};

	// instance methods

	Map.prototype.buildCellPosFromIndex = function(cellIndex)
	{
		return new Coords
		(
			cellIndex % this.sizeInCells.x,
			Math.floor(cellIndex / this.sizeInCells.x)
		);
	};

	Map.prototype.cellAtPos = function(cellPos)
	{
		var returnValue = null;

		if (cellPos.isInRangeMax(this.sizeInCellsMinusOnes) == true)
		{
			var cellIndex = this.indexOfCellAtPos(cellPos);

			returnValue = this.cells[cellIndex];
		}

		return returnValue;
	};

	Map.prototype.cellAtPos_Set = function(cellPos, cellToSet)
	{
		var cellIndex = this.indexOfCellAtPos(cellPos);
		this.cells[cellIndex] = cellToSet;

		this.cellIndicesModified.push(cellIndex);
	};

	Map.prototype.clone = function()
	{
		var cellsAsStrings = [];

		var cellPos = new Coords(0, 0);
		for (var y = 0; y < map.sizeInCells.y; y++)
		{
			cellPos.y = y;
			var cellRowAsString = "";

			for (var x = 0; x < map.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cell = this.cellAtPos(cellPos);
				var cellTerrain = this.terrains[cellAsChar];
				var terrainChar = terrain.codeChar;
				cellRowAsString += terrainChar;
			}

			cellsAsStrings.push(cellRowAsString);
		}

		return new Map
		(
			this.name,
			this.terrains,
			this.cellSizeInPixels,
			cellsAsStrings
		);
	};

	Map.prototype.copyNCellsAtPositionsToOther = function
	(
		numberOfCellsToCopy,
		cellPositionsToCopy,
		other
	)
	{
		for (var i = 0; i < numberOfCellsToCopy; i++)
		{
			var cellPos = cellPositionsToCopy[i];
			var cell = this.cellAtPos(cellPos);
			if (cell != null)
			{
				other.cellAtPos_Set(cellPos, cell);
			}
		}
	};

	Map.prototype.indexOfCellAtPos = function(cellPos)
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x
	};

	// drawable

	Map.prototype.draw = function(world, display, venue)
	{
		var player = world.entityForPlayer;
		var playerPos = player.loc.posInCells;

		var cellPos = this.cellPos;
		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				this.drawCellAtPos
				(
					world,
					display,
					playerPos,
					cellPos,
					false // drawMovers
				);

			} // end for x

		} // end for y

		var fieldOfView = world.sightHelper.fieldOfView;
		var numberOfCellsVisible = fieldOfView.numberOfCellsVisible;
		var cellPositionsVisible = fieldOfView.cellPositionsVisible;
		for (var i = 0; i < numberOfCellsVisible; i++)
		{
			var cellPos = cellPositionsVisible[i];
			this.drawCellAtPos(world, display, playerPos, cellPos, true);
		}
	};

	Map.prototype.drawCellAtPos = function(world, display, playerPos, cellPos, drawMovers)
	{
		var map = this;

		var cell = map.cellAtPos(cellPos);
		var cellTerrain = cell.terrain;
		var terrainImage = cellTerrain.image;
		var drawPos = this.drawable.loc.pos;

		drawPos.overwriteWith
		(
			cellPos
		).subtract
		(
			playerPos
		).multiply
		(
			map.cellSizeInPixels
		).add
		(
			display.displayToUse().sizeInPixels.clone().half()
		);

		display.drawImage(terrainImage, drawPos);

		var entitiesInCell = cell.entitiesPresent;
		var entitiesSortedBottomToTop = this.entitiesSortedBottomToTop;
		entitiesSortedBottomToTop.length = 0;

		for (var i = 0; i < entitiesInCell.length; i++)
		{
			var entityToSort = entitiesInCell[i];
			var entityToSortZIndex = entityToSort.defn(world).Drawable.zIndex;
			var j;
			for (j = 0; j < entitiesSortedBottomToTop.length; j++)
			{
				var entitySorted = entitiesSortedBottomToTop[j];
				var entitySortedZIndex = entitySorted.defn(world).Drawable.zIndex;
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
					display,
					this.drawable
				);
			}

		} // end for entitiesSortedBottomToTop

	};

	Map.prototype.drawEntities = function(display, entities)
	{
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			this.drawEntityForMap(entity, map);
		}
	};

	Map.prototype.drawEntity = function(display, entity)
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
			display,
			this.drawable
		);
	};
}
