
class MapOfTerrainCell
{
	terrainCode: string;
	entitiesPresent: Entity2[];

	constructor(terrainCode: string, entitiesPresent: Entity2[])
	{
		this.terrainCode = terrainCode;
		this.entitiesPresent = entitiesPresent || new Array<Entity2>();
	}

	blocksVision(map: MapOfTerrain)
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
	}

	costToTraverse(map: MapOfTerrain)
	{
		var returnValue = this.terrain(map).costToTraverse;
		for (var i = 0; i < this.entitiesPresent.length; i++)
		{
			var entityPresent = this.entitiesPresent[i] as Entity2;
			if (entityPresent.mappableDefn().blocksMovement(entityPresent))
			{
				returnValue = MapTerrain.AlmostInfinity;
				break;
			}
		}
		return returnValue;
	}

	overwriteWith(other: MapOfTerrainCell)
	{
		this.terrainCode = other.terrainCode;
		this.entitiesPresent.length = 0;
		this.entitiesPresent.push(...other.entitiesPresent);
		return this;
	}

	terrain(map: MapOfTerrain)
	{
		return map.terrainsByCode.get(this.terrainCode);
	}
}
