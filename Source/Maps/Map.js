
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
		new Coords(1, 1, 1)
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

}
