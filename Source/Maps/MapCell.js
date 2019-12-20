
function MapCell(terrainCode, entitiesPresent)
{
	this.terrainCode = terrainCode;
	this.entitiesPresent = entitiesPresent || [];
}
{
	MapCell.prototype.terrain = function(map)
	{
		return map.terrains[this.terrainCode];
	};
}
