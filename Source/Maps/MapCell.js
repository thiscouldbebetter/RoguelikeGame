
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
				if (entityPresent.mappableDefn().blocksVision(entityPresent))
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
			if (entityPresent.mappableDefn().blocksMovement(entityPresent))
			{
				returnValue = MapTerrain.AlmostInfinity;
				break;
			}
		}
		return returnValue;
	};

	MapCell.prototype.overwriteWith = function(other)
	{
		this.terrainCode = other.terrainCode;
		this.entitiesPresent.length = 0;
		this.entitiesPresent.push(...other.entitiesPresent);
		return this;
	};

	MapCell.prototype.terrain = function(map)
	{
		return map.terrainsByCodeChar.get(this.terrainCode);
	};
}
