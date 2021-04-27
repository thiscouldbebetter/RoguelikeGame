
class MapOfTerrain
{
	name: string;
	terrains: MapTerrain[];
	cellSizeInPixels: Coords;

	cells: MapOfTerrainCell[];
	sizeInCells: Coords;
	sizeInCellsMinusOnes: Coords;
	sizeInPixels: Coords;
	terrainsByCode: Map<string, MapTerrain>;

	_cellPos: Coords;
	_drawPos: Coords;
	_drawPosSaved: Coords;
	_drawLoc: Disposition;
	_drawableEntity: Entity;
	_entitiesSortedBottomToTop: Entity[];

	constructor
	(
		name: string,
		terrains: MapTerrain[],
		cellSizeInPixels: Coords,
		cellsAsStrings: string[]
	)
	{
		this.name = name;
		this.terrains = terrains;
		this.terrainsByCode =
			ArrayHelper.addLookups(this.terrains, (x: MapTerrain) => x.codeChar);
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

		var cellPos = Coords.create();
		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;
			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellAsChar = cellsAsStrings[cellPos.y][cellPos.x];

				var cell = new MapOfTerrainCell(cellAsChar, null);
				this.cells.push(cell);
			}
		}

		// Helper variables.
		this._cellPos = Coords.create();
		this._drawPos = Coords.create();
		this._drawPosSaved = Coords.create();
		this._drawLoc = new Disposition( this._drawPos, null, null );
		this._drawableEntity = new Entity2
		(
			"_drawableEntity", [ new Locatable(this._drawLoc) ]
		);
		this._entitiesSortedBottomToTop = new Array<Entity>();
	}

	// Instance methods.

	cellAtPos(cellPos: Coords)
	{
		var returnValue;

		if (cellPos.isInRangeMax(this.sizeInCellsMinusOnes))
		{
			var cellIndex = cellPos.y * this.sizeInCells.x + cellPos.x;
			returnValue = this.cells[cellIndex];
		}

		return returnValue;
	}

	cellsAsStrings()
	{
		var cellsAsStrings = [];

		var cellPos = Coords.create();
		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;
			var cellRowAsString = "";

			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cell = this.cellAtPos(cellPos);
				var cellTerrain = cell.terrain(this);
				var terrainChar = cellTerrain.codeChar;
				cellRowAsString += terrainChar;
			}

			cellsAsStrings.push(cellRowAsString);
		}

		return cellsAsStrings;
	}

	toString()
	{
		return this.cellsAsStrings().join("\n");
	}

	// Clonable.

	clone()
	{
		var cellsAsStrings = this.cellsAsStrings();

		return new MapOfTerrain
		(
			this.name,
			this.terrains,
			this.cellSizeInPixels,
			cellsAsStrings
		);
	}

	// drawable

	draw(universe: Universe, world: World, place: Place, display: Display)
	{
		// hack - Build camera from player.
		var entityCamera = (world as World2).entityForPlayer;
		var cameraPos = entityCamera.locatable().loc.pos.clone();

		var viewDimensionHalf = 38; // hack
		var camera = new Camera
		(
			new Coords(1, 1, 0).multiplyScalar(viewDimensionHalf),
			null, // focalLength
			Disposition.fromPos(cameraPos),
			null // entitiesInViewSort
		);

		var cellPos = this._cellPos;

		var boundsVisible = camera.viewCollider;
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
					place,
					display,
					cameraPos,
					cellPos
				);

			} // end for x

		} // end for y

		display.flush();
	}

	drawCellAtPos
	(
		universe: Universe, world: World, place: Place,
		display: Display, cameraPos: Coords, cellPos: Coords)
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
			cameraPos
		).multiply
		(
			map.cellSizeInPixels
		).add
		(
			display.displayToUse().sizeInPixelsHalf
		);

		terrainVisual.draw(universe, world, place, drawableEntity, display);

		var entitiesInCell = cell.entitiesPresent;

		var entitiesSortedBottomToTop = entitiesInCell.sort
		(
			(a: Entity, b: Entity) =>
				a.locatable().loc.pos.z - b.locatable().loc.pos.z
		);

		for (var i = 0; i < entitiesSortedBottomToTop.length; i++)
		{
			var entity = entitiesSortedBottomToTop[i];
			var drawable = entity.drawable();
			if (drawable.isVisible)
			{
				var entityLoc = entity.locatable().loc;
				var entityPos = entityLoc.pos;

				this._drawPosSaved.overwriteWith(entityPos);

				entityPos.overwriteWith(drawPos);

				var visual = drawable.visual;
				visual.draw(universe, world, place, entity, display);

				entityPos.overwriteWith(this._drawPosSaved);
			}

		} // end for entitiesSortedBottomToTop
	}
}
