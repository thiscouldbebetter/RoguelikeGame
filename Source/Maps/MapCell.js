
function MapCell(terrainCode, entitiesPresent)
{
	this.terrainCode = terrainCode;
	this.entitiesPresent = entitiesPresent || [];
}
{
	MapCell.prototype.costToTraverse = function(map)
	{
		var returnValue = this.terrain(map).costToTraverse;
		for (var i = 0; i < this.entitiesPresent.length; i++)
		{
			var entityPresent = this.entitiesPresent[i];
			if (entityPresent.CollidableDefn.blocksMovement)
			{
				returnValue = 10000; // Infinity seems to slow down the math.
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
