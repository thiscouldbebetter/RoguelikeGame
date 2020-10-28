
class PlaceDefn2
{
	name: string;
	propertyNamesToProcess: string[];
	terrains: MapTerrain[];
	placeGenerate: any;

	terrainsByCode: Map<string, MapTerrain>;
	terrainsByName: Map<string, MapTerrain>;

	constructor
	(
		name: string, propertyNamesToProcess: string[],
		terrains: MapTerrain[], placeGenerate: any
	)
	{
		this.name = name;
		this.propertyNamesToProcess = propertyNamesToProcess;
		this.terrains = terrains;
		this.placeGenerate = placeGenerate;

		this.terrainsByCode = ArrayHelper.addLookups
		(
			this.terrains, (element: MapTerrain) => element.codeChar
		);
		this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);
	}
}
