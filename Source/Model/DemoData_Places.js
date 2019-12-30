// partial class DemoData
{
	DemoData.prototype.buildMapTerrainsDungeon = function(visualsForTiles)
	{
		this.Floor 				= new MapTerrain("Floor", 			".", 1, 		false, "Green", visualsForTiles["Floor"]);
		this.Stone 				= new MapTerrain("Stone", 			"x", 1000000, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", 1000000, 	true, "Blue", visualsForTiles["WallDungeonCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", 1000000, 	true, "Blue", visualsForTiles["WallDungeonCornerSouth"]);
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", 1000000, 	true, "Blue", visualsForTiles["WallDungeonEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", 1000000, 	true, "Blue", visualsForTiles["WallDungeonNorthSouth"]);

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
		this.Floor 				= new MapTerrain("Floor", 			".", 1, 		false, "Green", visualsForTiles["Floor"]);
		this.Stone 				= new MapTerrain("Stone", 			"x", 1000000, 	true, "Black", new VisualNone());//visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", "+", 1000000, 	true, "Blue", visualsForTiles["WallHadesCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", "*", 1000000, 	true, "Blue", visualsForTiles["WallHadesCornerSouth"]);
		this.WallEastWest 		= new MapTerrain("WallEastWest", 	"-", 1000000, 	true, "Blue", visualsForTiles["WallHadesEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", 1000000, 	true, "Blue", visualsForTiles["WallHadesNorthSouth"]);

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
		this.Floor 				= new MapTerrain("Floor", 			".", 1, 		false, "Green", visualsForTiles["Floor"]);
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
			CollidableDefn.name,
			Device.name,
			Drawable.name,
			"Dynamic",
			Emplacement.name,
			"Enemy",
			Ephemeral.name,
			EquippableDefn.name,
			Item.name,
			ItemHolder.name,
			Killable.name,
			MoverDefn.name,
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
				this.venueGenerateDepths
			),

			new PlaceDefn
			(
				"Dungeon",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateDungeon
			),

			new PlaceDefn
			(
				"Fortress",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateFortress
			),

			new PlaceDefn
			(
				"Hades",
				propertyNamesKnown,
				mapTerrainsHades,
				this.venueGenerateHades
			),

			new PlaceDefn
			(
				"Mines",
				propertyNamesKnown,
				mapTerrainsMines,
				this.venueGenerateMines
			),

			new PlaceDefn
			(
				"MinesTown",
				propertyNamesKnown,
				mapTerrainsMines,
				this.venueGenerateMines
			),

			new PlaceDefn
			(
				"MinesBottom",
				propertyNamesKnown,
				mapTerrainsMines,
				this.venueGenerateMines
			),

			new PlaceDefn
			(
				"Island",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateIsland
			),

			new PlaceDefn
			(
				"Labyrinth",
				propertyNamesKnown,
				this.buildMapTerrainsLabyrinth(visuals),
				this.venueGenerateLabyrinth
			),

			new PlaceDefn
			(
				"Limbo",
				propertyNamesKnown,
				mapTerrainsHades,
				this.venueGenerateLimbo
			),

			new PlaceDefn
			(
				"Oracle",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateOracle
			),

			new PlaceDefn
			(
				"Puzzle",
				propertyNamesKnown,
				this.buildMapTerrainsPuzzle(visuals),
				this.venueGeneratePuzzle
			),

			new PlaceDefn
			(
				"SingleChamber",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateSingleChamber
			),

			new PlaceDefn
			(
				"Surface",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateSurface
			),

			new PlaceDefn
			(
				"Throwback",
				propertyNamesKnown,
				this.buildMapTerrainsThrowback(visuals),
				this.venueGenerateThrowback
			)
		];

		return returnValues;
	};

	DemoData.prototype.buildPlaceStructure = function()
	{
		var Branch = PlaceStructureBranch;

		var branchesMain =
		[
			new Branch
			(
				"Surface",
				"Surface",
				null, // startOffsetRange
				new Range(1, 1), // depth
				[]
			),
			new Branch
			(
				"DungeonShallow", // name
				"Dungeon", // placeDefnName
				null, // startOffsetRange
				new Range(5, 6), // depthRangeInVenues
				// children
				[
					new Branch
					(
						"MinesShallow",
						"Mines",
						new Range(1, 4), // startOffset
						new Range(2, 4),
						[]
					),
					new Branch
					(
						"MinesTown",
						"MinesTown",
						null, // startOffsetRange
						new Range(1, 1),
						[]
					),
					new Branch
					(
						"MinesDeep",
						"Mines",
						null, // startOffsetRange
						new Range(2, 4),
						[]
					),
					new Branch
					(
						"MinesBottom",
						"MinesBottom",
						null, // startOffsetRange
						new Range(1, 1),
						[]
					),
				]
			),
			new Branch
			(
				"Oracle",
				"Oracle",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"DungeonDeep",
				"Dungeon",
				null, // startOffsetRange
				new Range(5, 6),
				[
					new Branch
					(
						"Puzzle",
						"Puzzle",
						new Range(1, 4), // startOffset
						new Range(2, 4),
						[]
					),
				]
			),
			new Branch
			(
				"Labyrinth",
				"Labyrinth",
				null, // startOffsetRange
				new Range(3, 5),
				[]
			),
			new Branch
			(
				"Island",
				"Island",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Fortress",
				"Fortress",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Limbo",
				"Limbo",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Hades",
				"Hades",
				null, // startOffsetRange
				new Range(10, 20),
				[]
			),
			new Branch
			(
				"Depths",
				"Depths",
				null, // startOffsetRange
				new Range(1, 1),
				[]
			),
		];

		var venueStructure = new PlaceStructure
		(
			new Branch
			(
				"Root",
				"Dungeon", // hack
				null, // startOffsetRange
				new Range(0, 0),
				branchesMain
			)
		);

		return venueStructure;
	};

	DemoData.prototype.venueGenerateDepths = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		var place = this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
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
				new Locatable(stairDown.Locatable.loc.clone()),
				new Item(itemDefnGoal.name, 1)
			]
		);
		placeEntities.push(entityGoal);

		return place;
	};

	DemoData.prototype.venueGenerateDungeon = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		var venueName = branchName + venueIndex;

		var mapSizeInCells = new Coords(64, 64);
		var numberOfRooms = 12;
		var terrains = placeDefn.terrains;

		var mapCellsAsStrings = this.venueGenerateDungeon_1_InitMap
		(
			worldDefn, terrains, mapSizeInCells
		);
		var roomBoundsSet = this.venueGenerateDungeon_2_RoomBounds
		(
			terrains, randomizer, mapSizeInCells, numberOfRooms
		);
		var rooms = this.venueGenerateDungeon_3_Rooms
		(
			numberOfRooms, roomBoundsSet, mapCellsAsStrings, terrains
		);
		var doorwayPositions = this.venueGenerateDungeon_4_Doors
		(
			rooms, terrains, randomizer, mapCellsAsStrings
		);
		var entities = this.venueGenerateDungeon_5_Entities
		(
			worldDefn, branchName, placeDefn, venueName, randomizer, rooms, doorwayPositions, mapCellsAsStrings
		);

		var map = new Map
		(
			venueName + "Map",
			terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var returnValue = new PlaceLevel
		(
			venueName,
			0, //venueDepth,
			placeDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			entities
		);

		return returnValue;
	};

	DemoData.prototype.venueGenerateDungeon_1_InitMap = function(worldDefn, terrains, mapSizeInCells)
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

	DemoData.prototype.venueGenerateDungeon_2_RoomBounds = function(terrains, randomizer, mapSizeInCells, numberOfRooms)
	{
		var roomSizeMin = new Coords(4, 4, 1);
		var roomSizeMax = new Coords(13, 13, 1);
		var roomSizeRange = roomSizeMax.clone().subtract(roomSizeMin);

		terrainCodeChar = terrains.Floor.codeChar;

		var roomBoundsSetSoFar = [];

		var ones = Coords.Instances().Ones;
		var twoTwoZero = Coords.Instances().TwoTwoZero;

		while (roomBoundsSetSoFar.length < numberOfRooms)
		{
			var doesRoomOverlapAnother = true;

			while (doesRoomOverlapAnother)
			{
				var roomSize = new Coords().randomize(randomizer).multiply
				(
					roomSizeRange
				).floor().add
				(
					roomSizeMin
				);

				var roomSizePlusOnes = roomSize.clone().add
				(
					ones
				);

				var roomPosRange = mapSizeInCells.clone().subtract
				(
					roomSize
				).subtract
				(
					twoTwoZero
				);

				var roomPos = new Coords().randomize(randomizer).multiply
				(
					roomPosRange
				).floor().add
				(
					ones
				);

				var roomBoundsWithWalls =
					Box.fromMinAndSize(roomPos, roomSizePlusOnes);

				doesRoomOverlapAnother = Box.doBoxesInSetsOverlap
				(
					[ roomBoundsWithWalls ],
					roomBoundsSetSoFar
				);
			}

			var roomBounds = Box.fromMinAndSize(roomPos, roomSize);

			roomBoundsSetSoFar.push(roomBounds);
		}

		return roomBoundsSetSoFar;
	}

	DemoData.prototype.venueGenerateDungeon_3_Rooms = function
	(
		numberOfRooms, roomBoundsSetSoFar, mapCellsAsStrings, terrains
	)
	{
		var rooms = [];

		for (var r = 0; r < numberOfRooms; r++)
		{
			var roomBounds = roomBoundsSetSoFar[r];
			var room = new RoomData(roomBounds);
			rooms.push(room);
		}

		for (var r = 0; r < numberOfRooms; r++)
		{
			var room = rooms[r];
			var roomBounds = room.bounds;
			var roomPos = roomBounds.min();
			var roomMax = roomBounds.max();

			for (var y = roomPos.y; y < roomMax.y; y++)
			{
				var mapCellRowAsString = mapCellsAsStrings[y];

				for (var x = roomPos.x; x < roomMax.x; x++)
				{
					if (x == roomPos.x || x == roomMax.x - 1)
					{
						if (y == roomPos.y)
						{
							terrainCodeChar = terrains.WallCornerNorth.codeChar;
						}
						else if (y == roomMax.y - 1)
						{
							terrainCodeChar = terrains.WallCornerSouth.codeChar;
						}
						else
						{
							terrainCodeChar = terrains.WallNorthSouth.codeChar;
						}
					}
					else if (y == roomPos.y || y == roomMax.y - 1)
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

		return rooms;
	}

	DemoData.prototype.venueGenerateDungeon_4_Doors = function(rooms, terrains, randomizer, mapCellsAsStrings)
	{
		var roomsConnected = [ rooms[0] ];
		var roomsToConnect = [];

		for (var r = 1; r < rooms.length; r++)
		{
			roomsToConnect.push(rooms[r]);
		}

		var zeroes = Coords.Instances().Zeroes;
		var oneOne = Coords.Instances().OneOneZero;
		var twoTwo = Coords.Instances().TwoTwoZero;

		var doorwayPositions = [];

		while (roomsToConnect.length > 0)
		{
			var nearestRoomsSoFar = this.venueGenerateDungeon_4_Doors_1_NearestRooms
			(
				roomsToConnect, roomsConnected
			);

			var roomConnected = nearestRoomsSoFar[0];
			var roomToConnect = nearestRoomsSoFar[1];

			var roomConnectedBounds = roomConnected.bounds;
			var roomToConnectBounds = roomToConnect.bounds;

			var fromPos = roomConnectedBounds.min().clone().add
			(
				new Coords().randomize(randomizer).multiply
				(
					roomConnectedBounds.size.clone().subtract
					(
						twoTwo
					)
				).floor()
			).add
			(
				oneOne
			);

			var toPos = roomToConnectBounds.min().clone().add
			(
				new Coords().randomize(randomizer).multiply
				(
					roomToConnectBounds.size.clone().subtract
					(
						twoTwo
					)
				).floor()
			).add
			(
				oneOne
			);

			var displacementToRoomToConnect = toPos.clone().subtract
			(
				fromPos
			);

			var directionToRoomToConnect = displacementToRoomToConnect.clone();

			var dimensionIndexToClear = directionToRoomToConnect.dimensionIndexOfSmallest(0);

			if (roomConnectedBounds.overlapsWithOtherInDimension(roomToConnectBounds, 0))
			{
				dimensionIndexToClear = 0;
			}
			else if (roomConnectedBounds.overlapsWithOtherInDimension(roomToConnectBounds, 1))
			{
				dimensionIndexToClear = 1;
			}

			directionToRoomToConnect.dimension
			(
				dimensionIndexToClear,
				0 // valueToSet
			);
			directionToRoomToConnect.directions();

			if (directionToRoomToConnect.x > 0)
			{
				fromPos.x = roomConnectedBounds.max().x;
				toPos.x = roomToConnectBounds.min().x - 1;
			}
			else if (directionToRoomToConnect.x < 0)
			{
				fromPos.x = roomConnectedBounds.min().x - 1;
				toPos.x = roomToConnectBounds.max().x;
			}
			else if (directionToRoomToConnect.y > 0)
			{
				fromPos.y = roomConnectedBounds.max().y;
				toPos.y = roomToConnectBounds.min().y - 1;
			}
			else if (directionToRoomToConnect.y < 0)
			{
				fromPos.y = roomConnectedBounds.min().y - 1;
				toPos.y = roomToConnectBounds.max().y;
			}

			doorwayPositions.push(fromPos.clone().subtract(directionToRoomToConnect));
			doorwayPositions.push(toPos.clone().add(directionToRoomToConnect));

			var cellPos = fromPos.clone();

			terrainCodeChar = terrains.Floor.codeChar;

			var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

			var terrainCodeCharsForWalls =
				terrains.WallEastWest.codeChar +
				terrains.WallNorthSouth.codeChar;

			while (displacementToRoomToConnect.equals(zeroes) == false)
			{
				var mapCellRowAsString = mapCellsAsStrings[cellPos.y];

				var terrainCodeCharExisting = mapCellRowAsString[cellPos.x];

				mapCellRowAsString =
					mapCellRowAsString.substring(0, cellPos.x)
					+ terrainCodeChar
					+ mapCellRowAsString.substring(cellPos.x + 1);

				mapCellsAsStrings[cellPos.y] = mapCellRowAsString;

				displacementToRoomToConnect.overwriteWith
				(
					toPos
				).subtract
				(
					cellPos
				);

				directionToRoomToConnect.overwriteWith
				(
					displacementToRoomToConnect
				).dimension
				(
					directionToRoomToConnect.dimensionIndexOfSmallest(0),
					0 // valueToSet
				)
				directionToRoomToConnect.directions();

				cellPos.add(directionToRoomToConnect);
			}

			roomsToConnect.remove(roomToConnect);
			roomsConnected.push(roomToConnect);
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

	DemoData.prototype.venueGenerateDungeon_4_Doors_1_NearestRooms = function(roomsToConnect, roomsConnected)
	{
		var nearestRoomsSoFar = null;
		var distanceBetweenNearestRoomsSoFar = null;

		for (var r = 0; r < roomsConnected.length; r++)
		{
			var roomConnected = roomsConnected[r];
			var roomConnectedCenter = roomConnected.bounds.center;

			for (var s = 0; s < roomsToConnect.length; s++)
			{
				var roomToConnect = roomsToConnect[s];
				var roomToConnectCenter = roomToConnect.bounds.center;

				var distance = roomToConnectCenter.clone().subtract
				(
					roomConnectedCenter
				).absolute().clearZ().sumOfDimensions();

				if
				(
					nearestRoomsSoFar == null
					|| distance < distanceBetweenNearestRoomsSoFar
				)
				{
					nearestRoomsSoFar =
					[
						roomConnected,
						roomToConnect,
					];

					distanceBetweenNearestRoomsSoFar = distance;
				}
			}
		}

		return nearestRoomsSoFar;
	}

	DemoData.prototype.venueGenerateDungeon_5_Entities = function
	(
		worldDefn, branchName, placeDefn, venueName, randomizer, rooms, doorwayPositions, mapCellsAsStrings
	)
	{
		var entityDefns = worldDefn.entityDefns;
		var entityDefnGroups = worldDefn.entityDefnGroups;

		var entities = [];

		var room0Center = rooms[0].bounds.center.clone().floor();

		var stairsUp = EntityHelper.new
		(
			"StairsUp",
			entityDefns["StairsUp"],
			[
				new Locatable(new Location(room0Center)),
				new Portal
				(
					null, // placeName
					null, // destinationPortalName
				),
			]
		);

		entities.push(stairsUp);

		entities.push
		(
			EntityHelper.new
			(
				"Mover Generator",
				MoverGenerator.EntityDefn(),
				[] // properties
			)
		);

		var stairsDownCount = 4; // hack - Placeholders.
		for (var i = 0; i < stairsDownCount; i++)
		{
			var room = rooms[i + 1];
			var roomCenter = room.bounds.center.clone().floor();

			var stairsDown = EntityHelper.new
			(
				"StairsDown" + (i == 0 ? "ToNextLevel" : "ToChildBranch"),
				entityDefns["StairsDown"],
				[
					new Locatable(new Location(roomCenter)),
					new Portal
					(
						null, // placeName
						"StairsUp"
					)
				]
			);

			entities.push(stairsDown);
		}

		for (var i = 0; i < doorwayPositions.length; i++)
		{
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

			entities.push(entityForDoor);
		}

		var chancesForItemPerRoom = 2;
		var probabilityOfItemPerChance = 1;

		var entityDefnGroupsForItems =
		[
			entityDefnGroups["Armor"],
			entityDefnGroups["Food"],
			entityDefnGroups["Potions"],
			entityDefnGroups["Scrolls"],
			entityDefnGroups["Spellbooks"],
			entityDefnGroups["Stones"],
			entityDefnGroups["Tools"],
			entityDefnGroups["Wands"],
			entityDefnGroups["Weapons"],
		];

		var sumOfFrequenciesForAllGroups = 0;

		for (var g = 0; g < entityDefnGroupsForItems.length; g++)
		{
			var entityDefnGroup = entityDefnGroupsForItems[g];
			sumOfFrequenciesForAllGroups += entityDefnGroup.relativeFrequency;
		}

		var oneOneZero = Coords.Instances().OneOneZero;

		for (var r = 0; r < rooms.length; r++)
		{
			var room = rooms[r];

			for (var c = 0; c < chancesForItemPerRoom; c++)
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

					var entityDefnIndex = Math.floor
					(
						this.randomizer.getNextRandom()
						* entityDefns.length
					);

					var entityDefnForItem = entityDefns[entityDefnIndex];

					var pos = new Coords().randomize(randomizer).multiply
					(
						room.bounds.size.clone().subtract
						(
							Coords.Instances().TwoTwoZero
						)
					).floor().add
					(
						room.bounds.min()
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
			}
		}

		return entities;
	};

	DemoData.prototype.venueGenerateFortress = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateSurface = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		var venueName = branchName + venueIndex;

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

		var returnValue = new PlaceLevel
		(
			venueName,
			0, // venueDepth,
			placeDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			entities
		);

		return returnValue;
	};

	DemoData.prototype.venueGenerateHades = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateIsland = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateMines = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateOracle = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateLabyrinth = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateLimbo = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGeneratePuzzle = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateSingleChamber = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};

	DemoData.prototype.venueGenerateThrowback = function
	(
		worldDefn, branchName, placeDefn, venueIndex, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, branchName, placeDefn, venueIndex, randomizer);
	};
}
