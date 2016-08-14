
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
			this.viewSizeInPixels.x,
			this.viewSizeInPixels.y
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
		var cellPos = new Coords(0, 0);
		var drawPos = new Coords(0, 0);
		for (var y = 0; y < map.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < map.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cell = map.cellAtPos(cellPos);
				var cellTerrain = cell.terrain;
				var terrainImage = cellTerrain.image;

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
					var visual = entity.drawableData.visual;
					visual.drawToGraphicsAtPos
					(
						this.graphics,
						drawPos
					);		
				}
			}
		}
	}

	DisplayHelper.prototype.drawVenue = function(venue)
	{
		var map = venue.map;
		this.drawMap(map);
	}

	DisplayHelper.prototype.initialize = function(viewSizeInPixels)
	{
		this.viewSizeInPixels = viewSizeInPixels;

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.viewSizeInPixels.x;
		this.canvas.height = this.viewSizeInPixels.y;
		this.graphics = this.canvas.getContext("2d");

		document.body.appendChild(this.canvas);
	}
}
