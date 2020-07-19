
function PlaceDefn(name, propertyNamesKnown, terrains, placeGenerate)
{
	this.name = name;
	this.propertyNamesKnown = propertyNamesKnown;
	this.terrains = terrains;
	this.terrainsByName = ArrayHelper.addLookupsByName(terrains);
	this.placeGenerate = placeGenerate;
}
