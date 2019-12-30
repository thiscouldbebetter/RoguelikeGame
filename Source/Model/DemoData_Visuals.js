
// partial class DemoData
{
	DemoData.prototype.buildVisualLookup = function(visualsForTiles)
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

			// emplacements

			[ "Altar", new Coords(15, 21) ],
			[ "Blood", new Coords(3, 4) ],
			[ "Door", new Coords(4, 21) ],
			[ "Gravestone", new Coords(16, 21) ],
			[ "StairsUp", new Coords(11, 21) ],
			[ "StairsDown", new Coords(12, 21) ],

			// items - unsorted

			[ "Chest", new Coords(34, 9) ],
			[ "Coins", new Coords(29, 19) ],
			[ "Corpse", new Coords(36, 15) ],

			// items - amulets

			[ "Circular Amulet", new Coords(14, 14) ],
			[ "Spherical Amulet", new Coords(15, 14) ],
			[ "Oval Amulet", new Coords(16, 14) ],
			[ "Triangular Amulet", new Coords(17, 14) ],
			[ "Pyramidal Amulet", new Coords(18, 14) ],
			[ "Square Amulet", new Coords(19, 14) ],
			[ "Concave Amulet", new Coords(20, 14) ],
			[ "Hexagonal Amulet", new Coords(21, 14) ],
			[ "Octagonal Amulet", new Coords(22, 14) ],
			[ "Plastic Imitation Amulet of Yendor", new Coords(23, 14) ],
			[ "Amulet of Yendor", new Coords(24, 14) ],

			// items - foods

			[ "Eucalyptus Leaf", new Coords(3, 16) ],
			[ "Apple", new Coords(4, 16) ],
			[ "Orange", new Coords(5, 16) ],
			[ "Pear", new Coords(6, 16) ],
			[ "Melon", new Coords(7, 16) ],
			[ "Banana", new Coords(8, 16) ],
			[ "Carrot", new Coords(9, 16) ],
			[ "Sprig of Wolfsbane", new Coords(10, 16) ],
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

			// items - potions

			[ "Ruby Potion", new Coords(24, 16) ],
			[ "Pink Potion", new Coords(25, 16) ],
			[ "Orange Potion", new Coords(26, 16) ],
			[ "Yellow Potion", new Coords(27, 16) ],
			[ "Emerald Potion", new Coords(28, 16) ],
			[ "Dark Green Potion", new Coords(29, 16) ],
			[ "Sky Blue Potion", new Coords(30, 16) ],
			[ "Cyan Potion", new Coords(31, 16) ],
			[ "Brilliant Blue Potion", new Coords(32, 16) ],
			[ "Magenta Potion", new Coords(33, 16) ],
			[ "Purple-Red Potion", new Coords(34, 16) ],
			[ "Puce Potion", new Coords(35, 16) ],
			[ "Milky Potion", new Coords(36, 16) ],
			[ "Swirly Potion", new Coords(37, 16) ],
			[ "Bubbly Potion", new Coords(38, 16) ],
			[ "Smoky Potion", new Coords(39, 16) ],
			[ "Cloudy Potion", new Coords(39, 16) ],
			[ "Effervescent Potion", new Coords(0, 17) ],
			[ "Black Potion", new Coords(1, 17) ],
			[ "Golden Potion", new Coords(2, 17) ],
			[ "Brown Potion", new Coords(3, 17) ],
			[ "Fizzy Potion", new Coords(4, 17) ],
			[ "Dark Potion", new Coords(5, 17) ],
			[ "White Potion", new Coords(6, 17) ],
			[ "Murky Potion", new Coords(7, 17) ],
			[ "Clear Potion", new Coords(8, 17) ],

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

			// items - rings

			[ "Wooden Ring", new Coords(26, 13) ],
			[ "Granite Ring", new Coords(27, 13) ],
			[ "Moonstone Ring", new Coords(28, 13) ],
			[ "Clay Ring", new Coords(29, 13) ],
			[ "Shiny Ring", new Coords(30, 13) ],
			[ "Black Onyx Ring", new Coords(31, 13) ],
			[ "Opal Ring", new Coords(32, 13) ],
			[ "Tiger Eye Ring", new Coords(33, 13) ],
			[ "Emerald Ring", new Coords(34, 13) ],
			[ "Bronze Ring", new Coords(35, 13) ],
			[ "Topaz Ring", new Coords(36, 13) ],
			[ "Agate Ring", new Coords(37, 13) ],
			[ "Sapphire Ring", new Coords(38, 13) ],
			[ "Ruby Ring", new Coords(39, 13) ],
			[ "Diamond Ring", new Coords(0, 14) ],
			[ "Pearl Ring", new Coords(1, 14) ],
			[ "Iron Ring", new Coords(2, 14) ],
			[ "Brass Ring", new Coords(3, 14) ],
			[ "Copper Ring", new Coords(4, 14) ],
			[ "Twisted Ring", new Coords(5, 14) ],
			[ "Steel Ring", new Coords(6, 14) ],
			[ "Silver Ring", new Coords(7, 14) ],
			[ "Gold Ring", new Coords(8, 14) ],
			[ "Ivory Ring", new Coords(9, 14) ],
			[ "Jade Ring", new Coords(10, 14) ],
			[ "Wire Ring", new Coords(11, 14) ],
			[ "Engagement Ring", new Coords(12, 14) ],
			[ "Coral Ring", new Coords(13, 14) ],

			// items - scrolls

			[ "Scroll Titled 'Andova Begarin'", new Coords(10, 17) ],
			[ "Scroll Titled 'Daiyen Fooels'", new Coords(11, 17) ],
			[ "Scroll Titled 'Duam Xnaht'", new Coords(12, 17) ],
			[ "Scroll Titled 'Eblib Yloh'", new Coords(13, 17) ],
			[ "Scroll Titled 'Elam Ebow'", new Coords(14, 17) ],
			[ "Scroll Titled 'Foobie Bletch'", new Coords(15, 17) ],
			[ "Scroll Titled 'Garven Deh'", new Coords(16, 17) ],
			[ "Scroll Titled 'Hackem Muche'", new Coords(17, 17) ],
			[ "Scroll Titled 'Juyed Awk Yacc'", new Coords(18, 17) ],
			[ "Scroll Titled 'Kernod Wel'", new Coords(19, 17) ],
			[ "Scroll Titled 'Kirje'", new Coords(20, 17) ],
			[ "Scroll Titled 'Lep Gex Ven Zea'", new Coords(21, 17) ],
			[ "Scroll Titled 'NR 9'", new Coords(22, 17) ],
			[ "Scroll Titled 'Pratyavayah'", new Coords(23, 17) ],
			[ "Scroll Titled 'Prirutsenie'", new Coords(24, 17) ],
			[ "Scroll Titled 'Read Me'", new Coords(25, 17) ],
			[ "Scroll Titled 'Temov'", new Coords(26, 17) ],
			[ "Scroll Titled 'Tharr'", new Coords(27, 17) ],
			[ "Scroll Titled 'Ve Forbryderne'", new Coords(28, 17) ],
			[ "Scroll Titled 'Velox Neb'", new Coords(29, 17) ],
			[ "Scroll Titled 'Venzar Borgavve'", new Coords(30, 17) ],
			[ "Scroll Titled 'Verr Yed Horre'", new Coords(31, 17) ],
			[ "Scroll Titled 'Xixaxa Xoxaxa Xuxaxa'", new Coords(32, 17) ],
			[ "Scroll Titled 'Yum Yum'", new Coords(33, 17) ],
			[ "Scroll Titled 'Zelgo Mer'", new Coords(34, 17) ],

			// items - spellbooks

			[ "Parchment Spellbook", new Coords(37, 17) ],
			[ "Vellum Spellbook", new Coords(38, 17) ],
			[ "Ragged Spellbook", new Coords(39, 17) ],
			[ "Dogeared Spellbook", new Coords(0, 18) ],
			[ "Mottled Spellbook", new Coords(1, 18) ],
			[ "Stained Spellbook", new Coords(2, 18) ],
			[ "Cloth Spellbook", new Coords(3, 18) ],
			[ "Leather Spellbook", new Coords(4, 18) ],
			[ "White Spellbook", new Coords(5, 18) ],
			[ "Pink Spellbook", new Coords(6, 18) ],
			[ "Red Spellbook", new Coords(7, 18) ],
			[ "Orange Spellbook", new Coords(8, 18) ],
			[ "Yellow Spellbook", new Coords(9, 18) ],
			[ "Velvet Spellbook", new Coords(10, 18) ],
			[ "Light Green Spellbook", new Coords(11, 18) ],
			[ "Dark Green Spellbook", new Coords(12, 18) ],
			[ "Turquoise Spellbook", new Coords(13, 18) ],
			[ "Cyan Spellbook", new Coords(14, 18) ],
			[ "Light Blue Spellbook", new Coords(15, 18) ],
			[ "Dark Blue Spellbook", new Coords(16, 18) ],
			[ "Indigo Spellbook", new Coords(17, 18) ],
			[ "Magenta Spellbook", new Coords(18, 18) ],
			[ "Purple Spellbook", new Coords(19, 18) ],
			[ "Violet Spellbook", new Coords(20, 18) ],
			[ "Tan Spellbook", new Coords(21, 18) ],
			[ "Plaid Spellbook", new Coords(22, 18) ],
			[ "Light Brown Spellbook", new Coords(23, 18) ],
			[ "Dark Brown Spellbook", new Coords(24, 18) ],
			[ "Gray Spellbook", new Coords(25, 18) ],
			[ "Wrinkled Spellbook", new Coords(26, 18) ],
			[ "Dusty Spellbook", new Coords(27, 18) ],
			[ "Bronze Spellbook", new Coords(28, 18) ],
			[ "Copper Spellbook", new Coords(29, 18) ],
			[ "Silver Spellbook", new Coords(30, 18) ],
			[ "Gold Spellbook", new Coords(31, 18) ],
			[ "Glittering Spellbook", new Coords(32, 18) ],
			[ "Shining Spellbook", new Coords(33, 18) ],
			[ "Dull Spellbook", new Coords(34, 18) ],
			[ "Thin Spellbook", new Coords(35, 18) ],
			[ "Thick Spellbook", new Coords(36, 18) ],

			// items - stones

			[ "White Gem", new Coords(27, 19) ],
			[ "White Gem", new Coords(28, 19) ],
			[ "Red Gem", new Coords(29, 19) ],
			[ "Orange Gem", new Coords(30, 19) ],
			[ "Blue Gem", new Coords(31, 19) ],
			[ "Black Gem", new Coords(32, 19) ],
			[ "Green Gem", new Coords(33, 19) ],
			[ "Green Gem", new Coords(34, 19) ],
			[ "Yellow Gem", new Coords(35, 19) ],
			[ "Green Gem", new Coords(36, 19) ],
			[ "Brownish Gem", new Coords(37, 19) ],
			[ "Brownish Gem", new Coords(38, 19) ],
			[ "Black Gem", new Coords(39, 19) ],
			[ "White Gem", new Coords(0, 20) ],
			[ "Yellow Gem", new Coords(1, 20) ],
			[ "Red Gem", new Coords(2, 20) ],
			[ "Violet Gem", new Coords(3, 20) ],
			[ "Red Gem", new Coords(4, 20) ],
			[ "Violet Gem", new Coords(5, 20) ],
			[ "Black Gem", new Coords(6, 20) ],
			[ "Orange Gem", new Coords(7, 20) ],
			[ "Green Gem", new Coords(8, 20) ],
			[ "White Gem", new Coords(9, 20) ],
			[ "Blue Gem", new Coords(10, 20) ],
			[ "Red Gem", new Coords(11, 20) ],
			[ "Brownish Gem", new Coords(12, 20) ],
			[ "Orange Gem", new Coords(13, 20) ],
			[ "Yellow Gem", new Coords(14, 20) ],
			[ "Black Gem", new Coords(15, 20) ],
			[ "Green Gem", new Coords(16, 20) ],
			[ "Violet Gem", new Coords(17, 20) ],
			[ "Gray Stone", new Coords(18, 20) ],
			[ "Gray Stone", new Coords(19, 20) ],
			[ "Gray Stone", new Coords(20, 20) ],
			[ "Gray Stone", new Coords(21, 20) ],
			[ "Rock", new Coords(22, 20) ],

			// items - wands

			[ "Glass Wand", new Coords(39, 18) ],
			[ "Balsa Wand", new Coords(0, 19) ],
			[ "Crystal Wand", new Coords(1, 19) ],
			[ "Maple Wand", new Coords(2, 19) ],
			[ "Pine Wand", new Coords(3, 19) ],
			[ "Oak Wand", new Coords(4, 19) ],
			[ "Ebony Wand", new Coords(5, 19) ],
			[ "Marble Wand", new Coords(6, 19) ],
			[ "Tin Wand", new Coords(7, 19) ],
			[ "Brass Wand", new Coords(8, 19) ],
			[ "Copper Wand", new Coords(9, 19) ],
			[ "Silver Wand", new Coords(10, 19) ],
			[ "Platinum Wand", new Coords(11, 19) ],
			[ "Iridium Wand", new Coords(12, 19) ],
			[ "Zinc Wand", new Coords(13, 19) ],
			[ "Aluminum Wand", new Coords(14, 19) ],
			[ "Uranium Wand", new Coords(15, 19) ],
			[ "Iron Wand", new Coords(16, 19) ],
			[ "Steel Wand", new Coords(17, 19) ],
			[ "Hexagonal Wand", new Coords(18, 19) ],
			[ "Short Wand", new Coords(19, 19) ],
			[ "Runed Wand", new Coords(20, 19) ],
			[ "Long Wand", new Coords(21, 19) ],
			[ "Curved Wand", new Coords(22, 19) ],
			[ "Forked Wand", new Coords(23, 19) ],
			[ "Spiked Wand", new Coords(24, 19) ],
			[ "Jeweled Wand", new Coords(25, 19) ],

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

			// movers

			[ "Rogue", new Coords(25, 8) ],
			[ "Player1", new Coords(26, 8) ],
			[ "Player2", new Coords(27, 8) ],

			[ "Goblin", new Coords(32, 1) ],
		];

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

		var agentNames = this.buildAgentDatas();

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

			var imageForReticle = this.imageBuilder.buildImageFromStrings
			(
				imageName,
				pixelsAsStrings
			);
			var visualForReticle = new VisualImageImmediate(imageForReticle);

			returnValue[imageName] = visualForReticle;
		}

		return returnValue;
	};
}
