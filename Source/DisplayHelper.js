
function DisplayHelper()
{
		// helper variables;
		this.cellPos = new Coords();
		this.drawPos = new Coords();
		this.entitiesSortedBottomToTop = [];
}
{
	DisplayHelper.prototype.clear = function()
	{
		this.graphics.fillStyle = "Black";
		this.graphics.fillRect
		(
			0, 0,
			this.sizeInPixels.x,
			this.sizeInPixels.y
		);
	}

	DisplayHelper.prototype.drawControl = function(controlToDraw)
	{
		controlToDraw.drawToGraphics(this.graphics);	
	}
	
	DisplayHelper.prototype.drawEntitiesForMap = function(entities, map)
	{
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			this.drawEntityForMap(entity, map);
		}
	}
	
	DisplayHelper.prototype.drawEntityForMap = function(entity, map)
	{
		var visual = entity.drawableData.visual;
		var drawPos = this.drawPos.overwriteWith
		(
			entity.loc.posInCells
		).multiply
		(
			map.cellSizeInPixels
		);
		
		visual.drawToGraphicsAtPos
		(
			this.graphics,
			drawPos
		);		
	}

	DisplayHelper.prototype.drawMap = function(map)
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
	} 
	
	DisplayHelper.prototype.drawMapCellAtPos = function(map, cellPos, drawMovers)
	{
		var cell = map.cellAtPos(cellPos);
		var cellTerrain = cell.terrain;
		var terrainImage = cellTerrain.image;
		var drawPos = this.drawPos;

		drawPos.overwriteWith
		(
			cellPos
		).multiply
		(
			map.cellSizeInPixels
		);

		this.graphics.drawImage
		(
			terrainImage.systemImage,
			drawPos.x,
			drawPos.y					
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
				
		for (var i = 0; i < entitiesSortedBottomToTop.length; i++)
		{
			var entity = entitiesSortedBottomToTop[i];
			if (entity.moverData == null || drawMovers == true)
			{ 
				var visual = entity.drawableData.visual;
				visual.drawToGraphicsAtPos
				(
					this.graphics,
					drawPos
				);
			}
					
		} // end for entitiesSortedBottomToTop
		
	} 

	DisplayHelper.prototype.drawVenue = function(venue)
	{
		var turnsSoFar = Globals.Instance.universe.turnsSoFar;
		if (venue.turnLastDrawn != turnsSoFar)
		{
			venue.turnLastDrawn = turnsSoFar;
			var map = venue.map;
			this.drawMap(map);
		}
	}

	DisplayHelper.prototype.initialize = function(sizeInPixels)
	{
		this.sizeInPixels = sizeInPixels;

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.sizeInPixels.x;
		this.canvas.height = this.sizeInPixels.y;
		this.graphics = this.canvas.getContext("2d");

		document.body.appendChild(this.canvas);
	}
}
