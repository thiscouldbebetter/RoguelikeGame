
class PlaceDefnLevel extends PlaceDefn
{
	terrains: MapTerrain[];
	placeGenerate:
	(
		worldDefn: WorldDefn2,
		branch: PlaceBranch,
		placeDefn: PlaceDefnLevel,
		placeIndex: number,
		depth: number,
		randomizer: Randomizer
	) => PlaceLevel;

	terrainsByCode: Map<string, MapTerrain>;
	terrainsByName: Map<string, MapTerrain>;

	constructor
	(
		name: string,
		propertyNamesToProcess: string[],
		terrains: MapTerrain[],
		placeGenerate:
		(
			worldDefn: WorldDefn2,
			branch: PlaceBranch,
			placeDefn: PlaceDefnLevel,
			placeIndex: number,
			depth: number,
			randomizer: Randomizer
		) => PlaceLevel
	)
	{
		super(name, null, null, propertyNamesToProcess, null, null);

		this.terrains = terrains;
		this.placeGenerate = placeGenerate;

		this.terrainsByCode = ArrayHelper.addLookups
		(
			this.terrains, (element: MapTerrain) => element.codeChar
		);
		this.terrainsByName = ArrayHelper.addLookupsByName(this.terrains);
	}
}
