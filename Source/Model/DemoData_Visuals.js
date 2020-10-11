
class DemoData_Visuals
{
	constructor(parent)
	{
		this.parent = parent;
	}

	buildVisualLookup(visualsForTiles)
	{
		var returnValue = [];

		var tileNamesAndPositions =
		[
			// terrains
			[ "Floor", new Coords(8, 21) ],
			[ "Stone", new Coords(29, 20) ],

			[ "WallCaveCornerNorth", new Coords(15, 25) ],
			[ "WallCaveCornerSouth", new Coords(17, 25) ],
			[ "WallCaveEastWest", new Coords(14, 25) ],
			[ "WallCaveNorthSouth", new Coords(13, 25) ],

			[ "WallDungeonCornerNorth", new Coords(32, 20) ],
			[ "WallDungeonCornerSouth", new Coords(34, 20) ],
			[ "WallDungeonEastWest", new Coords(31, 20) ],
			[ "WallDungeonNorthSouth", new Coords(30, 20) ],

			[ "WallHadesCornerNorth", new Coords(26, 25) ],
			[ "WallHadesCornerSouth", new Coords(28, 25) ],
			[ "WallHadesEastWest", new Coords(25, 25) ],
			[ "WallHadesNorthSouth", new Coords(24, 25) ],

			[ "WallPuzzleCornerNorth", new Coords(8, 26) ],
			[ "WallPuzzleCornerSouth", new Coords(10, 26) ],
			[ "WallPuzzleEastWest", new Coords(7, 26) ],
			[ "WallPuzzleNorthSouth", new Coords(6, 26) ],

			// items - unsorted

			[ "Chest", new Coords(34, 9) ],
			[ "Coins", new Coords(29, 19) ],
			[ "Corpse", new Coords(36, 15) ],

			// items - foods

			[ "Eucalyptus Leaf", new Coords(3, 16) ],
			[ "Apple", new Coords(4, 16) ],
			[ "Orange", new Coords(5, 16) ],
			[ "Pear", new Coords(6, 16) ],
			[ "Melon", new Coords(7, 16) ],
			[ "Banana", new Coords(8, 16) ],
			[ "Carrot", new Coords(9, 16) ],
			[ "Wolfsbane Sprig", new Coords(10, 16) ],
			[ "Garlic Clove", new Coords(11, 16) ],
			[ "Slime Mold", new Coords(12, 16) ],
			[ "Royal Jelly", new Coords(13, 16) ],
			[ "Cream Pie", new Coords(14, 16) ],
			[ "Candy Bar", new Coords(15, 16) ],
			[ "Fortune Cookie", new Coords(16, 16) ],
			[ "Pancake", new Coords(17, 16) ],
			[ "Lembas Wafer", new Coords(18, 16) ],
			[ "Cram Ration", new Coords(19, 16) ],
			[ "Food Ration", new Coords(20, 16) ],
			[ "K Ration", new Coords(21, 16) ],
			[ "C Ration", new Coords(22, 16) ],
			[ "Tin", new Coords(23, 16) ],

			// items - armor - helmets

			[ "Elven Leather Helmet", new Coords(25, 11) ],
			[ "Orcish Helmet", new Coords(26, 11) ],
			[ "Dwarvish Helmet", new Coords(27, 11) ],
			[ "Black Hat", new Coords(28, 11) ],
			[ "Cornuthaum", new Coords(29, 11) ],
			[ "Dunce Cap", new Coords(30, 11) ],
			[ "Cooking Pot", new Coords(31, 11) ],
			[ "Plumed Helmet", new Coords(32, 11) ],
			[ "Etched Helmet", new Coords(33, 11) ],
			[ "Crested Helmet", new Coords(34, 11) ],
			[ "Visored Helmet", new Coords(35, 11) ],

			// items - armor - entity armor

			[ "Gray Dragonscale Mail", new Coords(36, 11) ],
			[ "Silver Dragonscale Mail", new Coords(37, 11) ],
			[ "Rainbow Dragonscale Mail", new Coords(38, 11) ],
			[ "Red Dragonscale Mail", new Coords(39, 11) ],
			[ "White Dragonscale Mail", new Coords(0, 12) ],
			[ "Orange Dragonscale Mail", new Coords(1, 12) ],
			[ "Black Dragonscale Mail", new Coords(2, 12) ],
			[ "Blue Dragonscale Mail", new Coords(3, 12) ],
			[ "Green Dragonscale Mail", new Coords(4, 12) ],
			[ "Yellow Dragonscale Mail", new Coords(5, 12) ],

			[ "Gray Dragon Scales", new Coords(6, 12) ],
			[ "Silver Dragon Scales", new Coords(7, 12) ],
			[ "Rainbow Dragon Scales", new Coords(8, 12) ],
			[ "Red Dragon Scales", new Coords(9, 12) ],
			[ "White Dragon Scales", new Coords(10, 12) ],
			[ "Orange Dragon Scales", new Coords(11, 12) ],
			[ "Black Dragon Scales", new Coords(12, 12) ],
			[ "Blue Dragon Scales", new Coords(13, 12) ],
			[ "Green Dragon Scales", new Coords(14, 12) ],
			[ "Yellow Dragon Scales", new Coords(15, 12) ],

			[ "Plate Mail", new Coords(16, 12) ],
			[ "Crystal Plate Mail", new Coords(17, 12) ],
			[ "Bronze Plate Mail", new Coords(18, 12) ],
			[ "Armor1", new Coords(19, 12) ],
			[ "Armor2", new Coords(20, 12) ],
			[ "Elven Mithril Shirt", new Coords(21, 12) ],
			[ "Dwarven Mithril Shirt", new Coords(22, 12) ],
			[ "Armor3", new Coords(23, 12) ],
			[ "Orcish Chain Mail", new Coords(24, 12) ],
			[ "Armor4", new Coords(25, 12) ],
			[ "Studded Leather Armor", new Coords(26, 12) ],
			[ "Armor5", new Coords(27, 12) ],
			[ "Armor6", new Coords(28, 12) ],
			[ "Leather Armor", new Coords(29, 12) ],

			[ "Leather Jacket", new Coords(30, 12) ],
			[ "Hawaiian Shirt", new Coords(31, 12) ],
			[ "Tee Shirt", new Coords(32, 12) ],
			[ "Mummy Wrapping", new Coords(33, 12) ],

			[ "Elven Cloak", new Coords(34, 12) ],
			[ "Leather Cloak", new Coords(35, 12) ],
			[ "Hooded Cloak", new Coords(36, 12) ],
			[ "Oilskin Cloak", new Coords(37, 12) ],
			[ "Robe", new Coords(38, 12) ],
			[ "Apron", new Coords(39, 12) ],
			[ "Leather Cloak 2", new Coords(0, 13) ],
			[ "Tattered Cloak", new Coords(1, 13) ],
			[ "Opera Cloak", new Coords(2, 13) ],
			[ "Ornamental Cope", new Coords(3, 13) ],
			[ "Piece of Cloth", new Coords(4, 13) ],

			// items - armor - shields

			[ "ShieldSmall", new Coords(5, 13) ],
			[ "ShieldGreen", new Coords(6, 13) ],
			[ "ShieldWhiteHanded", new Coords(7, 13) ],
			[ "ShieldRedEyed", new Coords(8, 13) ],
			[ "ShieldLarge", new Coords(9, 13) ],
			[ "Small Round Shield", new Coords(10, 13) ],
			[ "Polished Shield", new Coords(11, 13) ],

			// items - armor - gloves

			[ "Padded Gloves", new Coords(12, 13) ],
			[ "Old Gloves", new Coords(13, 13) ],
			[ "Riding Gloves", new Coords(14, 13) ],
			[ "Snow Gloves", new Coords(15, 13) ],

			// items - armor - boots

			[ "Low Boots", new Coords(16, 13) ],
			[ "Dwarven Boots", new Coords(17, 13) ],
			[ "High Boots", new Coords(18, 13) ],
			[ "Combat Boots", new Coords(19, 13) ],
			[ "Jungle Boots", new Coords(20, 13) ],
			[ "Elven Boots", new Coords(21, 13) ],
			[ "Mud Boots", new Coords(22, 13) ],
			[ "Buckled Boots", new Coords(23, 13) ],
			[ "Riding Boots", new Coords(24, 13) ],
			[ "Snow Boots", new Coords(25, 13) ],

			// items - amulets - special
			[ "Plastic Imitation Amulet of Yendor", new Coords(23, 14) ],
			[ "Amulet of Yendor", new Coords(24, 14) ],

			// items - tools

			[ "Key", new Coords(32, 14) ],
			[ "Lockpick", new Coords(33, 14) ],
			[ "Credit Card", new Coords(34, 14) ],
			[ "Candle", new Coords(35, 14) ],
			[ "Candle2", new Coords(36, 14) ],
			[ "Lantern", new Coords(37, 14) ],
			[ "Oil Lamp", new Coords(38, 14) ],
			[ "Magic Lamp", new Coords(39, 14) ],
			[ "Expensive Camera", new Coords(0, 15) ],
			[ "Mirror", new Coords(1, 15) ],
			[ "Crystal Orb", new Coords(2, 15) ],
			[ "Eyeglasses", new Coords(3, 15) ],
			[ "Blindfold", new Coords(4, 15) ],
			[ "Towel", new Coords(5, 15) ],
			[ "Saddle", new Coords(6, 15) ],
			[ "Leash", new Coords(7, 15) ],
			[ "Stethoscope", new Coords(8, 15) ],
			[ "Tinning Kit", new Coords(9, 15) ],
			[ "Tin Opener", new Coords(10, 15) ],
			[ "Can of Grease", new Coords(11, 15) ],
			[ "Figurine", new Coords(12, 15) ],
			[ "Magic Marker", new Coords(13, 15) ],
			[ "Unarmed Land Mine", new Coords(14, 15) ],
			[ "Unarmed Bear Trap", new Coords(15, 15) ],
			[ "Tin Whistle", new Coords(16, 15) ],
			[ "Magic Whistle", new Coords(17, 15) ],
			[ "Flute", new Coords(18, 15) ],
			[ "Flute2", new Coords(19, 15) ],
			[ "Tooled Horn", new Coords(20, 15) ],
			[ "Horn of Cold", new Coords(21, 15) ],
			[ "Horn of Plenty", new Coords(22, 15) ],
			[ "Horn4", new Coords(23, 15) ],
			[ "Harp", new Coords(24, 15) ],
			[ "Harp2", new Coords(25, 15) ],
			[ "Bell", new Coords(26, 15) ],
			[ "Trumpet", new Coords(27, 15) ],
			[ "Drum", new Coords(28, 15) ],
			[ "Earthquake Drum", new Coords(29, 15) ],
			[ "Pickaxe", new Coords(30, 15) ],
			[ "Grappling Hook", new Coords(31, 15) ],
			[ "Unicorn Horn", new Coords(32, 15) ],
			[ "Candelabra", new Coords(33, 15) ],
			[ "Bell of Opening", new Coords(34, 15) ],

			// items - weapons

			[ "Arrow", new Coords(35, 9) ],
			[ "Silver Arrow", new Coords(38, 9) ],
			[ "Battle Axe", new Coords(22, 10) ],
			[ "Hand Axe", new Coords(21, 10) ],
			[ "Bow", new Coords(19, 11) ],
			[ "Bow2", new Coords(20, 11) ],
			[ "Bow3", new Coords(21, 11) ],
			[ "Bow4", new Coords(22, 11) ],
			[ "Sling", new Coords(23, 11) ],
			[ "Crossbow", new Coords(24, 11) ],
			[ "Crossbow Bolt", new Coords(16, 10) ],
			[ "Dagger", new Coords(12, 10) ],
			[ "Elven Dagger", new Coords(13, 10) ],
			[ "Orcish Dagger", new Coords(11, 10) ],
			[ "Silver Dagger", new Coords(14, 10) ],
			[ "Knife", new Coords(17, 10) ],
			[ "Polearm1", new Coords(10, 10) ],
			[ "Rapier0?", new Coords(15, 10) ],
			[ "Rapier1?", new Coords(18, 10) ],
			[ "Rapier2?", new Coords(20, 10) ],
			[ "Sword", new Coords(23, 10) ],
			[ "WormTooth", new Coords(19, 10) ],
		];

		function createTiles(namesInTileOrder, namePrefix, nameSuffix, tilePos)
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

		createTiles(ringNamesInTileOrder, "", " Ring", new Coords(26, 13));

		var amuletNamesInTileOrder =
		[
			"Circular", "Spherical", "Oval", "Triangular",
			"Pyramidal", "Square", "Concave", "Hexagonal",
			"Octagonal",
		];

		createTiles(amuletNamesInTileOrder, "", " Amulet", new Coords(14, 14));

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

		createTiles(potionNamesInTileOrder, "", " Potion", new Coords(24, 16));

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

		createTiles(scrollNamesInTileOrder, "Scroll Titled '", "'", new Coords(10, 17));

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

		createTiles(spellbookNamesInTileOrder, "", " Spellbook", new Coords(37, 17));

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

		createTiles(wandNamesInTileOrder, "", " Wand", new Coords(39, 18));

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
		];

		var tilePos = new Coords(27, 19);
		createTiles(stoneNamesInTileOrder, "", "", new Coords(27, 19));

		var monsterNamesInTileOrder =
		[
			// insects - 0-5
			"Giant Ant", "Killer Bee", "Soldier Ant", "Fire Ant", "Giant Beetle", "Queen Bee",
			// amorphous - 6-8
			"Acid Blob", "Quivering Blob", /*?*/ "Gelatinous Cube",
			// chickenoids - 9-11
			"Chickatrice", "Cockatrice", "Pyrolisk",
			// canines - 12-27
			"Jackal", "Fox", "Coyote", "Werejackal", "Little Dog", "Dog", "Large Dog", "Dingo", "Wolf", "Werewolf", "Dire Wolf", "Frost Hound Pup", "Frost Hound", "Hell Hound Pup", "Hell Hound", "Cerberus",
			// spheres - 28-33
			"Gas Spore", "Floating Eye", "Freezing Sphere", "Flaming Sphere", "Shocking Sphere", "Beholder",
			// felines - 34-40
			"Little Cat", "Housecat", "Jaguar", "Lynx", "Panther", "Large Cat", "Tiger",
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
			"Mimic", "Large Mimic", "Giant Mimic",
			// nymphs - 68-70
			"Wood Nymph", "Water Nymph", "Mountain Nymph",
			// goblins - 71-78
			"Goblin", "Hobgoblin", "Orc?", "Hill Orc", "Mordor Orc", "Uruk-Hai", "Orc Shaman", "Orc Captain",
			// piercers - 79-81
			"Rock Piercer", "Iron Piercer", "Glass Piercer",
			// quadrupeds - 82-88
			"Rothe", "Mumak", "Leocrotta", "Wumpus", "Baluchitherium", "Titanothere", "Mammoth",
			// rats - 89-94
			"Sewer Rat", "Giant Rat", "Rabit Rat", "Wererat", "Rock Mole", "Groundhog",
			// polypods - 95-98
			"Cave Spider", "Giant Millipede", "Giant Spider", "Scorpion",
			// trappers - 99-100
			"Lurker Above", "Trapper",
			// unicorns - 101-103
			"White Unicorn", "Gray Unicorn", "Black Unicorn",
			// horses - 104-106
			"Pony", "Horse", "War Horse",
			// clouds - 107-112
			"Fog Cloud", "Dust Vortex", "Ice Vortex", "Energy Vortex", "Steam Vortex", "Fire Vortex",
			// worms - 113-116
			"Baby Long Worm", "Baby Purple Worm", "Long Worm", "Purple Worm",
			// exotic insects - 117-118
			"Grid Bug", "Xan",
			// lights - 119-120
			"Yellow Light", "Black Light",
			// zruty - 121
			"Zruty",
			// angels - 122-126
			"Coatl", "Aleax", "Angel", "Ki-Rin", "Archon",
			// bats - 127-130
			"Bat", "Giant Bat", "Raven", "Vampire Bat",
			// centaurs - 131-133
			"Plains Centaur", "Mountain Centaur", "Forest Centaur",
			// baby dragons - 134-143
			"Baby Gray Dragon", "Baby Silver Dragon", "Baby Shining Dragon?", "Baby Red Dragon", "Baby White Dragon", "Baby Orange Dragon", "Baby Black Dragon", "Baby Blue Dragon", "Baby Green Dragon", "Baby Yellow Dragon",
			// dragons - 144-153
			"Gray Dragon", "Silver Dragon", "Shining Dragon?", "Red Dragon", "White Dragon", "Orange Dragon", "Black Dragon", "Blue Dragon", "Green Dragon", "Yellow Dragon",
			// elementals - 154-158
			"Stalker", "Air Elemental", "Fire Elemental", "Earth Elemental", "Water Elemental",
			// fungi - 159-165
			"Lichen", "Brown Mold", "Yellow Mold", "Green Mold", "Red Mold", "Shrieker", "Violet Mold",
			// gnomes - 166-169
			"Gnome", "Gnome Lord", "Gnome Wizard", "Gnome King",
			// giant - 170-178
			"Giant", "Stone Giant", "Hill Giant", "Fire Giant", "Frost Giant", "Storm Giant", "Ettin", "Titan", "Minotaur",
			// jabberwockoids - 179-180
			"Jabberwock", "[green jabberwock?]",
			// keystone kops - 181-184
			"[kop1]", "[kop1]", "[kop2]", "[kop3]",
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
			"Garter Snake", "Snake", "Water Moccassin", "Viper", "Python", "Cobra",
			// trolls - 221-225
			"Troll", "Ice Troll", "Rock Troll", "Water Troll", "Olog-Hai",
			// 226
			"Umber Hulk",
			// 227-230
			"Vampire", "Vampire Lord", "[vampire3]", "Vlad the Impaler",
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
			"Wererat_Human", "Werejackal_Human", "Werewolf_Human", "[werecreature4]",
			// elves - 266-271
			"Elf", "Wood Elf", "Green Elf", "Gray Elf", "Elf Lord", "Elvenking",
			// 272
			"Doppleganger",
			// human civilians - 273-279
			"Nurse", "Shopkeeper", "Guard", "Prisoner", "Oracle", "Priest", "High Priest",
			// soldiers - 280-285
			"Soldier", "Sergeant", "Lieutenant", "Captain", "Watchman", "Watch Captain",
			// 286-289
			"Medusa", "Wizard of Yendor", "Croesus?", "?",
			// ghosts - 290-291
			"Ghost", "Shade",
			// 292
			"Water Demon",
			// devils - 293-305
			"Horned Devil", "Succubus", "Incubus", "Erinys", "Barbed Devil", "Marilith", "Vrock", "Hezrou", "Bone Devil?", "Ice Devil", "Nalfeshnee", "Pit Fiend", "Balrog",
			// demon princes - 306-313
			"Juiblex", "Yeenoghu", "Orcus", "Geryon", "Dispater", "Beelzebub", "Asmodeus", "Demogorgon",
			// riders - 314-316
			"Death", "Pestilence", "Famine",
			// 317-319
			"?", "Genie", "?",
			// marine - 320-325
			"Jellyfish", "Piranha", "Shark", "Giant Eel", "Electric Eel", "Kraken",
			// lizards - 326-333
			"Newt", "Gecko", "Iguana", "Baby Crocodile", "Lizard", "?", "Crocodile", "Salamader",
			// 334
			"Long Worm Tail",
			// roles - 335-?
			"Archaeologist", 		"Barbarian", 	"Caveman", "Cavewoman", 					"Healer", 		"Knight", 		"Monk", 		"Priest", "?", 	"Ranger", 	"Rogue", 				"Samurai", 			"Tourist", 		"Valkyrie", 	"Wizard",
			// quest leaders
			"[QuestLead1]?",
			"Lord Carnarvon", 		"Pelias", 		"Shaman Karnov", 	"QLead2?", "QLead3?", 	"Hippocrates", 	"King Arthur", 	"Grand Master", "Arch Priest", 	"Orion", 	"Master of Thieves", 	"Lord Sato", 		"Twoflower", 	"Norn", 		"Neferet the Green",
			// quest nemeses
			"Minion of Huhetotl", 	"Thoth Amon", 	"Chromatic Dragon", "Goblinking?", 			"Cyclops", 		"Ixoth", 		"Master Kaen", 	"Nalzok", 		"Scorpius", "Master Assassin", 		"Ashikaga Takauji", 				"Lord Surtur", 	"The Dark One",
			// quest guardians
			"Student", 				"Chieftan", 	"Neanderthal", 								"Attendant", 	"Page", 		"Abbot", 		"Acolyte", 		"Hunter", 	"Thug", 				"Roshi", 			"Guide", 		"Warrior", 		"Apprentice"
		];

		createTiles(monsterNamesInTileOrder, "", "", new Coords(0, 0));

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

		createTiles(emplacementNamesInTileOrder, "", "", new Coords(1, 21));

		for (var i = 0; i < tileNamesAndPositions.length; i++)
		{
			var tileNameAndPosition = tileNamesAndPositions[i];
			var tileName = tileNameAndPosition[0];
			var tilePos = tileNameAndPosition[1];

			var visual = visualsForTiles[tilePos.y][tilePos.x];
			visual.name = tileName;
			returnValue.push(visual);
			returnValue[tileName] = visual;
		}

		var agentNames = this.parent.demoDataMovers.buildAgentDatas();

		var tilePos = new Coords(0, 0);
		var imageSizeInTiles = new Coords(40, 27);

		for (var i = 0; i < agentNames.length; i++)
		{
			var tileName = agentNames[i][0];
			var visual = visualsForTiles[tilePos.y][tilePos.x];
			visual.name = tileName;
			returnValue.push(visual);
			returnValue[tileName] = visual;

			tilePos.x++;

			if (tilePos.x >= imageSizeInTiles.x)
			{
				tilePos.y++;
				tilePos.x = 0;
			}
		}

		var imagesForReticlesClockwiseFromE = [];

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

		for (var i = 0; i < reticlePixelSetsAsStringArrays.length; i++)
		{
			var imageName = "Reticle" + i;

			var pixelsAsStrings = reticlePixelSetsAsStringArrays[i];

			var imageForReticle = this.parent.imageBuilder.buildImageFromStrings
			(
				imageName,
				pixelsAsStrings
			);
			var visualForReticle = new VisualImageImmediate(imageForReticle);

			returnValue[imageName] = visualForReticle;
		}

		return returnValue;
	}
}
