// partial class DemoData
{
	DemoData.prototype.buildMapTerrainsMines = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	};

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
		return this.buildMapTerrainsDungeon(visualsForTiles);
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

	DemoData.prototype.buildVenueDefns = function(visuals, actions)
	{
		var mapTerrainsDungeon = this.buildMapTerrainsDungeon(visuals);

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
			new VenueDefn
			(
				"Dungeon",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateDungeon
			),

			new VenueDefn
			(
				"Fortress",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateFortress
			),

			new VenueDefn
			(
				"Surface",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateSurface
			),

			new VenueDefn
			(
				"Hades",
				propertyNamesKnown,
				this.buildMapTerrainsHades(visuals),
				this.venueGenerateHades
			),

			new VenueDefn
			(
				"Mines",
				propertyNamesKnown,
				this.buildMapTerrainsMines(visuals),
				this.venueGenerateMines
			),

			new VenueDefn
			(
				"MinesTown",
				propertyNamesKnown,
				this.buildMapTerrainsMines(visuals),
				this.venueGenerateMines
			),

			new VenueDefn
			(
				"MinesBottom",
				propertyNamesKnown,
				this.buildMapTerrainsMines(visuals),
				this.venueGenerateMines
			),

			new VenueDefn
			(
				"Island",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateIsland
			),

			new VenueDefn
			(
				"Labyrinth",
				propertyNamesKnown,
				this.buildMapTerrainsLabyrinth(visuals),
				this.venueGenerateLabyrinth
			),

			new VenueDefn
			(
				"Limbo",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateLimbo
			),

			new VenueDefn
			(
				"Oracle",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateOracle
			),

			new VenueDefn
			(
				"Puzzle",
				propertyNamesKnown,
				this.buildMapTerrainsPuzzle(visuals),
				this.venueGeneratePuzzle
			),

			new VenueDefn
			(
				"SingleChamber",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateSingleChamber
			),

			new VenueDefn
			(
				"Throwback",
				propertyNamesKnown,
				this.buildMapTerrainsThrowback(visuals),
				this.venueGenerateThrowback
			),

			new VenueDefn
			(
				"Tutorial",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateTutorial
			),
		];

		return returnValues;
	};

	DemoData.prototype.buildVenueStructure = function()
	{
		var Branch = WorldDefnVenueStructureBranch;

		var branchesMain =
		[
			new Branch
			(
				"Surface",
				"Surface",
				true,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"DungeonShallow", // name
				"Dungeon", // venueDefnName
				true, // startsAfterSibling
				new Range(0, 0), // startOffsetRangeWithinParent
				new Range(5, 6), // depthRangeInVenues
				// children
				[
					new Branch
					(
						"MinesShallow",
						"Mines",
						false,
						new Range(1, 4),
						new Range(2, 4),
						[]
					),
					new Branch
					(
						"MinesTown",
						"MinesTown",
						true,
						new Range(0, 0),
						new Range(1, 1),
						[]
					),
					new Branch
					(
						"MinesDeep",
						"Mines",
						true,
						new Range(0, 0),
						new Range(2, 4),
						[]
					),
					new Branch
					(
						"MinesBottom",
						"MinesBottom",
						true,
						new Range(0, 0),
						new Range(1, 1),
						[]
					),
				]
			),
			new Branch
			(
				"Oracle",
				"Oracle",
				true,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"DungeonDeep",
				"Dungeon",
				true,
				new Range(0, 0),
				new Range(5, 6),
				[
					new Branch
					(
						"Puzzle",
						"Puzzle",
						false,
						new Range(1, 4),
						new Range(2, 4),
						[]
					),
				]
			),
			new Branch
			(
				"Labyrinth",
				"Labyrinth",
				true,
				new Range(0, 0),
				new Range(3, 5),
				[]
			),
			new Branch
			(
				"Island",
				"Island",
				true,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Fortress",
				"Fortress",
				true,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Limbo",
				"Limbo",
				true,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			new Branch
			(
				"Hades",
				"Hades",
				true,
				new Range(0, 0),
				new Range(10, 20),
				[]
			),
			new Branch
			(
				"Depths",
				"Dungeon", // todo
				true,
				new Range(0, 0),
				new Range(10, 20),
				[]
			),
		];

		var venueStructure = new WorldDefnVenueStructure
		(
			new Branch
			(
				"Root",
				"Dungeon", // hack
				false,
				new Range(0, 0),
				new Range(0, 0),
				branchesMain
			)
		);

		return venueStructure;
	};
	
	DemoData.prototype.venueGenerateDungeon = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		var mapSizeInCells = new Coords(64, 64);
		var numberOfRooms = 12;
		var terrains = venueDefn.terrains;

		var mapCellsAsStrings = this.venueGenerateDungeon_1_InitMap
		(
			worldDefn, venueDefn, mapSizeInCells
		);
		var roomBoundsSet = this.venueGenerateDungeon_2_RoomBounds
		(
			venueDefn, randomizer, mapSizeInCells, numberOfRooms
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
			worldDefn, venueDefn, venueIndex, randomizer, rooms, doorwayPositions, mapCellsAsStrings
		);

		var map = new Map
		(
			"Venue" + venueIndex + "Map",
			venueDefn.terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var returnValue = new VenueLevel
		(
			"Venue" + venueIndex,
			venueDepth,
			venueDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			entities
		);

		return returnValue;
	};

	DemoData.prototype.venueGenerateDungeon_1_InitMap = function(worldDefn, venueDefn, mapSizeInCells)
	{
		var entityDefnGroups = worldDefn.entityDefnGroups;
		var entityDefns = worldDefn.entityDefns;

		entityDefns.addLookupsByName();

		var mapCellsAsStrings = [];
		var cellPos = new Coords(0, 0);
		var terrains = venueDefn.terrains;

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

	DemoData.prototype.venueGenerateDungeon_2_RoomBounds = function(venueDefn, randomizer, mapSizeInCells, numberOfRooms)
	{
		var roomSizeMin = new Coords(4, 4, 1);
		var roomSizeMax = new Coords(13, 13, 1);
		var roomSizeRange = roomSizeMax.clone().subtract(roomSizeMin);

		var terrains = venueDefn.terrains;
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

			roomsToConnect.splice(roomsToConnect.indexOf(roomToConnect), 1);
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
		worldDefn, venueDefn, venueIndex, randomizer, rooms, doorwayPositions, mapCellsAsStrings
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
					"Venue" + (venueIndex - 1),
					"StairsDown"
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

		var room1Center = rooms[1].bounds.center.clone().floor();

		var stairsDown = EntityHelper.new
		(
			"StairsDown",
			entityDefns["StairsDown"],
			[
				new Locatable(new Location(room1Center)),
				new Portal
				(
					"Venue" + (venueIndex + 1),
					"StairsUp"
				),
			]
		);

		entities.push(stairsDown);

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
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateSurface = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		var mapSizeInCells = new Coords(16, 16, 1);
		var mapCellsAsStrings = [];
		var mapRowAsString = "".padLeft(mapSizeInCells.x, ".");
		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			mapCellsAsStrings.push(mapRowAsString);
		}
		var map = new Map
		(
			"Venue" + venueIndex + "Map",
			venueDefn.terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var entityDefnName = "StairsDown"; // todo

		var stairsDownPos = mapSizeInCells.clone().half().round();

		var entityStairsDown = EntityHelper.new
		(
			entityDefnName,
			worldDefn.entityDefns[entityDefnName],
			[
				new Locatable(new Location(stairsDownPos)), // pos
				new Portal("Venue" + (venueIndex + 1), "StairsUp") // todo
			]
		);

		var entities = [ entityStairsDown ];

		var returnValue = new VenueLevel
		(
			"Venue" + venueIndex,
			venueDepth,
			venueDefn,
			new Coords(480, 480, 1), // sizeInPixels
			map,
			entities
		);

		return returnValue;
	};

	DemoData.prototype.venueGenerateHades = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateIsland = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateMines = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateOracle = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateLabyrinth = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateLimbo = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGeneratePuzzle = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateSingleChamber = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateThrowback = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateTutorial = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		var sizeInCells = new Coords(16, 16);

		var stringForTopAndBottomRows = "x";
		var stringForOtherRows = "x";

		for (var x = 1; x < sizeInCells.x - 1; x++)
		{
			stringForTopAndBottomRows += "x";
			stringForOtherRows += ".";
		}

		stringForTopAndBottomRows += "x";
		stringForOtherRows += "x";

		var mapCellsAsStrings = [];

		mapCellsAsStrings.push(stringForTopAndBottomRows);

		for (var y = 1; y < sizeInCells.y - 1; y++)
		{
			mapCellsAsStrings.push(stringForOtherRows);
		}

		mapCellsAsStrings.push(stringForTopAndBottomRows);

		var map = new Map
		(
			"Venue" + venueIndex + "Map",
			venueDefn.terrains,
			new Coords(16, 16), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var entityDefns = worldDefn.entityDefns;

		var entities =
		[
			// stairs

			EntityHelper.new
			(
				"StairsDown",
				entityDefns["StairsDown"],
				[
					new Locatable
					(
						new Location
						(
							sizeInCells.clone().subtract
							(
								Coords.Instances().Ones
							)
						)
					),
					new Portal
					(
						"Venue" + (venueIndex + 1),
						"StairsUp"
					),
				]
			),

		];

		var returnValue = new VenueLevel
		(
			"Venue" + venueIndex,
			venueDepth,
			venueDefn,
			new Coords(480, 480), // sizeInPixels
			map,
			entities
		);

		return returnValue;
	};
}
