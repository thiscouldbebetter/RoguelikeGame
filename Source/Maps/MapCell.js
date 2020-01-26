
function MapCell(terrainCode, entitiesPresent)
{
	this.terrainCode = terrainCode;
	this.entitiesPresent = entitiesPresent || [];
}
{
	MapCell.prototype.blocksVision = function(map)
	{
		var returnValue = this.terrain(map).blocksVision;

		if (returnValue == false)
		{
			for (var i = 0; i < this.entitiesPresent.length; i++)
			{
				var entityPresent = this.entitiesPresent[i];
				if (entityPresent.CollidableDefn.blocksVision(entityPresent))
				{
					returnValue = true;
					break;
				}
			}
		}

		return returnValue;
	};

	MapCell.prototype.costToTraverse = function(map)
	{
		var returnValue = this.terrain(map).costToTraverse;
		for (var i = 0; i < this.entitiesPresent.length; i++)
		{
			var entityPresent = this.entitiesPresent[i];
			if (entityPresent.CollidableDefn.blocksMovement(entityPresent))
			{
				returnValue = MapTerrain.AlmostInfinity;
				break;
			}
		}
		return returnValue;
	};

	MapCell.prototype.terrain = function(map)
	{
		return map.terrains[this.terrainCode];
	};
}
