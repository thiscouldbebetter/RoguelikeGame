// partial class DemoData
{
	DemoData.prototype.buildMapTerrainsDungeon = function(visualsForTiles)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 	false, "Green", visualsForTiles["Floor"]);
		this.Stone 				= new MapTerrain("Stone", 			"x", null, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", null, 	true, "Blue", visualsForTiles["WallDungeonCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", null, 	true, "Blue", visualsForTiles["WallDungeonCornerSouth"]);
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", null, 	true, "Blue", visualsForTiles["WallDungeonEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", null, 	true, "Blue", visualsForTiles["WallDungeonNorthSouth"]);

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		terrains.addLookupsByName();
		terrains.addLookups( function(element) { return element["codeChar"]; } );

		return terrains;
	};

	DemoData.prototype.buildMapTerrainsHades = function(visualsForTiles)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 	false, "Green", visualsForTiles["Floor"]);
		this.Stone 				= new MapTerrain("Stone", 			"x", null, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", null, 	true, "Blue", visualsForTiles["WallHadesCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", null, 	true, "Blue", visualsForTiles["WallHadesCornerSouth"]);
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", null, 	true, "Blue", visualsForTiles["WallHadesEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", null, 	true, "Blue", visualsForTiles["WallHadesNorthSouth"]);

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		terrains.addLookupsByName();
		terrains.addLookups( function(element) { return element["codeChar"]; } );

		return terrains;
	};

	DemoData.prototype.buildMapTerrainsMines = function(visualsForTiles)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 9, 		false, "Green", visualsForTiles["Floor"]);
		this.Stone 				= new MapTerrain("Stone", 			"x", 1000000, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", 1000000, 	true, "Blue", visualsForTiles["WallCaveCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", 1000000, 	true, "Blue", visualsForTiles["WallCaveCornerSouth"]);
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", 1000000, 	true, "Blue", visualsForTiles["WallCaveEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", 1000000, 	true, "Blue", visualsForTiles["WallCaveNorthSouth"]);

		var terrains =
		[
			this.Stone,
			this.Floor,
			this.WallCornerNorth,
			this.WallCornerSouth,
			this.WallEastWest,
			this.WallNorthSouth,
		];

		terrains.addLookupsByName();
		terrains.addLookups( function(element) { return element["codeChar"]; } );

		return terrains;
	};

	DemoData.prototype.buildMapTerrainsLabyrinth = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	};

	DemoData.prototype.buildMapTerrainsPuzzle = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	};

	DemoData.prototype.buildMapTerrainsThrowback = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	};

	DemoData.prototype.buildPlaceDefns = function(visuals, actions)
	{
		var mapTerrainsDungeon = this.buildMapTerrainsDungeon(visuals);
		var mapTerrainsHades = this.buildMapTerrainsHades(visuals);
		var mapTerrainsMines = this.buildMapTerrainsMines(visuals);

		// hack - Build this on the fly?
		var propertyNamesKnown =
		[
			ActorDefn.name,
			Awaitable.name,
			CollidableDefn.name,
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
			Portal.name,
		];

		var returnValues =
		[
			new PlaceDefn
			(
				"Depths",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateDepths
			),

			new PlaceDefn
			(
				"Dungeon",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateDungeon
			),

			new PlaceDefn
			(
				"Fortress",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateFortress
			),

			new PlaceDefn
			(
				"Hades",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateHades
			),

			new PlaceDefn
			(
				"Mines",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn
			(
				"MinesTown",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn
			(
				"MinesBottom",
				propertyNamesKnown,
				mapTerrainsMines,
				this.placeGenerateMines
			),

			new PlaceDefn
			(
				"Island",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateIsland
			),

			new PlaceDefn
			(
				"Labyrinth",
				propertyNamesKnown,
				this.buildMapTerrainsLabyrinth(visuals),
				this.placeGenerateLabyrinth
			),

			new PlaceDefn
			(
				"Limbo",
				propertyNamesKnown,
				mapTerrainsHades,
				this.placeGenerateLimbo
			),

			new PlaceDefn
			(
				"Oracle",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateOracle
			),

			new PlaceDefn
			(
				"Puzzle",
				propertyNamesKnown,
				this.buildMapTerrainsPuzzle(visuals),
				this.placeGeneratePuzzle
			),

			new PlaceDefn
			(
				"SingleChamber",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateSingleChamber
			),

			new PlaceDefn
			(
				"Surface",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.placeGenerateSurface
			),

			new PlaceDefn
			(
				"Throwback",
				propertyNamesKnown,
				this.buildMapTerrainsThrowback(visuals),
				this.placeGenerateThrowback
			)
		];

		return returnValues;
	};

	DemoData.prototype.buildPlaceTree = function()
	{
		var branchesMain =
		[
			new PlaceBranch
			(
				"Surface", // name
				"Surface", // displayName
				"Surface", // placeDefnName
				null, // startOffsetRange
				new Range(1, 1), // depth
				[]
			),
			new PlaceBranch
			(
				"DungeonShallow", // name
				"Dungeon", // displayName
				"Dungeon", // placeDefnName
				null, // startOffsetRange
				new Range(5, 6), // depthRangeInVenues
				// children
				[
					new PlaceBranch
					(
						"MinesShallow", // name
						"Mines", // displayName
						"Mines", // placeDefnName
						new Range(1, 4), // startOffset
						new Range(2, 4),
						[]
					),
					new PlaceBranch
					(
						"MinesTown",
						"Mines", // displayName
						"MinesTown",
						null, // startOffsetRange
						new Range(1, 1),
						[]
					),
					new PlaceBranch
					(
						"MinesDeep",
						"Mines", // displayName
						"Mines",
						null, // startOffsetRange
						new Range(2, 4),
						[]
					),
					new PlaceBranch
					(
						"MinesBottom",
						"Mines", // displayName
						"MinesBottom",
						null, // startOffsetRange
						new Range(1, 1),
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
				new Range(1, 1),
				[]
			),
			new PlaceBranch
			(
				"DungeonDeep",
				"Dungeon", // displayName
				"Dungeon",
				null, // startOffsetRange
				new Range(5, 6),
				[
					new PlaceBranch
					(
						"Puzzle",
						"Puzzle", // displayName
						"Puzzle",
						new Range(1, 4), // startOffset
						new Range(2, 4),
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
				new Range(3, 5),
				[]
			),
			new PlaceBranch
			(
				"Island",
				"Dungeon", // displayName
				"Island",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Fortress",
				"Dungeon", // displayName
				"Fortress",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Limbo",
				"Hades", // displayName
				"Limbo",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new PlaceBranch
			(
				"Hades",
				"Hades", // displayName
				"Hades",
				null, // startOffsetRange
				new Range(10, 20),
				[]
			),
			new PlaceBranch
			(
				"Depths",
				"Hades", // displayName
				"Depths",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
		];

		var placeTreeRoot = new PlaceBranch
		(
			"Root",
			null, // displayName
			"Dungeon", // hack
			null, // startOffsetRange
			new Range(0, 0),
			branchesMain
		);

		return placeTreeRoot;
	};

	DemoData.prototype.placeGenerateDepths = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		var branchName = branch.name;
		var place = this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
		var placeEntities = place.entitiesToSpawn;
		var stairDown = placeEntities.filter(x => x.name == "StairsDownToChildBranch")[0];

		var itemDefns = worldDefn.entityDefns;
		var itemDefnGoalName = "Amulet of Yendor";
		var itemDefnGoal = itemDefns[itemDefnGoalName];
		var entityGoal = EntityHelper.new
		(
			itemDefnGoal.name,
			itemDefnGoal,
			[
				new Locatable(stairDown.locatable.loc.clone()),
				new Item(itemDefnGoal.name, 1)
			]
		);
		placeEntities.push(entityGoal);

		return place;
	};

	DemoData.prototype.placeGenerateDungeon = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		var branchName = branch.name;
		var venueName = branchName + placeIndex;

		var mapSizeInCells = new Coords(64, 64);
		var numberOfZones = 12;
		var terrains = placeDefn.terrains;

		var mapCellsAsStrings = this.placeGenerateDungeon_1_InitMap
		(
			worldDefn, terrains, mapSizeInCells
		);
		var zoneBoundsSet = this.placeGenerateDungeon_2_ZoneBounds
		(
			terrains, randomizer, mapSizeInCells, numberOfZones
		);
		var zones = this.placeGenerateDungeon_3_Zones
		(
			numberOfZones, zoneBoundsSet, mapCellsAsStrings, terrains
		);
		var doorwayPositions = this.placeGenerateDungeon_4_Doors
		(
			zones, terrains, randomizer, mapCellsAsStrings
		);
		var entities = this.placeGenerateDungeon_5_Entities
		(
			worldDefn, branchName, placeDefn, venueName, randomizer, zones, doorwayPositions, mapCellsAsStrings
		);

		var map = new Map
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
	};

	DemoData.prototype.placeGenerateDungeon_1_InitMap = function(worldDefn, terrains, mapSizeInCells)
	{
		var entityDefnGroups = worldDefn.entityDefnGroups;
		var entityDefns = worldDefn.entityDefns;

		entityDefns.addLookupsByName();

		var mapCellsAsStrings = [];
		var cellPos = new Coords(0, 0);

		terrainCodeChar = terrains.Stone.codeChar;

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

	DemoData.prototype.placeGenerateDungeon_2_ZoneBounds = function(terrains, randomizer, mapSizeInCells, numberOfZones)
	{
		var zoneSizeMin = new Coords(4, 4, 1);
		var zoneSizeMax = new Coords(13, 13, 1);
		var zoneSizeRange = zoneSizeMax.clone().subtract(zoneSizeMin);

		terrainCodeChar = terrains.Floor.codeChar;

		var zoneBoundsSetSoFar = [];

		var ones = Coords.Instances().Ones;
		var twoTwoZero = Coords.Instances().TwoTwoZero;

		while (zoneBoundsSetSoFar.length < numberOfZones)
		{
			var doesZoneOverlapAnother = true;

			while (doesZoneOverlapAnother)
			{
				var zoneSize = new Coords().randomize(randomizer).multiply
				(
					zoneSizeRange
				).floor().add
				(
					zoneSizeMin
				);

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

				var zonePos = new Coords().randomize(randomizer).multiply
				(
					zonePosRange
				).floor().add
				(
					ones
				);

				var zoneBoundsWithWalls =
					new Box().fromMinAndSize(zonePos, zoneSizePlusOnes);

				doesZoneOverlapAnother = Box.doBoxesInSetsOverlap
				(
					[ zoneBoundsWithWalls ],
					zoneBoundsSetSoFar
				);
			}

			var zoneBounds = new Box().fromMinAndSize(zonePos, zoneSize);

			zoneBoundsSetSoFar.push(zoneBounds);
		}

		return zoneBoundsSetSoFar;
	}

	DemoData.prototype.placeGenerateDungeon_3_Zones = function
	(
		numberOfZones, zoneBoundsSetSoFar, mapCellsAsStrings, terrains
	)
	{
		var zones = [];

		for (var r = 0; r < numberOfZones; r++)
		{
			var zoneBounds = zoneBoundsSetSoFar[r];
			var zone = new Zone(zoneBounds);
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
							terrainCodeChar = terrains.WallCornerNorth.codeChar;
						}
						else if (y == zoneMax.y - 1)
						{
							terrainCodeChar = terrains.WallCornerSouth.codeChar;
						}
						else
						{
							terrainCodeChar = terrains.WallNorthSouth.codeChar;
						}
					}
					else if (y == zonePos.y || y == zoneMax.y - 1)
					{
						terrainCodeChar = terrains.WallEastWest.codeChar;
					}
					else
					{
						terrainCodeChar = terrains.Floor.codeChar;
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

	DemoData.prototype.placeGenerateDungeon_4_Doors = function(zones, terrains, randomizer, mapCellsAsStrings)
	{
		var zonesConnected = [ zones[0] ];
		var zonesToConnect = [];

		for (var r = 1; r < zones.length; r++)
		{
			zonesToConnect.push(zones[r]);
		}

		var zeroes = Coords.Instances().Zeroes;
		var oneOne = Coords.Instances().OneOneZero;
		var twoTwo = Coords.Instances().TwoTwoZero;

		var doorwayPositions = [];

		while (zonesToConnect.length > 0)
		{
			var nearestZonesSoFar = this.placeGenerateDungeon_4_Doors_1_NearestZones
			(
				zonesToConnect, zonesConnected
			);

			var zoneConnected = nearestZonesSoFar[0];
			var zoneToConnect = nearestZonesSoFar[1];

			var zoneConnectedBounds = zoneConnected.bounds;
			var zoneToConnectBounds = zoneToConnect.bounds;

			var fromPos = zoneConnectedBounds.min().clone().add
			(
				new Coords().randomize(randomizer).multiply
				(
					zoneConnectedBounds.size.clone().subtract
					(
						twoTwo
					)
				).floor()
			).add
			(
				oneOne
			);

			var toPos = zoneToConnectBounds.min().clone().add
			(
				new Coords().randomize(randomizer).multiply
				(
					zoneToConnectBounds.size.clone().subtract
					(
						twoTwo
					)
				).floor()
			).add
			(
				oneOne
			);

			var displacementToZoneToConnect = toPos.clone().subtract
			(
				fromPos
			);

			var directionToZoneToConnect = displacementToZoneToConnect.clone();

			var dimensionIndexToClear = directionToZoneToConnect.dimensionIndexOfSmallest(0);

			if (zoneConnectedBounds.overlapsWithOtherInDimension(zoneToConnectBounds, 0))
			{
				dimensionIndexToClear = 0;
			}
			else if (zoneConnectedBounds.overlapsWithOtherInDimension(zoneToConnectBounds, 1))
			{
				dimensionIndexToClear = 1;
			}

			directionToZoneToConnect.dimension
			(
				dimensionIndexToClear,
				0 // valueToSet
			);
			directionToZoneToConnect.directions();

			if (directionToZoneToConnect.x > 0)
			{
				fromPos.x = zoneConnectedBounds.max().x;
				toPos.x = zoneToConnectBounds.min().x - 1;
			}
			else if (directionToZoneToConnect.x < 0)
			{
				fromPos.x = zoneConnectedBounds.min().x - 1;
				toPos.x = zoneToConnectBounds.max().x;
			}
			else if (directionToZoneToConnect.y > 0)
			{
				fromPos.y = zoneConnectedBounds.max().y;
				toPos.y = zoneToConnectBounds.min().y - 1;
			}
			else if (directionToZoneToConnect.y < 0)
			{
				fromPos.y = zoneConnectedBounds.min().y - 1;
				toPos.y = zoneToConnectBounds.max().y;
			}

			doorwayPositions.push(fromPos.clone().subtract(directionToZoneToConnect));
			doorwayPositions.push(toPos.clone().add(directionToZoneToConnect));

			var cellPos = fromPos.clone();

			terrainCodeChar = terrains.Floor.codeChar;

			var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

			var terrainCodeCharsForWalls =
				terrains.WallEastWest.codeChar +
				terrains.WallNorthSouth.codeChar;

			while (displacementToZoneToConnect.equals(zeroes) == false)
			{
				var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

				var terrainCodeCharExisting = mapCellRowAsString[cellPos.x];

				mapCellRowAsString =
					mapCellRowAsString.substring(0, cellPos.x)
					+ terrainCodeChar
					+ mapCellRowAsString.substring(cellPos.x + 1);

				mapCellsAsStrings[cellPos.y] = mapCellRowAsString;

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
				).dimension
				(
					directionToZoneToConnect.dimensionIndexOfSmallest(0),
					0 // valueToSet
				)
				directionToZoneToConnect.directions();

				cellPos.add(directionToZoneToConnect);
			}

			zonesToConnect.remove(zoneToConnect);
			zonesConnected.push(zoneToConnect);
		}

		for (var i = 0; i < doorwayPositions.length; i++)
		{
			var cellPos = doorwayPositions[i];

			var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

			mapCellRowAsString =
				mapCellRowAsString.substring(0, cellPos.x)
				+ terrainCodeChar
				+ mapCellRowAsString.substring(cellPos.x + 1);

			mapCellsAsStrings[cellPos.y] = mapCellRowAsString;
		}

		return doorwayPositions;
	}

	DemoData.prototype.placeGenerateDungeon_4_Doors_1_NearestZones = function(zonesToConnect, zonesConnected)
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
						zoneConnected,
						zoneToConnect,
					];

					distanceBetweenNearestZonesSoFar = distance;
				}
			}
		}

		return nearestZonesSoFar;
	}

	DemoData.prototype.placeGenerateDungeon_5_Entities = function
	(
		worldDefn, branchName, placeDefn, venueName, randomizer, zones, doorwayPositions, mapCellsAsStrings
	)
	{
		var entityDefns = worldDefn.entityDefns;
		var entityDefnGroups = worldDefn.entityDefnGroups;

		var entities = [];

		var zone0Center = zones[0].bounds.center.clone().floor();

		var stairsUp = EntityHelper.new
		(
			"StairsUp",
			entityDefns["StairsUp"],
			[
				new Locatable(new Location(zone0Center)),
				new Portal
				(
					null, // placeName
					null, // destinationPortalName
				),
			]
		);

		entities.push(stairsUp);

		var entityMoverGenerator = new Entity
		(
			"MoverGenerator",
			[
				new ActorDefn("Generate Movers"),
				new MoverGenerator(1/3, 1/70, zones)
				//new MoverGenerator(0, 1, zones) // test
			]
		);
		entities.push(entityMoverGenerator);

		var stairsDownCount = 4; // hack - Placeholders.
		for (var i = 0; i < stairsDownCount; i++)
		{
			var zone = zones[i + 1];
			var zoneCenter = zone.bounds.center.clone().floor();

			var stairsDown = EntityHelper.new
			(
				(i == 0 ? "StairsDownToNextLevel" : "StairsDownToChildBranch"),
				entityDefns["StairsDown"],
				[
					new Locatable(new Location(zoneCenter)),
					new Portal
					(
						null, // placeName
						"StairsUp"
					)
				]
			);

			entities.push(stairsDown);
		}

		var chanceOfDoorPerDoorway = .75;
		var chanceOfDoorBeingOpen = .25;

		for (var i = 0; i < doorwayPositions.length; i++)
		{
			var randomNumber = randomizer.getNextRandom();
			if (randomNumber <= chanceOfDoorPerDoorway)
			{
				var doorPos = doorwayPositions[i];

				var entityForDoor = EntityHelper.new
				(
					"Door" + i,
					entityDefns["Door"],
					[
						new Locatable
						(
							new Location(doorwayPositions[i])
						)
					]
				);

				randomNumber = randomizer.getNextRandom();
				var isDoorOpen = (randomNumber <= chanceOfDoorBeingOpen);
				entityForDoor.openable.isOpen = isDoorOpen;

				entities.push(entityForDoor);
			}
		}

		// Emplacements.

		var chancesForEmplacementPerZone = 2;
		var probabilityOfEmplacementPerChance = .33;

		var entityDefnsForEmplacements = entityDefnGroups.Emplacements.entityDefns;

		var sumOfFrequenciesForAllEmplacements = 0;

		for (var g = 0; g < entityDefnsForEmplacements.length; g++)
		{
			var entityDefn = entityDefnsForEmplacements[g];
			var relativeFrequency = entityDefn.generatable.relativeFrequency;
			sumOfFrequenciesForAllEmplacements += relativeFrequency;
		}

		var chancesForItemPerZone = 2;
		var probabilityOfItemPerChance = 1; //.33;

		var entityDefnGroupsForItems =
		[
			entityDefnGroups.Armor,
			entityDefnGroups.Food,
			entityDefnGroups.Potions,
			entityDefnGroups.Scrolls,
			entityDefnGroups.Spellbooks,
			entityDefnGroups.Stones,
			entityDefnGroups.Tools,
			entityDefnGroups.Wands,
			entityDefnGroups.Weapons,
		];

		var sumOfFrequenciesForAllGroups = 0;

		for (var g = 0; g < entityDefnGroupsForItems.length; g++)
		{
			var entityDefnGroup = entityDefnGroupsForItems[g];
			sumOfFrequenciesForAllGroups += entityDefnGroup.relativeFrequency;
		}

		var oneOneZero = Coords.Instances().OneOneZero;

		for (var r = 0; r < zones.length; r++)
		{
			var zone = zones[r];

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

					var entityDefnForItem = entityDefns.random(randomizer);

					var pos = new Coords().randomize(randomizer).multiply
					(
						zone.bounds.size.clone().subtract
						(
							Coords.Instances().TwoTwoZero
						)
					).floor().add
					(
						zone.bounds.min()
					).add
					(
						oneOneZero
					)

					var entityForItem = EntityHelper.new
					(
						entityDefnForItem.name,
						entityDefnForItem,
						[
							new Locatable(new Location(pos)),
							new Item(entityDefnForItem.name, 1)
						]
					);

					entities.push(entityForItem);
				}
			} // end for each zone

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
						var entityDefn = entityDefnsForEmplacements[e];
						sumOfFrequenciesForEmplacementsSoFar +=
							entityDefn.generatable.relativeFrequency;

						if (sumOfFrequenciesForEmplacementsSoFar >= randomValue)
						{
							entityDefnIndex = e;
							break;
						}
					}

					var entityDefnForEmplacement = entityDefnsForEmplacements[entityDefnIndex];

					var pos = new Coords().randomize(randomizer).multiply
					(
						zone.bounds.size.clone().subtract
						(
							Coords.Instances().TwoTwoZero
						)
					).floor().add
					(
						zone.bounds.min()
					).add
					(
						oneOneZero
					)

					var entity = EntityHelper.new
					(
						entityDefn.name,
						entityDefn,
						[
							new Locatable(new Location(pos)),
						]
					);

					entities.push(entity);
				}
			} // end for each zone
		}

		return entities;
	};

	DemoData.prototype.placeGenerateFortress = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateSurface = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		var branchName = branch.name;
		var venueName = branchName + placeIndex;

		var mapSizeInCells = new Coords(16, 16, 1);
		var mapCellsAsStrings = [];
		var mapRowAsString = "".padLeft(mapSizeInCells.x, ".");
		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			mapCellsAsStrings.push(mapRowAsString);
		}

		var map = new Map
		(
			venueName + "Map",
			placeDefn.terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var stairsDownPos = mapSizeInCells.clone().half().round();
		var entityStairsDown = EntityHelper.new
		(
			"StairsDownToNextLevel",
			worldDefn.entityDefns["StairsDown"],
			[
				new Locatable(new Location(stairsDownPos)),
				new Portal(null, "StairsUp")
			]
		);

		var altarPos = new Coords(mapSizeInCells.x / 2, 0).floor();
		var entityAltar = EntityHelper.new
		(
			"Altar",
			worldDefn.entityDefns["Altar"],
			[
				new Locatable(new Location(altarPos)),
			]
		);

		var entities = [ entityStairsDown, entityAltar ];

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
	};

	DemoData.prototype.placeGenerateHades = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateIsland = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateMines = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateOracle = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateLabyrinth = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateLimbo = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGeneratePuzzle = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateSingleChamber = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};

	DemoData.prototype.placeGenerateThrowback = function
	(
		worldDefn, branch, placeDefn, placeIndex, depth, randomizer
	)
	{
		return this.placeGenerateDungeon(worldDefn, branch, placeDefn, placeIndex, depth, randomizer);
	};
}
