
function Map(name, terrains, cellSizeInPixels, cellsAsStrings)
{
	this.name = name;
	this.terrains = terrains.addLookups(x => x.codeChar);
	this.cellSizeInPixels = cellSizeInPixels;

	this.sizeInCells = new Coords
	(
		cellsAsStrings[0].length, cellsAsStrings.length, Number.POSITIVE_INFINITY // 1
	);

	this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
	(
		Coords.Instances().Ones
	);

	this.sizeInPixels = this.sizeInCells.clone().multiply(this.cellSizeInPixels);

	this.cells = [];

	var cellPos = new Coords(0, 0, 0);
	for (var y = 0; y < this.sizeInCells.y; y++)
	{
		cellPos.y = y;
		for (var x = 0; x < this.sizeInCells.x; x++)
		{
			cellPos.x = x;

			var cellAsChar = cellsAsStrings[cellPos.y][cellPos.x];

			var cell = new MapCell(cellAsChar);
			this.cells.push(cell);
		}
	}

	// Helper variables.
	this._boundsVisible = new Box();//.fromMinAndSize(new Coords(0, 0), this.sizeInCells.clone());
	this._cellPos = new Coords();
	this._drawPos = new Coords();
	this._drawPosSaved = new Coords();
	this._drawLoc = new Location( this._drawPos );
	this._drawableEntity = new Entity( "_drawableEntity", [ new Locatable(this._drawLoc) ] );
	this._entitiesSortedBottomToTop = [];
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

	// Instance methods.

	Map.prototype.cellAtPos = function(cellPos)
	{
		var returnValue;

		if (cellPos.isInRangeMax(this.sizeInCellsMinusOnes))
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
	};

	Map.prototype.indexOfCellAtPos = function(cellPos)
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x
	};

	// Clonable.

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

	// Debugging.

	Map.prototype.cellsAsString = function()
	{
		return this.cellsAsStrings().join("\n");
	};

	Map.prototype.cellsAsStrings = function()
	{
		var rowsAsStrings = [];

		var cellPos = this._cellPos;
		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			var rowAsString = "";
			cellPos.y = y;
			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;
				var cellAtPos = this.cellAtPos(cellPos);
				var cellTerrain = cellAtPos.terrain(this);
				rowAsString += cellTerrain.codeChar;
			}
			rowsAsStrings.push(rowAsString);
		}

		return rowsAsStrings;
	};

	// drawable

	Map.prototype.draw = function(universe, world, display)
	{
		var player = world.entityForPlayer;
		var playerPos = player.locatable.loc.pos;

		var cellPos = this._cellPos;
		var shouldDrawMovers = false;

		var boundsVisible = this._boundsVisible;
		boundsVisible.center.overwriteWith(playerPos);
		boundsVisible.sizeOverwriteWith
		(
			boundsVisible.size.overwriteWith(Coords.Instances().Ones).multiplyScalar(38)
		);
		var cellPosVisibleMin = boundsVisible.min().trimToRangeMax(this.sizeInCells);
		var cellPosVisibleMax = boundsVisible.max().trimToRangeMax(this.sizeInCells);

		for (var y = cellPosVisibleMin.y; y < cellPosVisibleMax.y; y++)
		{
			cellPos.y = y;

			for (var x = cellPosVisibleMin.x; x < cellPosVisibleMax.x; x++)
			{
				cellPos.x = x;

				this.drawCellAtPos
				(
					universe,
					world,
					display,
					playerPos,
					cellPos,
					shouldDrawMovers
				);

			} // end for x

		} // end for y

		var sightHelper = world.sightHelper;
		var numberOfCellsVisible = sightHelper.numberOfCellsVisible;
		var cellPositionsVisible = sightHelper._cellPositionsVisible;
		shouldDrawMovers = true;
		for (var i = 0; i < numberOfCellsVisible; i++)
		{
			var cellPos = cellPositionsVisible[i];
			this.drawCellAtPos(universe, world, display, playerPos, cellPos, shouldDrawMovers);
		}

		display.flush();
	};

	Map.prototype.drawCellAtPos = function(universe, world, display, playerPos, cellPos, drawMovers)
	{
		var map = this;

		var cell = map.cellAtPos(cellPos);
		var cellTerrain = cell.terrain(this);
		var terrainVisual = cellTerrain.visual;
		var drawableEntity = this._drawableEntity;
		var drawPos = this._drawPos;

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
			display.displayToUse().sizeInPixelsHalf
		);

		terrainVisual.draw(universe, world, display, drawableEntity);

		var entitiesInCell = cell.entitiesPresent;

		var entitiesSortedBottomToTop = entitiesInCell.sort
		(
			(a, b) => a.locatable.loc.pos.z - b.locatable.loc.pos.z
		);

		for (var i = 0; i < entitiesSortedBottomToTop.length; i++)
		{
			var entity = entitiesSortedBottomToTop[i];
			if (entity.mover == null || drawMovers)
			{
				var drawable = entity.drawable;
				if (drawable.isVisible)
				{
					var entityLoc = entity.locatable.loc;
					var entityPos = entityLoc.pos;

					this._drawPosSaved.overwriteWith(entityPos);

					entityPos.overwriteWith(drawPos);

					var visual = drawable.visual;
					visual.draw(universe, world, display, entity);

					entityPos.overwriteWith(this._drawPosSaved);
				}
			}

		} // end for entitiesSortedBottomToTop
	};

	Map.prototype.drawEntities = function(display, entities)
	{
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			this._drawEntityForMap(entity, map);
		}
	};

	Map.prototype.drawEntity = function(display, entity)
	{
		var drawable = entity.drawable;
		if (drawable.isVisible)
		{
			var visual = drawable.visual;

			this._drawableEntity.locatable.loc.pos.overwriteWith
			(
				entity.locatable.loc.pos
			).multiply
			(
				map.cellSizeInPixels
			);

			visual.draw
			(
				null, null, // universe, world
				display,
				this._drawableEntity
			);
		}
	};
}
