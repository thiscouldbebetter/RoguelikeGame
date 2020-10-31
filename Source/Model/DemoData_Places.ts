
class DemoData_Places
{
	parent: DemoData_Main;
	randomizer: Randomizer;

	Floor: MapTerrain;
	Stone: MapTerrain;
	WallCornerNorth: MapTerrain;
	WallCornerSouth: MapTerrain;
	WallEastWest: MapTerrain;
	WallNorthSouth: MapTerrain;

	constructor(parent: DemoData_Main)
	{
		this.parent = parent;

		this.randomizer = this.parent.randomizer;
	}

	buildMapTerrainsDungeon(visualsForTiles: Map<string, Visual>)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 	false, "Green", visualsForTiles.get("Floor"));
		this.Stone 				= new MapTerrain("Stone", 			"x", null, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", null, 	true, "Blue", visualsForTiles.get("WallDungeonCornerNorth") );
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", null, 	true, "Blue", visualsForTiles.get("WallDungeonCornerSouth") );
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", null, 	true, "Blue", visualsForTiles.get("WallDungeonEastWest") );
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", null, 	true, "Blue", visualsForTiles.get("WallDungeonNorthSouth") );

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		return terrains;
	}

	buildMapTerrainsHades(visualsForTiles: Map<string,Visual>)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 	false, "Green", visualsForTiles.get("Floor"));
		this.Stone 				= new MapTerrain("Stone", 			"x", null, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", null, 	true, "Blue", visualsForTiles.get("WallHadesCornerNorth"));
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", null, 	true, "Blue", visualsForTiles.get("WallHadesCornerSouth"));
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", null, 	true, "Blue", visualsForTiles.get("WallHadesEastWest"));
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", null, 	true, "Blue", visualsForTiles.get("WallHadesNorthSouth"));

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		return terrains;
	}

	buildMapTerrainsMines(visualsForTiles: Map<string, Visual>)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 		false, "Green", visualsForTiles.get("Floor") );
		this.Stone 				= new MapTerrain("Stone", 			"x", 1000000, 	true, "Black", new VisualNone());//visualsForTiles["Stone") );
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", 1000000, 	true, "Blue", visualsForTiles.get("WallCaveCornerNorth") );
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", 1000000, 	true, "Blue", visualsForTiles.get("WallCaveCornerSouth") );
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", 1000000, 	true, "Blue", visualsForTiles.get("WallCaveEastWest") );
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", 1000000, 	true, "Blue", visualsForTiles.get("WallCaveNorthSouth") );

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		return terrains;
	}

	buildMapTerrainsLabyrinth(visualsForTiles: Map<string, Visual>)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	buildMapTerrainsPuzzle(visualsForTiles: Map<string, Visual>)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	buildMapTerrainsThrowback(visualsForTiles: Map<string, Visual>)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	buildPlaceDefns(visuals: Map<string, Visual>, actions: Action[])
	{
		var mapTerrainsDungeon = this.buildMapTerrainsDungeon(visuals);

		var mapTerrainsHades = this.buildMapTerrainsHades(visuals);

		var mapTerrainsMines = this.buildMapTerrainsMines(visuals);

		// hack - Build this on the fly?
		var propertyNamesKnown =
		[
			ActorData.name,
			ActorDefn.name,
			Awaitable.name,
			MappableDefn.name,
			Mappable.name,
			Device.name,
			//Drawable.name,
			Emplacement.name,
			"Enemy",
			Ephemeral.name,
			Item.name,
			ItemHolder.name,
			Killable.name,
			Mover.name,
			MoverTransport.name,
			Player.name,
			Portal2.name,
			Turnable.name
		];

		var returnValues =
		[
			new PlaceDefn2
			(
				"Depths",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateDepths
			),

			new PlaceDefn2
			(
				"Dungeon",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateDungeon
			),

			new PlaceDefn2
			(
				"Fortress",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateFortress
			),

			new PlaceDefn2
			(
				"Hades",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateHades
			),

			new PlaceDefn2
			(
				"Mines",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn2
			(
				"MinesTown",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn2
			(
				"MinesBottom",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn2
			(
				"Island",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateIsland
			),

			new PlaceDefn2
			(
				"Labyrinth",
				propertyNamesKnown,
				this.buildMapTerrainsLabyrinth(visuals),
				this.placeGenerateLabyrinth
			),

			new PlaceDefn2
			(
				"Limbo",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateLimbo
			),

			new PlaceDefn2
			(
				"Oracle",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateOracle
			),

			new PlaceDefn2
			(
				"Puzzle",
				propertyNamesKnown,
				this.buildMapTerrainsPuzzle(visuals),
				this.placeGeneratePuzzle
			),

			new PlaceDefn2
			(
				"SingleChamber",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateSingleChamber
			),

			new PlaceDefn2
			(
				"Surface",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateSurface
			),

			new PlaceDefn2
			(
				"Throwback",
				propertyNamesKnown,
				this.buildMapTerrainsThrowback(visuals),
				this.placeGenerateThrowback
			)
		];

		return returnValues;
	}

	buildPlaceTree()
	{
		var branchesMain =
		[
			new PlaceBranch
			(
				"Surface", // name
				"Surface", // displayName
				"Surface", // placeDefnName
				null, // startOffsetRange
				new RangeExtent(1, 1), // depth
				[]
			),
			new PlaceBranch
			(
				"DungeonShallow", // name
				"Dungeon", // displayName
				"Dungeon", // placeDefnName
				null, // startOffsetRange
				new RangeExtent(5, 6), // depthRangeInVenues
				// children
				[
					new PlaceBranch
					(
						"MinesShallow", // name
						"Mines", // displayName
						"Mines", // placeDefnName
						new RangeExtent(1, 4), // startOffset
						new RangeExtent(2, 4),
						[]
					),
					new PlaceBranch
					(
						"MinesTown",
						"Mines", // displayName
						"MinesTown",
						null, // startOffsetRange
						new RangeExtent(1, 1),
						[]
					),
					new PlaceBranch
					(
						"MinesDeep",
						"Mines", // displayName
						"Mines",
						null, // startOffsetRange
						new RangeExtent(2, 4),
						[]
					),
					new PlaceBranch
					(
						"MinesBottom",
						"Mines", // displayName
						"MinesBottom",
						null, // startOffsetRange
						new RangeExtent(1, 1),
						[]
					),
				]
			),
			new PlaceBranch
			(
				"Oracle",
				"Dungeon", // displayName
				"Oracle",
				null, // startOffsetRange
				new RangeExtent(1, 1),
				[]
			),
			new PlaceBranch
			(
				"DungeonDeep",
				"Dungeon", // displayName
				"Dungeon",
				null, // startOffsetRange
				new RangeExtent(5, 6),
				[
					new PlaceBranch
					(
						"Puzzle",
						"Puzzle", // displayName
						"Puzzle",
						new RangeExtent(1, 4), // startOffset
						new RangeExtent(2, 4),
						[]
					),
				]
			),
			new PlaceBranch
			(
				"Labyrinth",
				"Dungeon", // displayName
				"Labyrinth",
				null, // startOffsetRange
				new RangeExtent(3, 5),
				[]
			),
			new PlaceBranch
			(
				"Island",
				"Dungeon", // displayName
				"Island",
				null, // startOffsetRange
				new RangeExtent(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Fortress",
				"Dungeon", // displayName
				"Fortress",
				null, // startOffsetRange
				new RangeExtent(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Limbo",
				"Hades", // displayName
				"Limbo",
				null, // startOffsetRange
				new RangeExtent(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Hades",
				"Hades", // displayName
				"Hades",
				null, // startOffsetRange
				new RangeExtent(10, 20),
				[]
			),
			new PlaceBranch
			(
				"Depths",
				"Hades", // displayName
				"Depths",
				null, // startOffsetRange
				new RangeExtent(1, 1),
				[]
			),
		];

		var placeTreeRoot = new PlaceBranch
		(
			"Root",
			null, // displayName
			"Dungeon", // hack
			null, // startOffsetRange
			new RangeExtent(0, 0),
			branchesMain
		);

		return placeTreeRoot;
	}

	placeGenerateDepths
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		//var branchName = branch.name;
		var place = this.placeGenerateDungeon
		(
			worldDefn, branch, placeDefn, placeIndex, depth, randomizer
		);
		var placeEntities = place.entitiesToSpawn;
		var stairDown = placeEntities.filter
		(
			(x: any) => x.name == "StairsDownToChildBranch"
		)[0];

		var itemDefnsByName = worldDefn.entityDefnsByName();
		var itemDefnGoalName = "Amulet of Yendor";
		var itemDefnGoal = itemDefnsByName.get(itemDefnGoalName);
		var entityGoal = Entity2.fromNameDefnAndProperties
		(
			itemDefnGoal.name,
			itemDefnGoal,
			[
				new Locatable(stairDown.locatable().loc.clone()),
				new Item(itemDefnGoal.name, 1)
			]
		);
		placeEntities.push(entityGoal);

		return place;
	}

	placeGenerateDungeon
	(
		worldDefn: WorldDefn2, branch: any, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		var branchName = branch.name;
		var venueName = branchName + placeIndex;

		var mapSizeInCells = new Coords(64, 64, 0);
		var numberOfZones = 12;
		var terrains = placeDefn.terrains;
		var terrainsByName = placeDefn.terrainsByName;

		var mapCellsAsStrings = this.placeGenerateDungeon_1_InitMap
		(
			worldDefn, terrainsByName, mapSizeInCells
		);
		var zoneBoundsSet = this.placeGenerateDungeon_2_ZoneBounds
		(
			terrains, randomizer, mapSizeInCells, numberOfZones
		);
		var zones = this.placeGenerateDungeon_3_Zones
		(
			numberOfZones, zoneBoundsSet, mapCellsAsStrings, terrainsByName
		);
		var doorwayPositions = this.placeGenerateDungeon_4_Doors
		(
			zones, terrainsByName, randomizer, mapCellsAsStrings
		);
		var entities = this.placeGenerateDungeon_5_Entities
		(
			worldDefn, branchName, placeDefn, venueName, randomizer,
			zones, doorwayPositions, mapCellsAsStrings
		);

		var map = new MapOfTerrain
		(
			venueName + "Map",
			terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var displayName = branch.displayName;

		var returnValue = new PlaceLevel
		(
			venueName,
			displayName,
			depth,
			placeDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			zones,
			entities
		);

		return returnValue;
	}

	placeGenerateDungeon_1_InitMap
	(
		worldDefn: WorldDefn2, terrainsByName: Map<string, MapTerrain>, mapSizeInCells: Coords
	)
	{
		var mapCellsAsStrings = new Array<string>();

		var terrainCodeChar = terrainsByName.get("Stone").codeChar;

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			var mapCellRowAsString = "";

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				mapCellRowAsString += terrainCodeChar;
			}

			mapCellsAsStrings.push(mapCellRowAsString);
		}

		return mapCellsAsStrings;
	}

	placeGenerateDungeon_2_ZoneBounds
	(
		terrains: MapTerrain[], randomizer: Randomizer,
		mapSizeInCells: Coords, numberOfZones: number
	)
	{
		var zoneSizeMin = new Coords(4, 4, 1);
		var zoneSizeMax = new Coords(13, 13, 1);
		var zoneSizeRange = zoneSizeMax.clone().subtract(zoneSizeMin);

		//var terrainCodeChar = terrains.get("Floor").codeChar;

		var zoneBoundsSetSoFar = [];

		var ones = Coords.Instances().Ones;
		var twoTwoZero = Coords.Instances().TwoTwoZero;

		while (zoneBoundsSetSoFar.length < numberOfZones)
		{
			var doesZoneOverlapAnother = true;

			while (doesZoneOverlapAnother)
			{
				var zoneSize = new Coords(0, 0, 0).randomize(randomizer).multiply
				(
					zoneSizeRange
				).add
				(
					zoneSizeMin
				).floor();

				var zoneSizePlusOnes = zoneSize.clone().add
				(
					ones
				);

				var zonePosRange = mapSizeInCells.clone().subtract
				(
					zoneSize
				).subtract
				(
					twoTwoZero
				);

				var zonePos = new Coords(0, 0, 0).randomize(randomizer).multiply
				(
					zonePosRange
				).add
				(
					ones
				).floor();

				var zoneBoundsWithWalls =
					Box.fromMinAndSize(zonePos, zoneSizePlusOnes);

				doesZoneOverlapAnother = Box.doBoxesInSetsOverlap
				(
					[ zoneBoundsWithWalls ],
					zoneBoundsSetSoFar
				);
			}

			var zoneBounds = Box.fromMinAndSize(zonePos, zoneSize);

			zoneBoundsSetSoFar.push(zoneBounds);
		}

		return zoneBoundsSetSoFar;
	}

	placeGenerateDungeon_3_Zones
	(
		numberOfZones: number, zoneBoundsSetSoFar: Box[],
		mapCellsAsStrings: string[], terrainsByName: Map<string, MapTerrain>
	)
	{
		var zones = [];
		var terrainCodeChar = "";

		for (var r = 0; r < numberOfZones; r++)
		{
			var zoneBounds = zoneBoundsSetSoFar[r];
			var zone = new Zone2(zoneBounds);
			zones.push(zone);
		}

		for (var r = 0; r < numberOfZones; r++)
		{
			var zone = zones[r];
			var zoneBounds = zone.bounds;
			var zonePos = zoneBounds.min();
			var zoneMax = zoneBounds.max();

			for (var y = zonePos.y; y < zoneMax.y; y++)
			{
				var mapCellRowAsString = mapCellsAsStrings[y];

				for (var x = zonePos.x; x < zoneMax.x; x++)
				{
					if (x == zonePos.x || x == zoneMax.x - 1)
					{
						if (y == zonePos.y)
						{
							terrainCodeChar = terrainsByName.get("WallCornerNorth").codeChar;
						}
						else if (y == zoneMax.y - 1)
						{
							terrainCodeChar = terrainsByName.get("WallCornerSouth").codeChar;
						}
						else
						{
							terrainCodeChar = terrainsByName.get("WallNorthSouth").codeChar;
						}
					}
					else if (y == zonePos.y || y == zoneMax.y - 1)
					{
						terrainCodeChar = terrainsByName.get("WallEastWest").codeChar;
					}
					else
					{
						terrainCodeChar = terrainsByName.get("Floor").codeChar;
					}

					mapCellRowAsString =
						mapCellRowAsString.substring(0, x)
						+ terrainCodeChar
						+ mapCellRowAsString.substring(x + 1);
				}

				mapCellsAsStrings[y] = mapCellRowAsString;
			}
		}

		return zones;
	}

	placeGenerateDungeon_4_Doors
	(
		zones: Zone2[], terrainsByName: Map<string, MapTerrain>, randomizer: Randomizer,
		mapCellsAsStrings: string[]
	)
	{
		var zonesConnected = [ zones[0] ];
		var zonesToConnect = [];

		for (var r = 1; r < zones.length; r++)
		{
			zonesToConnect.push(zones[r]);
		}

		var doorwayPositions = new Array<Coords>();

		while (zonesToConnect.length > 0)
		{
			this.placeGenerateDungeon_4_Doors_Zone
			(
				zones, terrainsByName, randomizer, mapCellsAsStrings,
				zonesConnected, zonesToConnect, doorwayPositions
			);
		} // end while zonesToConnect

		return doorwayPositions;
	}

	placeGenerateDungeon_4_Doors_Zone
	(
		zones: Zone2[], terrainsByName: Map<string, MapTerrain>,
		randomizer: Randomizer, mapCellsAsStrings: string[],
		zonesConnected: Zone2[], zonesToConnect: Zone2[],
		doorwayPositions: Coords[]
	)
	{
		// Helper variables.
		// todo - Move these elsewhere.
		var coordses = Coords.Instances();
		var oneOne = coordses.OneOneZero;
		var twoTwo = coordses.TwoTwoZero;
		var directionToZoneToConnect = new Coords(0, 0, 0);
		var fromPos = new Coords(0, 0, 0);
		var toPos = new Coords(0, 0, 0);
		var coordsRandom = new Coords(0, 0, 0);
		var zoneConnectedSizeMinusTwos = new Coords(0, 0, 0);
		var zoneToConnectSizeMinusTwos = new Coords(0, 0, 0);

		var terrainFloorCodeChar = terrainsByName.get("Floor").codeChar;

		var nearestZonesSoFar = this.placeGenerateDungeon_4_Doors_Zone_NearestZones
		(
			zonesToConnect, zonesConnected
		);

		var zoneConnected = nearestZonesSoFar[0];
		var zoneToConnect = nearestZonesSoFar[1];

		var zoneConnectedBounds = zoneConnected.bounds;
		var zoneToConnectBounds = zoneToConnect.bounds;

		var zoneConnectedMax = zoneConnectedBounds.max();
		var zoneConnectedMin = zoneConnectedBounds.min();
		var zoneConnectedSize = zoneConnectedBounds.size;
		zoneConnectedSizeMinusTwos.overwriteWith
		(
			zoneConnectedSize
		).subtract(twoTwo);

		var zoneToConnectMax = zoneToConnectBounds.max();
		var zoneToConnectMin = zoneToConnectBounds.min();
		var zoneToConnectSize = zoneToConnectBounds.size;
		zoneToConnectSizeMinusTwos.overwriteWith
		(
			zoneToConnectSize
		).subtract(twoTwo);

		fromPos.overwriteWith(zoneConnectedMin).add
		(
			coordsRandom.randomize(randomizer).multiply
			(
				zoneConnectedSizeMinusTwos
			).floor()
		).add
		(
			oneOne
		);

		toPos.overwriteWith(zoneToConnectMin).add
		(
			coordsRandom.randomize(randomizer).multiply
			(
				zoneToConnectSizeMinusTwos
			).floor()
		).add
		(
			oneOne
		);

		directionToZoneToConnect.overwriteWith
		(
			toPos
		).subtract
		(
			fromPos
		);

		var dimensionIndexToClear =
			CoordsHelper.dimensionIndexOfSmallest(directionToZoneToConnect, 0);

		if (zoneConnectedBounds.overlapsWithOtherInDimension(zoneToConnectBounds, 0))
		{
			dimensionIndexToClear = 0;
		}
		else if (zoneConnectedBounds.overlapsWithOtherInDimension(zoneToConnectBounds, 1))
		{
			dimensionIndexToClear = 1;
		}

		directionToZoneToConnect.dimensionSet(dimensionIndexToClear, 0);
		directionToZoneToConnect.directions();

		if (directionToZoneToConnect.x > 0)
		{
			fromPos.x = zoneConnectedMax.x;
			toPos.x = zoneToConnectMin.x - 1;
		}
		else if (directionToZoneToConnect.x < 0)
		{
			fromPos.x = zoneConnectedMin.x - 1;
			toPos.x = zoneToConnectMax.x;
		}
		else if (directionToZoneToConnect.y > 0)
		{
			fromPos.y = zoneConnectedMax.y;
			toPos.y = zoneToConnectMin.y - 1;
		}
		else if (directionToZoneToConnect.y < 0)
		{
			fromPos.y = zoneConnectedMin.y - 1;
			toPos.y = zoneToConnectMax.y;
		}

		fromPos.floor();
		toPos.floor();

		var doorwayPosFrom = fromPos.clone().subtract(directionToZoneToConnect);
		var doorwayPosTo = toPos.clone().add(directionToZoneToConnect);
		doorwayPositions.push(doorwayPosFrom);
		doorwayPositions.push(doorwayPosTo);

		this.placeGenerateDungeon_4_Doors_Zone_Corridor
		(
			mapCellsAsStrings, terrainFloorCodeChar, fromPos, toPos
		);

		ArrayHelper.remove(zonesToConnect, zoneToConnect);
		zonesConnected.push(zoneToConnect);
	}

	placeGenerateDungeon_4_Doors_Zone_NearestZones
	(
		zonesToConnect: Zone2[], zonesConnected: Zone2[]
	)
	{
		var nearestZonesSoFar = null;
		var distanceBetweenNearestZonesSoFar = null;

		for (var r = 0; r < zonesConnected.length; r++)
		{
			var zoneConnected = zonesConnected[r];
			var zoneConnectedCenter = zoneConnected.bounds.center;

			for (var s = 0; s < zonesToConnect.length; s++)
			{
				var zoneToConnect = zonesToConnect[s];
				var zoneToConnectCenter = zoneToConnect.bounds.center;

				var distance = zoneToConnectCenter.clone().subtract
				(
					zoneConnectedCenter
				).absolute().clearZ().sumOfDimensions();

				if
				(
					nearestZonesSoFar == null
					|| distance < distanceBetweenNearestZonesSoFar
				)
				{
					nearestZonesSoFar =
					[
						zoneConnected, zoneToConnect,
					];

					distanceBetweenNearestZonesSoFar = distance;
				}
			}
		}

		return nearestZonesSoFar;
	}

	placeGenerateDungeon_4_Doors_Zone_Corridor
	(
		mapCellsAsStrings: string[], terrainFloorCodeChar: string,
		fromPos: Coords, toPos: Coords
	)
	{
		var zeroes = Coords.Instances().Zeroes;

		var cellPos = fromPos.clone();

		var displacementToZoneToConnect = toPos.clone().subtract(fromPos);
		var directionToZoneToConnect = new Coords(0, 0, 0);

		while (displacementToZoneToConnect.equals(zeroes) == false)
		{
			var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

			var terrainExistingCodeChar = mapCellRowAsString[cellPos.x];

			if (terrainExistingCodeChar != terrainFloorCodeChar)
			{
				mapCellRowAsString =
					mapCellRowAsString.substring(0, cellPos.x)
					+ terrainFloorCodeChar
					+ mapCellRowAsString.substring(cellPos.x + 1);

				mapCellsAsStrings[cellPos.y] = mapCellRowAsString;
			}

			displacementToZoneToConnect.overwriteWith
			(
				toPos
			).subtract
			(
				cellPos
			);

			directionToZoneToConnect.overwriteWith
			(
				displacementToZoneToConnect
			).dimensionSet
			(
				CoordsHelper.dimensionIndexOfSmallest(directionToZoneToConnect, 0),
				0 // valueToSet
			)
			directionToZoneToConnect.directions();

			cellPos.add(directionToZoneToConnect);
		}
	}

	placeGenerateDungeon_5_Entities
	(
		worldDefn: WorldDefn2, branchName: string, placeDefn: PlaceDefn2,
		venueName: string, randomizer: Randomizer, zones: Zone2[],
		doorwayPositions: Coords[], mapCellsAsStrings: string[]
	)
	{
		var entityDefnsByName = worldDefn.entityDefnsByName();
		var entityDefnGroupsByName = worldDefn.entityDefnGroupsByName;

		var entities = new Array<Entity>();

		this.placeGenerateDungeon_5_Entities_1_Stairs
		(
			entityDefnsByName, zones, entities
		);
		this.placeGenerateDungeon_5_Entities_2_Doors
		(
			entityDefnsByName, entities, doorwayPositions,
			mapCellsAsStrings, randomizer
		);
		this.placeGenerateDungeon_5_Entities_3_Emplacements
		(
			entityDefnGroupsByName, zones, entities, randomizer
		);
		this.placeGenerateDungeon_5_Entities_4_Items
		(
			entityDefnGroupsByName, zones, entities, randomizer
		);
		this.placeGenerateDungeon_5_Entities_5_Movers
		(
			zones, entities
		);

		return entities;
	}

	placeGenerateDungeon_5_Entities_1_Stairs
	(
		entityDefnsByName: Map<string, Entity>, zones: Zone2[], entities: Entity[]
	)
	{
		var zone0Center = zones[0].bounds.center.clone().floor();

		var stairsUp = Entity2.fromNameDefnAndProperties
		(
			"StairsUp",
			entityDefnsByName.get("StairsUp") as Entity2,
			[
				new Locatable(new Disposition(zone0Center.clone(), null, null)),
				new Portal2
				(
					null, // placeName
					null, // destinationPortalName
				),
			]
		);

		entities.push(stairsUp);

		var entityDefnStairsDown = entityDefnsByName.get("StairsDown") as Entity2;

		var stairsDownCount = 4; // hack - Placeholders.
		for (var i = 0; i < stairsDownCount; i++)
		{
			var zone = zones[i + 1];
			var zoneCenter = zone.bounds.center.clone().floor();

			var stairsDown = Entity2.fromNameDefnAndProperties
			(
				(i == 0 ? "StairsDownToNextLevel" : "StairsDownToChildBranch"),
				entityDefnStairsDown,
				[
					new Locatable(new Disposition(zoneCenter.clone(), null, null)),
					new Portal2
					(
						null, // placeName
						"StairsUp"
					)
				]
			);

			entities.push(stairsDown);
		}
	}

	placeGenerateDungeon_5_Entities_2_Doors
	(
		entityDefnsByName: Map<string, Entity>,
		entities: Entity[],
		doorwayPositions: Coords[],
		mapCellsAsStrings: string[],
		randomizer: Randomizer
	)
	{
		var entityDefnDoor = entityDefnsByName.get("Door");

		var chanceOfDoorPerDoorway = .75;
		var chanceOfDoorBeingHidden = .1;
		var chanceOfDoorBeingOpen = .25;

		for (var i = 0; i < doorwayPositions.length; i++)
		{
			var doorPos = doorwayPositions[i];

			var mapRow = mapCellsAsStrings[doorPos.y];
			var terrainExistingCharCode = mapRow[doorPos.x];
			mapRow = mapRow.substr(0, doorPos.x) + "." + mapRow.substr(doorPos.x + 1);
			mapCellsAsStrings[doorPos.y] = mapRow;

			var randomNumber = randomizer.getNextRandom();
			if (randomNumber <= chanceOfDoorPerDoorway)
			{
				var isWallEastWest = (terrainExistingCharCode == "-");
				var doorForward = (isWallEastWest ? new Coords(-1, 0, 0) : new Coords(1, 0, 0));
				var doorOri = new Orientation(doorForward, null);
				var doorLoc = new Disposition(doorPos, doorOri, null);
				var entityForDoor = Entity2.fromNameDefnAndProperties
				(
					"Door" + i,
					entityDefnDoor as Entity2,
					[
						new Locatable(doorLoc)
					]
				);

				randomNumber = randomizer.getNextRandom();
				var isDoorHidden = (randomNumber <= chanceOfDoorBeingHidden);
				var isDoorOpen;
				if (isDoorHidden)
				{
					entityForDoor.searchable().isHidden = true;
					isDoorOpen = false;
				}
				else
				{
					randomNumber = randomizer.getNextRandom();
					isDoorOpen = (randomNumber <= chanceOfDoorBeingOpen);
				}
				entityForDoor.openable().isOpen = isDoorOpen;

				entities.push(entityForDoor);
			}
		}
	}

	placeGenerateDungeon_5_Entities_3_Emplacements
	(
		entityDefnGroupsByName: Map<string, EntityDefnGroup>, zones: Zone2[],
		entities: Entity[], randomizer: Randomizer
	)
	{
		var chancesForEmplacementPerZone = 2;
		var probabilityOfEmplacementPerChance = .33;

		var entityDefnsForEmplacements =
			entityDefnGroupsByName.get("Emplacements").entityDefns;

		var sumOfFrequenciesForAllEmplacements = 0;

		for (var g = 0; g < entityDefnsForEmplacements.length; g++)
		{
			var entityDefn = entityDefnsForEmplacements[g] as Entity2;
			var relativeFrequency = entityDefn.generatable().relativeFrequency;
			sumOfFrequenciesForAllEmplacements += relativeFrequency;
		}

		var oneOneZero = Coords.Instances().OneOneZero;
		var twoTwoZero = Coords.Instances().TwoTwoZero;

		for (var r = 0; r < zones.length; r++)
		{
			var zone = zones[r];

			var zoneMin = zone.bounds.min();
			var zoneSizeMinusTwos =
				zone.bounds.size.clone().subtract(twoTwoZero);

			for (var c = 0; c < chancesForEmplacementPerZone; c++)
			{
				var randomValue = randomizer.getNextRandom();

				if (randomValue <= probabilityOfEmplacementPerChance)
				{
					randomValue =
						this.randomizer.getNextRandom()
						* sumOfFrequenciesForAllEmplacements;

					var sumOfFrequenciesForEmplacementsSoFar = 0;

					var entityDefnIndex = 0;

					for (var e = 0; e < entityDefnsForEmplacements.length; e++)
					{
						var entityDefn = entityDefnsForEmplacements[e] as Entity2;
						sumOfFrequenciesForEmplacementsSoFar +=
							entityDefn.generatable().relativeFrequency;

						if (sumOfFrequenciesForEmplacementsSoFar >= randomValue)
						{
							entityDefnIndex = e;
							break;
						}
					}

					var entityDefn = entityDefnsForEmplacements[entityDefnIndex] as Entity2;

					var pos = new Coords(0, 0, 0).randomize(randomizer).multiply
					(
						zoneSizeMinusTwos
					).add
					(
						zoneMin
					).add
					(
						oneOneZero
					).floor();

					var entity = Entity2.fromNameDefnAndProperties
					(
						entityDefn.name,
						entityDefn,
						[
							new Locatable(new Disposition(pos, null, null)),
						]
					);

					entities.push(entity);
				}

			} // end for each emplacement chance
			
		} // end for each zone
	}

	placeGenerateDungeon_5_Entities_4_Items
	(
		entityDefnGroups: Map<string, EntityDefnGroup>, zones: Zone2[],
		entities: Entity[], randomizer: Randomizer
	)
	{
		var chancesForItemPerZone = 2;
		var probabilityOfItemPerChance = 1; //.33;

		var entityDefnGroupsForItems =
		[
			entityDefnGroups.get("Armor"),
			entityDefnGroups.get("Food"),
			entityDefnGroups.get("Potions"),
			entityDefnGroups.get("Scrolls"),
			entityDefnGroups.get("Spellbooks"),
			entityDefnGroups.get("Stones"),
			entityDefnGroups.get("Tools"),
			entityDefnGroups.get("Valuables"),
			entityDefnGroups.get("Wands"),
			entityDefnGroups.get("Weapons"),
		];

		var sumOfFrequenciesForAllGroups = 0;

		for (var g = 0; g < entityDefnGroupsForItems.length; g++)
		{
			var entityDefnGroup = entityDefnGroupsForItems[g];
			sumOfFrequenciesForAllGroups += entityDefnGroup.relativeFrequency;
		}

		var oneOneZero = Coords.Instances().OneOneZero;
		var twoTwoZero = Coords.Instances().TwoTwoZero;

		for (var r = 0; r < zones.length; r++)
		{
			var zone = zones[r];

			var zoneMin = zone.bounds.min();
			var zoneSizeMinusTwos =
				zone.bounds.size.clone().subtract(twoTwoZero);

			for (var c = 0; c < chancesForItemPerZone; c++)
			{
				var randomValue = randomizer.getNextRandom();

				if (randomValue <= probabilityOfItemPerChance)
				{
					randomValue =
						this.randomizer.getNextRandom()
						* sumOfFrequenciesForAllGroups;

					var sumOfFrequenciesForGroupsSoFar = 0;

					var entityDefnGroupIndex = 0;

					for (var g = 0; g < entityDefnGroupsForItems.length; g++)
					{
						var entityDefnGroup = entityDefnGroupsForItems[g];
						sumOfFrequenciesForGroupsSoFar += entityDefnGroup.relativeFrequency;

						if (sumOfFrequenciesForGroupsSoFar >= randomValue)
						{
							entityDefnGroupIndex = g;
							break;
						}
					}

					var entityDefnGroup = entityDefnGroupsForItems[entityDefnGroupIndex];
					var entityDefns = entityDefnGroup.entityDefns;

					var entityDefnForItem = ArrayHelper.random(entityDefns, randomizer);

					var pos = new Coords(0, 0, 0).randomize(randomizer).multiply
					(
						zoneSizeMinusTwos
					).add
					(
						zoneMin
					).add
					(
						oneOneZero
					).floor();

					var entityForItem = Entity2.fromNameDefnAndProperties
					(
						entityDefnForItem.name,
						entityDefnForItem,
						[
							new Locatable(new Disposition(pos, null, null)),
							new Item(entityDefnForItem.name, 1)
						]
					);

					entities.push(entityForItem);
				}

			} // end for each chance

		} // end for each zone
	}

	placeGenerateDungeon_5_Entities_5_Movers(zones: Zone2[], entities: Entity[])
	{
		var entityMoverGenerator = new Entity2
		(
			"MoverGenerator",
			[
				new ActorDefn("Generate Movers"),
				new MoverGenerator(1/3, 1/70, zones)
				//new MoverGenerator(0, 1, zones) // test
			]
		);
		entities.push(entityMoverGenerator);
	}

	placeGenerateFortress
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateSurface
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		var branchName = branch.name;
		var venueName = branchName + placeIndex;

		var mapSizeInCells = new Coords(16, 16, 1);
		var mapCellsAsStrings = [];
		var mapRowAsString = StringHelper.padStart("", mapSizeInCells.x, ".");
		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			mapCellsAsStrings.push(mapRowAsString);
		}

		var map = new MapOfTerrain
		(
			venueName + "Map",
			placeDefn.terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var stairsDownPos = mapSizeInCells.clone().half().round();
		var entityStairsDown = Entity2.fromNameDefnAndProperties
		(
			"StairsDownToNextLevel",
			worldDefn.entityDefnsByName().get("StairsDown"),
			[
				Locatable.fromPos(stairsDownPos),
				new Portal2(null, "StairsUp")
			]
		);

		var altarPos = new Coords(mapSizeInCells.x / 2, 0, 0).floor();
		var entityAltar = Entity2.fromNameDefnAndProperties
		(
			"Altar",
			worldDefn.entityDefnsByName().get("Altar"),
			[
				Locatable.fromPos(altarPos),
			]
		);

		var mentorPos = altarPos.clone().addDimensions(-1, 0, 0);
		var entityMentor = Entity2.fromNameDefnAndProperties
		(
			"Mentor",
			worldDefn.entityDefnsByName().get("Mentor"),
			[
				Locatable.fromPos(mentorPos),
				new Namable2("mentor", "mentor")
			]
		);

		var entities = [ entityStairsDown, entityAltar, entityMentor ];

		var displayName = branch.displayName;

		var returnValue = new PlaceLevel
		(
			venueName,
			displayName,
			0, // venueDepth,
			placeDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			[], //zones
			entities
		);

		return returnValue;
	}

	placeGenerateHades
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateIsland
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateMines
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateOracle
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateLabyrinth
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateLimbo
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGeneratePuzzle
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateSingleChamber
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}

	placeGenerateThrowback
	(
		worldDefn: WorldDefn2, branch: PlaceBranch, placeDefn: PlaceDefn2,
		placeIndex: number, depth: number, randomizer: Randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	}
}
