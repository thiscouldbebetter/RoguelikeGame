
class DemoData_Visuals
{
	parent: DemoData_Main;

	constructor(parent: DemoData_Main)
	{
		this.parent = parent;
	}

	static visualArraysToLookup
	(
		visualsForTiles: VisualBase[][], agentDatas: AgentData[]
	): Map<string, VisualBase>
	{
		var returnValue = new Map<string, VisualBase>();

		var tileNamesAndPositions =
		[
			// terrains
			[ "Floor", Coords.fromXY(8, 21) ],
			[ "Stone", Coords.fromXY(29, 20) ],

			[ "WallCaveCornerNorth", Coords.fromXY(15, 25) ],
			[ "WallCaveCornerSouth", Coords.fromXY(17, 25) ],
			[ "WallCaveEastWest", Coords.fromXY(14, 25) ],
			[ "WallCaveNorthSouth", Coords.fromXY(13, 25) ],

			[ "WallDungeonCornerNorth", Coords.fromXY(32, 20) ],
			[ "WallDungeonCornerSouth", Coords.fromXY(34, 20) ],
			[ "WallDungeonEastWest", Coords.fromXY(31, 20) ],
			[ "WallDungeonNorthSouth", Coords.fromXY(30, 20) ],

			[ "WallHadesCornerNorth", Coords.fromXY(26, 25) ],
			[ "WallHadesCornerSouth", Coords.fromXY(28, 25) ],
			[ "WallHadesEastWest", Coords.fromXY(25, 25) ],
			[ "WallHadesNorthSouth", Coords.fromXY(24, 25) ],

			[ "WallPuzzleCornerNorth", Coords.fromXY(8, 26) ],
			[ "WallPuzzleCornerSouth", Coords.fromXY(10, 26) ],
			[ "WallPuzzleEastWest", Coords.fromXY(7, 26) ],
			[ "WallPuzzleNorthSouth", Coords.fromXY(6, 26) ],

			// items - unsorted

			[ "Chest", Coords.fromXY(34, 9) ],
			[ "Coins", Coords.fromXY(29, 19) ],
			[ "Corpse", Coords.fromXY(36, 15) ],

			// items - foods

			[ "Eucalyptus Leaf", Coords.fromXY(3, 16) ],
			[ "Apple", Coords.fromXY(4, 16) ],
			[ "Orange", Coords.fromXY(5, 16) ],
			[ "Pear", Coords.fromXY(6, 16) ],
			[ "Melon", Coords.fromXY(7, 16) ],
			[ "Banana", Coords.fromXY(8, 16) ],
			[ "Carrot", Coords.fromXY(9, 16) ],
			[ "Wolfsbane Sprig", Coords.fromXY(10, 16) ],
			[ "Garlic Clove", Coords.fromXY(11, 16) ],
			[ "Slime Mold", Coords.fromXY(12, 16) ],
			[ "Royal Jelly", Coords.fromXY(13, 16) ],
			[ "Cream Pie", Coords.fromXY(14, 16) ],
			[ "Candy Bar", Coords.fromXY(15, 16) ],
			[ "Fortune Cookie", Coords.fromXY(16, 16) ],
			[ "Pancake", Coords.fromXY(17, 16) ],
			[ "Lembas Wafer", Coords.fromXY(18, 16) ],
			[ "Cram Ration", Coords.fromXY(19, 16) ],
			[ "Food Ration", Coords.fromXY(20, 16) ],
			[ "K Ration", Coords.fromXY(21, 16) ],
			[ "C Ration", Coords.fromXY(22, 16) ],
			[ "Tin", Coords.fromXY(23, 16) ],

			// items - armor - helmets

			[ "Elven Leather Helmet", Coords.fromXY(25, 11) ],
			[ "Orcish Helmet", Coords.fromXY(26, 11) ],
			[ "Dwarvish Helmet", Coords.fromXY(27, 11) ],
			[ "Black Hat", Coords.fromXY(28, 11) ],
			[ "Cornuthaum", Coords.fromXY(29, 11) ],
			[ "Dunce Cap", Coords.fromXY(30, 11) ],
			[ "Cooking Pot", Coords.fromXY(31, 11) ],
			[ "Plumed Helmet", Coords.fromXY(32, 11) ],
			[ "Etched Helmet", Coords.fromXY(33, 11) ],
			[ "Crested Helmet", Coords.fromXY(34, 11) ],
			[ "Visored Helmet", Coords.fromXY(35, 11) ],

			// items - armor - entity armor

			[ "Gray Dragonscale Mail", Coords.fromXY(36, 11) ],
			[ "Silver Dragonscale Mail", Coords.fromXY(37, 11) ],
			[ "Shimmering Dragonscale Mail", Coords.fromXY(38, 11) ],
			[ "Red Dragonscale Mail", Coords.fromXY(39, 11) ],
			[ "White Dragonscale Mail", Coords.fromXY(0, 12) ],
			[ "Orange Dragonscale Mail", Coords.fromXY(1, 12) ],
			[ "Black Dragonscale Mail", Coords.fromXY(2, 12) ],
			[ "Blue Dragonscale Mail", Coords.fromXY(3, 12) ],
			[ "Green Dragonscale Mail", Coords.fromXY(4, 12) ],
			[ "Yellow Dragonscale Mail", Coords.fromXY(5, 12) ],

			[ "Gray Dragon Scales", Coords.fromXY(6, 12) ],
			[ "Silver Dragon Scales", Coords.fromXY(7, 12) ],
			[ "Shimmering Dragon Scales", Coords.fromXY(8, 12) ],
			[ "Red Dragon Scales", Coords.fromXY(9, 12) ],
			[ "White Dragon Scales", Coords.fromXY(10, 12) ],
			[ "Orange Dragon Scales", Coords.fromXY(11, 12) ],
			[ "Black Dragon Scales", Coords.fromXY(12, 12) ],
			[ "Blue Dragon Scales", Coords.fromXY(13, 12) ],
			[ "Green Dragon Scales", Coords.fromXY(14, 12) ],
			[ "Yellow Dragon Scales", Coords.fromXY(15, 12) ],

			[ "Plate Mail", Coords.fromXY(16, 12) ],
			[ "Crystal Plate Mail", Coords.fromXY(17, 12) ],
			[ "Bronze Plate Mail", Coords.fromXY(18, 12) ],
			[ "Armor1", Coords.fromXY(19, 12) ],
			[ "Armor2", Coords.fromXY(20, 12) ],
			[ "Elven Mithril Shirt", Coords.fromXY(21, 12) ],
			[ "Dwarven Mithril Shirt", Coords.fromXY(22, 12) ],
			[ "Armor3", Coords.fromXY(23, 12) ],
			[ "Orcish Chain Mail", Coords.fromXY(24, 12) ],
			[ "Armor4", Coords.fromXY(25, 12) ],
			[ "Studded Leather Armor", Coords.fromXY(26, 12) ],
			[ "Armor5", Coords.fromXY(27, 12) ],
			[ "Armor6", Coords.fromXY(28, 12) ],
			[ "Leather Armor", Coords.fromXY(29, 12) ],

			[ "Leather Jacket", Coords.fromXY(30, 12) ],
			[ "Hawaiian Shirt", Coords.fromXY(31, 12) ],
			[ "Tee Shirt", Coords.fromXY(32, 12) ],
			[ "Mummy Wrapping", Coords.fromXY(33, 12) ],

			[ "Elven Cloak", Coords.fromXY(34, 12) ],
			[ "Leather Cloak", Coords.fromXY(35, 12) ],
			[ "Hooded Cloak", Coords.fromXY(36, 12) ],
			[ "Oilskin Cloak", Coords.fromXY(37, 12) ],
			[ "Robe", Coords.fromXY(38, 12) ],
			[ "Apron", Coords.fromXY(39, 12) ],
			[ "Leather Cloak 2", Coords.fromXY(0, 13) ],
			[ "Tattered Cloak", Coords.fromXY(1, 13) ],
			[ "Opera Cloak", Coords.fromXY(2, 13) ],
			[ "Ornamental Cope", Coords.fromXY(3, 13) ],
			[ "Piece of Cloth", Coords.fromXY(4, 13) ],

			// items - armor - shields

			[ "ShieldSmall", Coords.fromXY(5, 13) ],
			[ "ShieldGreen", Coords.fromXY(6, 13) ],
			[ "ShieldWhiteHanded", Coords.fromXY(7, 13) ],
			[ "ShieldRedEyed", Coords.fromXY(8, 13) ],
			[ "ShieldLarge", Coords.fromXY(9, 13) ],
			[ "Small Round Shield", Coords.fromXY(10, 13) ],
			[ "Polished Shield", Coords.fromXY(11, 13) ],

			// items - armor - gloves

			[ "Padded Gloves", Coords.fromXY(12, 13) ],
			[ "Old Gloves", Coords.fromXY(13, 13) ],
			[ "Riding Gloves", Coords.fromXY(14, 13) ],
			[ "Snow Gloves", Coords.fromXY(15, 13) ],

			// items - armor - boots

			[ "Low Boots", Coords.fromXY(16, 13) ],
			[ "Dwarven Boots", Coords.fromXY(17, 13) ],
			[ "High Boots", Coords.fromXY(18, 13) ],
			[ "Combat Boots", Coords.fromXY(19, 13) ],
			[ "Jungle Boots", Coords.fromXY(20, 13) ],
			[ "Elven Boots", Coords.fromXY(21, 13) ],
			[ "Mud Boots", Coords.fromXY(22, 13) ],
			[ "Buckled Boots", Coords.fromXY(23, 13) ],
			[ "Riding Boots", Coords.fromXY(24, 13) ],
			[ "Snow Boots", Coords.fromXY(25, 13) ],

			// items - amulets - special
			[ "Plastic Imitation Amulet of Yendor", Coords.fromXY(23, 14) ],
			[ "Amulet of Yendor", Coords.fromXY(24, 14) ],

			// items - tools

			[ "Key", Coords.fromXY(32, 14) ],
			[ "Lockpick", Coords.fromXY(33, 14) ],
			[ "Credit Card", Coords.fromXY(34, 14) ],
			[ "Candle", Coords.fromXY(35, 14) ],
			[ "Candle2", Coords.fromXY(36, 14) ],
			[ "Lantern", Coords.fromXY(37, 14) ],
			[ "Oil Lamp", Coords.fromXY(38, 14) ],
			[ "Magic Lamp", Coords.fromXY(39, 14) ],
			[ "Expensive Camera", Coords.fromXY(0, 15) ],
			[ "Mirror", Coords.fromXY(1, 15) ],
			[ "Crystal Orb", Coords.fromXY(2, 15) ],
			[ "Eyeglasses", Coords.fromXY(3, 15) ],
			[ "Blindfold", Coords.fromXY(4, 15) ],
			[ "Towel", Coords.fromXY(5, 15) ],
			[ "Saddle", Coords.fromXY(6, 15) ],
			[ "Leash", Coords.fromXY(7, 15) ],
			[ "Stethoscope", Coords.fromXY(8, 15) ],
			[ "Tinning Kit", Coords.fromXY(9, 15) ],
			[ "Tin Opener", Coords.fromXY(10, 15) ],
			[ "Can of Grease", Coords.fromXY(11, 15) ],
			[ "Figurine", Coords.fromXY(12, 15) ],
			[ "Magic Marker", Coords.fromXY(13, 15) ],
			[ "Unarmed Land Mine", Coords.fromXY(14, 15) ],
			[ "Unarmed Bear Trap", Coords.fromXY(15, 15) ],
			[ "Tin Whistle", Coords.fromXY(16, 15) ],
			[ "Magic Whistle", Coords.fromXY(17, 15) ],
			[ "Flute", Coords.fromXY(18, 15) ],
			[ "Flute2", Coords.fromXY(19, 15) ],
			[ "Tooled Horn", Coords.fromXY(20, 15) ],
			[ "Horn of Cold", Coords.fromXY(21, 15) ],
			[ "Horn of Plenty", Coords.fromXY(22, 15) ],
			[ "Horn4", Coords.fromXY(23, 15) ],
			[ "Harp", Coords.fromXY(24, 15) ],
			[ "Harp2", Coords.fromXY(25, 15) ],
			[ "Bell", Coords.fromXY(26, 15) ],
			[ "Trumpet", Coords.fromXY(27, 15) ],
			[ "Drum", Coords.fromXY(28, 15) ],
			[ "Earthquake Drum", Coords.fromXY(29, 15) ],
			[ "Pickaxe", Coords.fromXY(30, 15) ],
			[ "Grappling Hook", Coords.fromXY(31, 15) ],
			[ "Unicorn Horn", Coords.fromXY(32, 15) ],
			[ "Candelabra", Coords.fromXY(33, 15) ],
			[ "Bell of Opening", Coords.fromXY(34, 15) ],

			// items - weapons

			[ "Arrow", Coords.fromXY(35, 9) ],
			[ "Silver Arrow", Coords.fromXY(38, 9) ],
			[ "Battle Axe", Coords.fromXY(22, 10) ],
			[ "Hand Axe", Coords.fromXY(21, 10) ],
			[ "Bow", Coords.fromXY(19, 11) ],
			[ "Bow2", Coords.fromXY(20, 11) ],
			[ "Bow3", Coords.fromXY(21, 11) ],
			[ "Bow4", Coords.fromXY(22, 11) ],
			[ "Knife", Coords.fromXY(17, 10) ],
			[ "Crossbow", Coords.fromXY(24, 11) ],
			[ "Crossbow Bolt", Coords.fromXY(0, 10) ],
			[ "Dart", Coords.fromXY(1, 10) ],
			[ "Dagger", Coords.fromXY(12, 10) ],
			[ "Dwarvish Short Sword", Coords.fromXY(26, 10) ],
			[ "Elven Dagger", Coords.fromXY(13, 10) ],
			[ "Elven Short Sword", Coords.fromXY(24, 10) ],
			[ "Long Sword", Coords.fromXY(28, 10) ],
			[ "Orcish Dagger", Coords.fromXY(11, 10) ],
			[ "Orcish Short Sword", Coords.fromXY(25, 10) ],
			[ "Silver Dagger", Coords.fromXY(14, 10) ],
			[ "Polearm1", Coords.fromXY(10, 10) ],
			[ "Rapier0?", Coords.fromXY(15, 10) ],
			[ "Rapier1?", Coords.fromXY(18, 10) ],
			[ "Rapier2?", Coords.fromXY(20, 10) ],
			[ "Scimitar", Coords.fromXY(27, 10) ],
			[ "Short Sword", Coords.fromXY(23, 10) ],
			[ "Sling", Coords.fromXY(23, 11) ],
			[ "WormTooth", Coords.fromXY(19, 10) ],
		];

		function createTiles
		(
			namesInTileOrder: string[], namePrefix: string, nameSuffix: string,
			tilePos: Coords
		)
		{
			for (var i = 0; i < namesInTileOrder.length; i++)
			{
				var name = namesInTileOrder[i];
				name = namePrefix + name + nameSuffix;
				var tileNameAndPosition = [ name, tilePos.clone() ];
				tileNamesAndPositions.push(tileNameAndPosition);

				tilePos.x++;
				if (tilePos.x >= 40)
				{
					tilePos.x = 0;
					tilePos.y++;
				}
			}
		}

		var ringNamesInTileOrder =
		[
			"Wooden", "Granite", "Moonstone", "Clay",  "Shiny",
			"Black Onyx", "Opal", "Tiger Eye", "Emerald", "Bronze",
			"Topaz", "Agate", "Sapphire", "Ruby", "Diamond",
			"Pearl", "Iron", "Brass", "Copper", "Twisted",
			"Steel", "Silver", "Gold", "Ivory", "Jade",
			"Wire", "Engagement", "Coral"
		];

		createTiles(ringNamesInTileOrder, "", " Ring", Coords.fromXY(26, 13));

		var amuletNamesInTileOrder =
		[
			"Circular", "Spherical", "Oval", "Triangular",
			"Pyramidal", "Square", "Concave", "Hexagonal",
			"Octagonal",
		];

		createTiles(amuletNamesInTileOrder, "", " Amulet", Coords.fromXY(14, 14));

		var potionNamesInTileOrder =
		[
			"Ruby", "Pink", "Orange", "Yellow",
			"Emerald", "Dark Green", "Sky Blue", "Cyan",
			"Brilliant Blue", "Magenta", "Purple-Red", "Puce",
			"Milky", "Swirly", "Bubbly", "Smoky",
			"Cloudy", "Effervescent", "Black", "Golden",
			"Brown", "Fizzy", "Dark", "White",
			"Murky", "Clear",
		];

		createTiles(potionNamesInTileOrder, "", " Potion", Coords.fromXY(24, 16));

		var scrollNamesInTileOrder =
		[
			"Andova Begarin", "Daiyen Fooels", "Duam Xnaht", "Eblib Yloh",
			"Elam Ebow", "Foobie Bletch", "Garven Deh", "Hackem Muche",
			"Juyed Awk Yacc", "Kernod Wel", "Kirje", "Lep Gex Ven Zea",
			"NR 9", "Pratyavayah", "Prirutsenie", "Read Me",
			"Temov", "Tharr", "Ve Forbryderne", "Velox Neb",
			"Venzar Borgavve", "Verr Yed Horre", "Xixaxa Xoxaxa Xuxaxa", "Yum Yum",
			"Zelgo Mer",
		];

		createTiles(scrollNamesInTileOrder, "Scroll of '", "'", Coords.fromXY(10, 17));

		var spellbookNamesInTileOrder =
		[
			"Parchment", "Vellum", "Ragged", "Dogeared",
			"Mottled", "Stained", "Cloth", "Leather",
			"White", "Pink", "Red", "Orange",
			"Yellow", "Velvet", "Light Green", "Dark Green",
			"Turquoise", "Cyan", "Light Blue", "Dark Blue",
			"Indigo", "Magenta", "Purple", "Violet",
			"Tan", "Plaid", "Light Brown", "Dark Brown",
			"Gray", "Wrinkled", "Dusty", "Bronze",
			"Copper", "Silver", "Gold", "Glittering",
			"Shining", "Dull", "Thin", "Thick",
		];

		createTiles(spellbookNamesInTileOrder, "", " Spellbook", Coords.fromXY(37, 17));

		var wandNamesInTileOrder =
		[
			"Glass", "Balsa", "Crystal", "Maple",
			"Pine", "Oak", "Ebony", "Marble",
			"Tin", "Brass", "Copper", "Silver",
			"Platinum", "Iridium", "Zinc", "Aluminum",
			"Uranium", "Iron", "Steel", "Hexagonal",
			"Short", "Runed", "Long", "Curved",
			"Forked", "Spiked", "Jeweled",
		];

		createTiles(wandNamesInTileOrder, "", " Wand", Coords.fromXY(39, 18));

		var stoneNamesInTileOrder =
		[
			"White Gem", "White Gem", "Red Gem", "Orange Gem",
			"Blue Gem", "Black Gem", "Green Gem", "Green Gem",
			"Yellow Gem", "Green Gem", "Brownish Gem", "Brownish Gem",
			"Black Gem", "White Gem", "Yellow Gem", "Red Gem",
			"Violet Gem", "Red Gem", "Violet Gem", "Black Gem",
			"Orange Gem", "Green Gem", "White Gem", "Blue Gem",
			"Red Gem", "Brownish Gem", "Orange Gem", "Yellow Gem",
			"Black Gem", "Green Gem", "Violet Gem", "Gray Stone",
			"Gray Stone", "Gray Stone", "Gray Stone", "Rock",
			"Boulder", "Statue", "Iron Ball", "Iron Chain" // hack
		];

		var tilePos = Coords.fromXY(27, 19);
		createTiles(stoneNamesInTileOrder, "", "", Coords.fromXY(27, 19));

		var monsterNamesInTileOrder =
		[
			// insects - 0-5
			"Giant Ant", "Killer Bee", "Soldier Ant", "Fire Ant", "Giant Beetle", "Queen Bee",
			// amorphous - 6-8
			"Acid Blob", "Quivering Blob", /*?*/ "Gelatinous Cube",
			// chickenoids - 9-11
			"Chickatrice", "Cockatrice", "Pyrolisk",
			// canines - 12-27
			"Jackal", "Fox", "Coyote", "Werejackal", "Little Dog", "Dog", "Large Dog", "Dingo", "Wolf", "Werewolf", "Warg", "Winter Wolf Cub", "Winter Wolf", "Hell Hound Pup", "Hell Hound", "Cerberus",
			// spheres - 28-33
			"Gas Spore", "Floating Eye", "Freezing Sphere", "Flaming Sphere", "Shocking Sphere", "Beholder",
			// felines - 34-40
			"Kitten", "Housecat", "Jaguar", "Lynx", "Panther", "Large Cat", "Tiger",
			// gremlinoids - 41-43
			"Gremlin", "Gargoyle", "Winged Gargoyle",
			// humanoids - 44-50
			"Hobbit", "Dwarf", "Bugbear", "Dwarf Lord", "Dwarf King", "Mind Flayer", "Master Mind Flayer",
			// demons (minor) - 51-56
			"Manes", "Homunculus", "Imp", "Lemure", "Quasit", "Tengu",
			// jellies - 57-59
			"Blue Jelly", "Spotted Jelly", "Ochre Jelly",
			// kobolds - 60-63
			"Kobold", "Large Kobold", "Kobold Lord", "Kobold Shaman",
			// leprechaun - 64
			"Leprechaun",
			// mimics - 65-67
			"Small Mimic", "Large Mimic", "Giant Mimic",
			// nymphs - 68-70
			"Wood Nymph", "Water Nymph", "Mountain Nymph",
			// goblins - 71-78
			"Goblin", "Hobgoblin", "Orc", "Hill Orc", "Mordor Orc", "Uruk-hai", "Orc Shaman", "Orc Captain",
			// piercers - 79-81
			"Rock Piercer", "Iron Piercer", "Glass Piercer",
			// quadrupeds - 82-88
			"Rothe", "Mumak", "Leocrotta", "Wumpus", "Baluchitherium", "Titanothere", "Mastodon",
			// rats - 89-94
			"Sewer Rat", "Giant Rat", "Rabid Rat", "Wererat", "Rock Mole", "Groundhog",
			// polypods - 95-98
			"Cave Spider", "Giant Millipede", "Giant Spider", "Scorpion",
			// trappers - 99-100
			"Lurker Above", "Trapper",
			// unicorns - 101-103
			"White Unicorn", "Gray Unicorn", "Black Unicorn",
			// horses - 104-106
			"Pony", "Horse", "Warhorse",
			// clouds - 107-112
			"Fog Cloud", "Dust Vortex", "Ice Vortex", "Energy Vortex", "Steam Vortex", "Fire Vortex",
			// worms - 113-116
			"Baby Long Worm", "Baby Purple Worm", "Long Worm Head", "Purple Worm",
			// exotic insects - 117-118
			"Grid Bug", "Xan",
			// lights - 119-120
			"Yellow Light", "Black Light",
			// zruty - 121
			"Zruty",
			// angels - 122-126
			"Couatl", "Aleax", "Angel", "Ki-rin", "Archon",
			// bats - 127-130
			"Bat", "Giant Bat", "Raven", "Vampire Bat",
			// centaurs - 131-133
			"Plains Centaur", "Mountain Centaur", "Forest Centaur",
			// baby dragons - 134-143
			"Baby Gray Dragon", "Baby Silver Dragon", "Baby Shimmering Dragon", "Baby Red Dragon", "Baby White Dragon", "Baby Orange Dragon", "Baby Black Dragon", "Baby Blue Dragon", "Baby Green Dragon", "Baby Yellow Dragon",
			// dragons - 144-153
			"Gray Dragon", "Silver Dragon", "Shimmering Dragon", "Red Dragon", "White Dragon", "Orange Dragon", "Black Dragon", "Blue Dragon", "Green Dragon", "Yellow Dragon",
			// elementals - 154-158
			"Stalker", "Air Elemental", "Fire Elemental", "Earth Elemental", "Water Elemental",
			// fungi - 159-165
			"Lichen", "Brown Mold", "Yellow Mold", "Green Mold", "Red Mold", "Shrieker", "Violet Fungus",
			// gnomes - 166-169
			"Gnome", "Gnome Lord", "Gnomish Wizard", "Gnome King",
			// giant - 170-178
			"Giant", "Stone Giant", "Hill Giant", "Fire Giant", "Frost Giant", "Storm Giant", "Ettin", "Titan", "Minotaur",
			// jabberwockoids - 179-180
			"Jabberwock", "Jabberwock 2",
			// keystone kops - 181-184
			"Keystone Kop", "Kop Sergeant", "Kop Lieutenant", "Kop Kaptain",
			// liches - 185-188
			"Lich", "Demilich", "Master Lich", "Arch-Lich",
			// mummies - 189-196
			"Kobold Mummy", "Gnome Mummy", "Orc Mummy", "Dwarf Mummy", "Elf Mummy", "Human Mummy", "Ettin Mummy", "Giant Mummy",
			// nagas - 197-204
			"Red Naga Spawn", "Black Naga Spawn", "Golden Naga Spawn", "Guardian Naga Spawn", "Red Naga", "Black Naga", "Golden Naga", "Guardian Naga",
			// ogres - 205-207
			"Ogre", "Ogre Lord", "Ogre King",
			// puddings - 208-211
			"Gray Ooze", "Brown Pudding", "Black Pudding", "Green Slime",
			// 212
			"Quantum Mechanic",
			// 213-214
			"Rust Monster", "Disenchanter",
			// snakes - 215-220
			"Garter Snake", "Snake", "Water Moccasin", "Pit Viper", "Python", "Cobra",
			// trolls - 221-225
			"Troll", "Ice Troll", "Rock Troll", "Water Troll", "Olog-Hai",
			// 226
			"Umber Hulk",
			// 227-230
			"Vampire", "Vampire Lord", "Vampire 2", "Vlad the Impaler",
			// wraiths - 231-233
			"Barrow Wight", "Wraith", "Nazgul",
			// 234
			"Xorn",
			// simians - 235-240
			"Monkey", "Ape", "Owlbear", "Yeti", "Carnivorous Ape", "Sasquatch",
			// zombies - 241-248
			"Kobold Zombie", "Gnome Zombie", "Orc Zombie", "Dwarf Zombie", "Elf Zombie", "Human Zombie", "Ettin Zombie", "Giant Zombie",
			// additional undead - 249-250
			"Ghoul", "Skeleton",
			// golems - 251-261
			"Straw Golem", "Paper Golem", "Rope Golem", "Gold Golem", "Leather Golem", "Wood Golem", "Flesh Golem", "Clay Golem", "Stone Golem", "Glass Golem", "Iron Golem",
			// werecreatures (human) - 262-265
			"Human", "Wererat_Human", "Werejackal_Human", "Werewolf_Human",
			// elves - 266-271
			"Elf", "Woodland-Elf", "Green-Elf", "Grey-Elf", "Elf-Lord", "Elvenking",
			// 272
			"Doppelganger",
			// human civilians - 273-279
			"Nurse", "Shopkeeper", "Guard", "Prisoner", "Oracle", "Aligned Priest", "High Priest",
			// soldiers - 280-285
			"Soldier", "Sergeant", "Lieutenant", "Captain", "Watchman", "Watch Captain",
			// 286-289
			"Medusa", "Wizard of Yendor", "Croesus", "?",
			// ghosts - 290-291
			"Ghost", "Shade",
			// 292
			"Water Demon",
			// devils - 293-305
			"Horned Devil", "Succubus", "Incubus", "Erinys", "Barbed Devil", "Marilith", "Vrock", "Hezrou", "Bone Devil", "Ice Devil", "Nalfeshnee", "Pit Fiend", "Balrog",
			// demon princes - 306-313
			"Jubilex", "Yeenoghu", "Orcus", "Geryon", "Dispater", "Baalzebub", "Asmodeus", "Demogorgon",
			// riders - 314-316
			"Death", "Pestilence", "Famine",
			// 317-319
			"Mail Demon", "Djinni", "Sandestin",
			// marine - 320-325
			"Jellyfish", "Piranha", "Shark", "Giant Eel", "Electric Eel", "Kraken",
			// lizards - 326-333
			"Newt", "Gecko", "Iguana", "Baby Crocodile", "Lizard", "Chameleon", "Crocodile", "Salamander",
			// 334
			"Long Worm Tail",
			// roles - 335-?
			"Archeologist", 		"Barbarian", 	"Caveman", "Cavewoman", 						"Healer", 		"Knight", 		"Monk", 		"Priest", "Priestess", 	"Ranger", 	"Rogue", 				"Samurai", 			"Tourist", 		"Valkyrie", 	"Wizard",
			// quest leaders
			"Lord Carnarvon", 		"Pelias", 		"Shaman Karnov", 		"Earendil", "Elwing", 	"Hippocrates", 	"King Arthur", 	"Grand Master", "Arch Priest", 			"Orion", 	"Master of Thieves", 	"Lord Sato", 		"Twoflower", 	"Norn", 		"Neferet the Green",
			// quest nemeses
			"Minion of Huhetotl", 	"Thoth Amon", 	"Chromatic Dragon", 	"Goblin King", 			"Cyclops", 		"Ixoth", 		"Master Kaen", 	"Nalzok", 				"Scorpius", "Master Assassin", 		"Ashikaga Takauji", 				"Lord Surtur", 	"The Dark One",
			// quest guardians
			"Student", 				"Chieftan", 	"Neanderthal", 			"High-elf",				"Attendant", 	"Page", 		"Abbot", 		"Acolyte", 				"Hunter", 	"Thug", "Ninja",		"Roshi", 			"Guide", 		"Warrior", 		"Apprentice"
		];

		createTiles(monsterNamesInTileOrder, "", "", Coords.create());

		var emplacementNamesInTileOrder =
		[
			// 841-846
			"Doorway", "DoorOpenTop", "DoorOpenLeft", "DoorClosed", "DoorClosed2", "Bars",
			"Tree", // 847
			// 848-850
			"DotSmall", "DotOpen", "DotLarge",
			// 851-854
			"StairsUp", "StairsDown", "LadderUp", "LadderDown",
			// 855-859
			"Altar", "Gravestone", "Throne", "Sink", "Fountain",
			// 860-862
			"WaterSurface", "Ice", "Lava",
			// 863-866
			"BridgeNS", "BridgeEW", "PlanksEW", "PlanksNS",
			// 867-869
			"Sky", "Cloud", "WaterDepths",
			// 870-879
			"TrapArrow", "TrapDart", "TrapDeadfall", "TrapAlarm", "TrapJaws", "TrapMine", "TrapBoulder", "TrapSleep", "TrapWater", "TrapFire",
			// 880-886
			"Pit", "PitSpiked", "Hole", "TrapDoor", "TeleporterShort", "TeleporterLong", "MagicPortal",
			 // 887
			 "Web", "?", "TrapHex", "TrapDrain", "TrapPolymorph"
		];

		createTiles(emplacementNamesInTileOrder, "", "", Coords.fromXY(1, 21));

		for (var i = 0; i < tileNamesAndPositions.length; i++)
		{
			var tileNameAndPosition = tileNamesAndPositions[i];
			var tileName = tileNameAndPosition[0] as string;
			var tilePos = tileNameAndPosition[1] as Coords;

			var visual = visualsForTiles[tilePos.y][tilePos.x];
			//visual.name = tileName;
			returnValue.set(tileName, visual);
		}

		var tilePos = Coords.create();
		var imageSizeInTiles = Coords.fromXY(40, 27);

		for (var i = 0; i < agentDatas.length; i++)
		{
			var tileName = agentDatas[i].name as string;
			var visual = visualsForTiles[tilePos.y][tilePos.x];
			//visual.name = tileName;
			returnValue.set(tileName, visual);

			tilePos.x++;

			if (tilePos.x >= imageSizeInTiles.x)
			{
				tilePos.y++;
				tilePos.x = 0;
			}
		}

		var reticlePixelSetsAsStringArrays =
		[
			[
				"................",
				"................",
				"................",
				"................",
				"............w...",
				"............ww..",
				"............w.w.",
				"............w..w",
				"............w.w.",
				"............ww..",
				"............w...",
				"................",
				"................",
				"................",
				"................",
				"................",
			],

			[
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"...............w",
				"..............ww",
				".............w.w",
				"............w..w",
				"...........wwwww",
			],

			[
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				".....wwwwwww....",
				"......w...w.....",
				".......w.w......",
				"........w.......",
			],

			[
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"w...............",
				"ww..............",
				"w.w.............",
				"w..w............",
				"wwwww...........",
			],

			[
				"................",
				"................",
				"................",
				"................",
				"................",
				"...w............",
				"..ww............",
				".w.w............",
				"w..w............",
				".w.w............",
				"..ww............",
				"...w............",
				"................",
				"................",
				"................",
				"................",
			],

			[
				"wwwww...........",
				"w..w............",
				"w.w.............",
				"ww..............",
				"w...............",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
			],

			[
				"........w.......",
				".......w.w......",
				"......w...w.....",
				".....wwwwwww....",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
			],

			[
				"...........wwwww",
				"............w..w",
				".............w.w",
				"..............ww",
				"...............w",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
				"................",
			],

		];

		var imageBuilder = ImageBuilder.default();

		for (var i = 0; i < reticlePixelSetsAsStringArrays.length; i++)
		{
			var imageName = "Reticle" + i;

			var pixelsAsStrings = reticlePixelSetsAsStringArrays[i];

			var imageForReticle = imageBuilder.buildImageFromStrings
			(
				imageName, pixelsAsStrings
			);
			var visualForReticle = new VisualImageImmediate(imageForReticle, null);

			returnValue.set(imageName, visualForReticle);
		}

		return returnValue;
	}
}
