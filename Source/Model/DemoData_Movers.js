
// partial class DemoData
{
	DemoData.prototype.buildEntityDefnGroups_Movers = function(visuals, activityDefns, itemCategories)
	{
		var returnValues = [];

		var sizeInPixels = visuals["Floor"].size;

		this.buildEntityDefnGroups_Movers_Player
		(
			visuals, activityDefns, itemCategories, returnValues
		);

		var rot = function(universe, world, place, entityTurnable)
		{
			var turnable = entityTurnable.Turnable;
			if (turnable.turnsToLive == null)
			{
				turnable.turnsToLive = 30;
			}
			else
			{
				turnable.turnsToLive--;
				if (turnable.turnsToLive <= 0)
				{
					place.entitiesToRemove.push(entityTurnable);
				}
			}
		};

		var dieAndDropCorpse = function(universe, world, place, entityDying)
		{
			var itemDefnCorpse = entityDying.MoverDefn.itemDefnCorpse;
			entityDying.Locatable.loc.pos.z = PlaceLevel.ZLayers.Items;
			var entityCorpse = new Entity
			(
				itemDefnCorpse.name + universe.idHelper.idNext(),
				[
					entityDying.Locatable,
					new Item(itemDefnCorpse.name, 1),
					collidableDefns.Open,
					new Drawable(visuals["Corpse"]),
					//itemDefnCorpse
					new Turnable(rot)
				]
			);

			place.entitiesToSpawn.push(entityCorpse);
		};

		// agents

		var itemHolder = new ItemHolder();

		var agentDatas = this.buildAgentDatas();

		for (var i = 0; i < agentDatas.length; i++)
		{
			var agentData = agentDatas[i];
			var agentName = agentData[0];
			var difficulty = agentData[1];
			var movesPerTurn = agentData[6];

			var itemDefnCorpse = new ItemDefn
			(
				agentName + " Corpse", // name
				agentName + " Corpse", // appearance?
				1, // mass
				1, // stackSizeMax,
				1, // relativeFrequency
				[], // categoryNames
				ItemDefn.InitializeDevice,
				ItemDefn.UseDevice
			);

			var entityDefnForAgent = new Entity
			(
				agentName,
				// properties
				[
					new ActorDefn(activityDefns["Move Toward Player"].name),
					collidableDefns.Transparent,
					itemHolder,
					//new EquippableDefn(equipmentSocketDefnSetBiped),
					new EnemyDefn(),
					new Killable(5, null),
					new MoverDefn
					(
						agentName,
						difficulty,
						10, // movesPerTurn
						new MoverData_Demographics(null, null),
						new MoverData_Skills([]),
						new MoverData_Spells([]),
						new MoverData_Traits(10, 10, 10, 10, 10),
						new MoverDefn_Vitals(20, 1000),
						itemDefnCorpse,
						dieAndDropCorpse,
						// attributeGroups
						[
							// todo
						]
					),

					new Drawable(visuals[agentName], 1),
				]
			);

			returnValues.push(entityDefnForAgent);
			returnValues[agentName] = entityDefnForAgent;
		}

		var entityGroupAgents = new EntityDefnGroup
		(
			"Agents",
			0, // relativeFrequency
			returnValues
		);

		var groups = [ entityGroupAgents ];

		var entityDefnGroupsByDifficulty = [];

		for (var i = 0; i < returnValues.length; i++)
		{
			var entityDefnForAgent = returnValues[i];
			var difficulty = (entityDefnForAgent.MoverDefn == null ? null : entityDefnForAgent.MoverDefn.difficulty);
			if (difficulty != null)
			{
				var entityDefnGroupForDifficulty = entityDefnGroupsByDifficulty[difficulty];
				if (entityDefnGroupForDifficulty == null)
				{
					entityDefnGroupForDifficulty = new EntityDefnGroup
					(
						"AgentsOfDifficulty" + difficulty,
						0, // relativeFrequency
						[]
					);
					entityDefnGroupsByDifficulty[difficulty] = entityDefnGroupForDifficulty;
					groups.push(entityDefnGroupForDifficulty);
				}

				entityDefnGroupForDifficulty.entityDefns.push(entityDefnForAgent);
			}
		}

		return groups;
	};

	DemoData.prototype.buildEntityDefnGroups_Movers_Player = function
	(
		visuals, activityDefns, itemCategories, returnValues
	)
	{
		var sizeInPixels = visuals["Floor"].size;
		var skillDefns = this.buildSkillDefns();
		var spellDefns = this.buildSpellDefns();
		var traitDefns = this.buildTraitDefns();

		var equipmentSocketDefnSetBiped = this.buildEntityDefns_Items_EquipmentSocketDefnSet
		(
			itemCategories
		);

		var moverDefnPlayer = new MoverDefn
		(
			"Player",
			999, // difficulty
			9, // movesPerTurn
			new MoverData_Demographics("Human", "Rogue", 1),
			new MoverData_Traits
			([
				new Trait(traitDefns["Strength"], 10),
				new Trait(traitDefns["Dexterity"], 10),
				new Trait(traitDefns["Willpower"], 10),
				new Trait(traitDefns["Constitution"], 10),
				new Trait(traitDefns["Charisma"], 10),
			]),
			new MoverData_Skills(skillDefns),
			new MoverData_Spells(spellDefns),
			new MoverDefn_Vitals(20, 1000),
			null, // itemDefnCorpse
			function die() {}, // todo
			[] // attributeGroups
		);

		var visualForPlayerBase = visuals["Rogue"];

		var visualReticleDirectional = new VisualDirectional
		(
			new VisualNone(), // visualForNoDirection
			[
				visuals["Reticle0"],
				visuals["Reticle1"],
				visuals["Reticle2"],
				visuals["Reticle3"],
				visuals["Reticle4"],
				visuals["Reticle5"],
				visuals["Reticle6"],
				visuals["Reticle7"],
			]
		);

		var visualForPlayer = new VisualGroup
		([
			visualForPlayerBase,
			//visuals["Reticle0"]
			visualReticleDirectional
		]);

		var drawableDefnPlayer = new Drawable(visualForPlayer);

		var activityDefnName =
			activityDefns["Accept User Input"].name;
			//activityDefns["Demo User Input"].name;

		var entityName = Player.name;
		var entityDefnPlayer = new Entity
		(
			entityName,
			// properties
			[
				new ActorDefn(activityDefnName),
				collidableDefns.Transparent,
				new ItemHolder(),
				drawableDefnPlayer,
				new EquippableDefn(equipmentSocketDefnSetBiped),
				new Killable(160, null),
				moverDefnPlayer,
				new Player
				(
					8 // sightRange
				),
			]
		);

		returnValues.push(entityDefnPlayer);
		returnValues[entityName] = entityDefnPlayer;
	};

	DemoData.prototype.buildAgentDatas = function()
	{
		// resistances

		var acid = "acid";
		var aggravate = "aggravate";
		var cold = "cold";
		var disintegrate = disintegrate;
		var fire = "fire";
		var petrify = "petrify";
		var poison = "poison";
		var shock = "shock";
		var sleep = "sleep";
		var stun = "stun";
		var telepathy = "telepathy";

		// sizes

		var tiny = 0;
		var small = 1;
		var medium = 2;
		var large = 3;
		var huge = 4;

		// corpse drop frequency at http://www.steelypips.org/nethack/343/mon2-343.html

		var agentDatas =
		[
			// name, difficulty, numberAppearing, attacks, baseLevel, baseExperience,
			// speed, base ac, base mr, alignment, frequency, genocidable,
			// weight, nutrition, size, resistances, resistancesConveyed

			// insects

			[ "Giant Ant", 		4, "1d3", [ "Bite:1d4" ], 		2, 20, 18, 3, 0, 	0, 3, true, 10, 10, 	tiny, null, 		.33, 	null ],
			[ "Killer Bee",		5, "2d6", [ "Sting:1d3" ],		1, 31, 18, -1, 0,	0, 2, true, 1, 5, 	tiny, [ poison ], 	.33, 	[ poison, 1 ] ],
			[ "Soldier Ant",	6, "1d3", [ "Bite:2d4", "Sting:3d4" ], 	3, 37, 18, 3, 0, 	0, 2, true, 20, 5, 	tiny, [ poison ], 	.33, 	[ poison, 1 ] ],
			[ "Fire Ant", 		6, "1d3", [ "Bite:2d4", "Sting:2d4" ],	3, 34, 18, 3, 10, 	0, 1, true, 30, 10, 	tiny, [ fire ], 	.25,	[ fire, 1 ] ],
			[ "Giant Beetle",	6, "1", [ "Bite:3d6" ],			5, 56, 6, 4, 0,		0, 3, true, 10, 10,	large, [ poison ], 	1, 	[ poison, 1 ], ],
			[ "Queen Bee",		12, "1", [ "Sting:1d8" ], 		9, 225, 24, -4, 0, 	0, 0, true, 1, 5, 	tiny, [ poison ], 	.25, 	[ poison, 1 ] ],

			// blobs

			[ "Acid Blob", 		2, "1", [ "Acid:1d8"  ],		1, 9, 3, 8, 0,		0, 2, true, 30, 10, 	tiny, [sleep, poison, acid, petrify], 			.33, 	null ],
			[ "Quivering Blob", 	6, "1", [ "Touch:1d8" ],		5, 59, 1, 8, 0, 	0, 2, true, 200, 100, 	small, [sleep, poison], 				.50, 	[ poison, 1 ] ],
			[ "Gelatinous Cube", 	8, "1", [ "Touch:2d4","Paralyze:1d4"],6, 76, 6, 8, 0, 	0, 2, true, 600, 150, 	large, [ fire, cold, shock, sleep, poison, acid, petrify], 	1, 	[ fire, 1, cold, 1, shock, 1, sleep, 1 ] ],

			// cockatrices

			[ "Chickatrice", 	7, "1d3", [ "Bite:1d2" ],		4, 136, 4, 8, 30,	0, 1, true, 10, 10, 	tiny, [ poison, petrify ], 	.25, [ poison, 1 ] ],
			[ "Cockatrice", 	7, "1", [ "Bite:1d3" ],			5, 149, 6, 6, 30,	0, 5, true, 30, 30, 	small, [ poison, petrify ], 	.50, [ poison, 1 ] ],
			[ "Pyrolisk", 		8, "1", [ "Gaze:2d6" ],			6, 82, 6, 6, 30,	0, 1, true, 30, 30,	small, [ fire, poison ], 	.33, [ fire, 1, poison, 1 ] ],

			// canines

			[ "Jackal", 		1, "1d3", [ "Bite:1d2" ],		0, 1, 12, 7, 0, 	0, 3, true, 300, 250, 	small, null, .50, null ],
			[ "Fox",		1, "1", [ "Bite:1d3" ],			0, 4, 15, 7, 0, 	0, 1, true, 300, 250, 	small, null, .33, null ],
			[ "Coyote", 		2, "1d3", [ "Bite:1d4" ],		1, 8, 12, 7, 0,		0, 1, true, 300, 250, 	small, null, .33, null ],
			[ "Werejackal" ],
			[ "Little Dog",		3, "1", [ "Bite:1d6" ],			3, 2, 20, 18, 6,	0, 1, true, 150, 150, 	small, null, .33, null ],
			[ "Dog",		5, "1", [ "Bite:1d6" ], 		4, 4, 44, 16, 0, 	0, 1, true, 400, 200, 	medium, null, .33, [ aggravate, 1 ] ],
			[ "Large Dog",		7, "1", [ "Bite:2d4" ],			6, 76, 15, 4, 0, 	0, 1, true, 800, 250, 	medium, null, .33, null ],
			[ "Dingo",		5, "1", [ "Bite:1d5" ],			4, 44, 16, 5, 0,	0, 1, true, 400, 200, 	medium, null, .33, null ],
			[ "Wolf",		6, "1d3", [ "Bite:2d4" ], 		6, 56, 12, 4, 0, 	0, 2, true, 500, 250, 	medium, null, .50, null ],
			[ "Werewolf" ],
			[ "Warg",		8, "1d3", [ "Bite:2d6" ],		7, 92, 12, 4, 0, 	-5, 2, true, 850, 350, 	medium, null, 		.50, null ],
			[ "Winter Wolf Cub", 	7, "1d3", [ "Bite:1d8", "Breath:1d8" ],	5, 64, 12, 4, 0, 	-5, 2, true, 250, 200, 	small, [ cold ], 	.50, [ cold, .33 ] 	],
			[ "Winter Wolf",	9, "1", [ "Bite:2d6", "Breath:2d6" ],	7, 102, 12, 4, 20, 	0, 1, true, 700, 300, 	large, [ cold ], 	1, [ cold, .47 ]	],
			[ "Hell Hound Pup",	9, "1d3", [ "Bite:2d6", "Breath:2d6" ],	9, 102, 12, 4, 20, 	-5, 1, true, 200, 200, 	small,	[ fire ], 	.33, [ fire, .47 ] ],
			[ "Hell Hound",		14, "1", [ "Bite:3d6", "Breath:3d6"],	12, 290, 14, 2, 20, 	0, 1, true, 600, 300, 	medium,	[ fire ], 	.33, [ fire, .80 ] ],
			[ "Cerberus" ],

			// eyes and spheres

			[ "Gas Spore", 		2, "1", [ "Explode:4d6" ],		2, 1, 12, 3, 10,  	0, 1, true, 10, 10, 	small, null, 0, null 		],
			[ "Floating Eye", 	3, "1", [ ], 				2, 17, 1, 9, 10, 	0, 5, true, 10, 10, 	small, null, .50, [ telepathy, 1] 	],
			[ "Flaming Sphere",	3, "1", [ "Explode:4d6" ],		6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ cold ], 0, null ],
			[ "Freezing Sphere",	3, "1", [ "Explode:4d6" ],		6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ fire ], 0, null ],
			[ "Shocking Sphere",	3, "1", [ "Explode:4d6" ],		6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ shock ], 0, null ],
			[ "Beholder" ],

			// felines

			[ "Kitten", 		3, "1", [ "Bite:1d6" ], 		2, 20, 18, 6, 0, 	0, 1, true, 150, 150, 	small, null, .33, null ],
			[ "Housecat",		5, "1", [ "Bite:1d6" ], 		4, 44, 16, 5, 0, 	0, 1, true, 200, 200, 	small, null, .33, null ],
			[ "Jaguar",		6, "1", [ "Claw:1d4", "Bite:1d8" ],	4, 44, 15, 6, 0, 	0, 2, true, 600, 300, 	large, null, 1, null ],
			[ "Lynx",		7, "1", [ "Claw:1d4", "Bite:1d10" ], 	5, 59, 15, 6, 0,	0, 1, true, 600, 300, 	large, null, .33, null ],
			[ "Panther", 		7, "1", [ "Claw:1d6", "Bite:1d10" ], 	5, 59, 15, 6, 0,	0, 1, true, 600, 300, 	large, null, 1, null ],
			[ "Large Cat",		7, "1", [ "Bite:2d4" ], 		6, 76, 15, 4, 0, 	0, 1, true, 250, 250, 	small, null, .33, null ],
			[ "Tiger",		8, "1", [ "Claw:2d4", "Bite:1d10" ], 	6, 73, 12, 6, 0,	0, 2, true, 600, 300, 	large, null, 1, null ],

			// gremlins and gargoyles

			[ "Gremlin" ], // .50
			[ "Gargoyle" ], // .50
			[ "Winged Gargoyle" ], // .33

			// humanoids

			[ "Hobbit", 		2, "1", [ "Weapon:1d6" ], 		1, 13, 9, 10, 0, 	6, 2, true, 500, 200, 	small, null, .50, null ],
			[ "Dwarf", 		4, "1", [ "Weapon:1d8" ],		2, 22, 6, 10, 10, 	4, 3, true, 900, 300, 	medium, null, .50, null ],
			[ "Bugbear" ], 		// 1.00
			[ "Dwarf Lord" ], 	// .50
			[ "Dwarf King" ], 	// .33
			[ "Mind Flayer" ],	// .33
			[ "Master Mind Flayer" ], // .33

			// minor demons

			[ "Manes", 		3, "2d6", [ "Claw:2x1d3", "Bite:1d4"], 1, 8, 3, 7, 0,		-7, 1, true, 100, 100, small, [ sleep, poison ], 0, null ],
			[ "Homunculus" ], // .33
			[ "Imp" ], // .25
			[ "Lemure" ], // 0
			[ "Quasit" ], // .50
			[ "Tengu" ], // .50

			// jellies

			[ "Blue Jelly" ], // .50
			[ "Spotted Jelly" ], // .33
			[ "Ochre Jelly" ], // .50

			// kobolds

			[ "Kobold", 		1, "1", [ "Weapon:1d4" ],		0, 6, 6, 10, 0, 	-2, 1, true, 400, 100, small, [ poison ], null ],
			[ "Large Kobold" ],
			[ "Kobold Lord" ],
			[ "Kobold Shaman" ],

			// leprechauns

			[ "Leprechaun" ],

			// mimics

			[ "Small Mimic", 	8, "1", [ "Claw:3d4" ],		7, 92, 3, 7, 0,		0, 2, true, 300, 200, medium, [ acid ], null ],
			[ "Large Mimic", 	9, "1", [ "Claw:3d4" ],		8, 113, 3, 7, 10,	0, 1, true, 600, 400, large, [ acid ], null ],
			[ "Giant Mimic", 	8, "1", [ "Claw:2x3d4" ],		9, 186, 3, 7, 20,	0, 1, true, 800, 500, large, [ acid ], null ],

			// nymphs

			[ "Wood Nymph", 	5, "1", [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ],
			[ "Water Nymph", 	5, "1", [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ],
			[ "Mountain Nymph", 	5, "1", [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ],

			// orcs

			[ "Goblin", 		1, "1", [ "Weapon:1d4" ], 		0, 6, 9, 10, 0, 	-3, 2, true, 400, 100, small, null, null ],
			[ "Hobgoblin", 		3, "1", [ "Weapon:1d6" ],		1, 13, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, null ],
			[ "Orc", 		3, "2d6", [ "Weapon:1d8" ], 		1, 13, 9, 10, 0, 	-3, 0, true, 850, 150, medium, null, null ],
			[ "Hill Orc",		4, "2d6", [ "Weapon:1d6" ],		2, 22, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, null ],
			[ "Mordor Orc" ],
			[ "Uruk-hai" ],
			[ "Orc Shaman" ],
			[ "Orc Captain" ],

			// piercer

			[ "Rock Piercer",	4, "1", [ "Bite:2d6" ],		3, 28, 1, 3, 0,		0, 4, true, 200, 200, small, null, null ],
			[ "Iron Piercer",	6, "1", [ "Bite:3d6" ],		5, 63, 1, 0, 0,		0, 2, true, 400, 300, medium, null, null ],
			[ "Glass Piercer",	9, "1", [ "Bite:4d6" ],		7, 106, 1, 0, 0,	0, 4, true, 400, 300, medium, [ acid ], null ],

			// quadrupeds

			[ "Rothe", 		4, "1", [ "Claw:1d3", "Bite:1d8" ],	2, 17, 9, 7, 0, 	0, 4, true, 400, 100, large, null, null ],
			[ "Mumak" ],
			[ "Leocrotta" ],
			[ "Wumpus" ],
			[ "Titanothere" ],
			[ "Baluchitherium" ],
			[ "Mastodon" ],

			// rodents

			[ "Sewer Rat", 		1, "1d3", [ "Bite:1d3" ],		0, 1, 12, 7, 0,		0, 1, true, 20, 12, 	tiny, null, null ],
			[ "Giant Rat",		2, "1d3", [ "Bite:1d3" ],		1, 8, 10, 7, 0, 	0, 2, true, 30, 30, 	tiny, null, null ],
			[ "Rabid Rat",		4, "1", [ "Bite:2d4" ],		2, 17, 12, 6, 0, 	0, 1, true, 30, 5, 	tiny, [ poison ], null ],
			[ "Wererat" ],
			[ "Rock Mole" ],
			[ "Woodchuck" ],

			// spiders and centipedes

			[ "Cave Spider", 	3, "1d3", [ "Bite:1d2" ],		1, 8, 12, 3, 0, 	0, 2, true, 50, 50, 	tiny, [ poison ], [ poison, .07 ] ],
			[ "Centipede" ],
			[ "Giant Spider" ],
			[ "Scorpion" ],

			// trappers, lurkers above
			[ "Lurker Above" ],
			[ "Trapper" ],

			// horses and unicorns
			[ "White Unicorn" ],
			[ "Gray Unicorn" ],
			[ "Black Unicorn" ],
			[ "Pony" ],
			[ "Horse" ],
			[ "Warhorse" ],

			// vortices

			[ "Fog Cloud", 		4, "1", [ "Suffocate:1d6" ],		3, 38, 1, 0, 0, 	0, 2, true, 0, 0, 	huge, [ sleep, poison, petrify ], null ],
			[ "Dust Vortex" ],
			[ "Ice Vortex" ],
			[ "Energy Vortex" ],
			[ "Steam Vortex" ],
			[ "Fire Vortex" ],

			// worms
			[ "Baby Long Worm" ],
			[ "Baby Purple Worm" ],
			[ "Long Worm" ],
			[ "Purple Worm" ],

			// fantastical insects
			[ "Grid Bug", 		1, "1d3", [ "Bite:0d0"],		0, 1, 12, 9, 0, 	0, 3, true, 15, 10, 	tiny, [ shock, poison ], null ],
			[ "Xan" ],

			// lights
			[ "Yellow Light", 	5, "1", [ ],				3, 44, 15, 0, 0, 	0, 4, true, 0, 0, 	small, [ fire, cold, shock, disintegrate, sleep, poison, acid, petrify ], null ],
			[ "Black Light" ],

			// zruties

			[ "Zruty" ],

			// angelic beings

			[ "Couatl" ],
			[ "Aleax" ],
			[ "Angel" ],
			[ "Ki-rin" ],
			[ "Archon" ],

			// bats and birds

			[ "Bat", 		2, "1", [ "Bite:1d4" ], 		0, 6, 22, 8, 0,		0, 1, true, 20, 20, 	tiny, null, [  ] ],
			[ "Giant Bat", 		3, "1", [ "Bite:1d6" ],		2, 22, 22, 7, 0, 	0, 2, true, 30, 30, 	small, null, [  ] ],
			[ "Raven" ],
			[ "Vampire Bat" ],

			// centaurs

			[ "Plains Centaur" ],
			[ "Forest Centaur" ],
			[ "Mountain Centaur" ],

			// dragons

			[ "Baby Gray Dragon" ],
			[ "Baby Silver Dragon" ],
			[ "Baby Silver Dragon 2" ],
			[ "Baby Red Dragon" ],
			[ "Baby White Dragon" ],
			[ "Baby Orange Dragon" ],
			[ "Baby Black Dragon" ],
			[ "Baby Blue Dragon" ],
			[ "Baby Green Dragon" ],
			[ "Baby Yellow Dragon" ],
			[ "Gray Dragon" ],
			[ "Silver Dragon" ],
			[ "Silver Dragon 2" ],
			[ "Red Dragon" ],
			[ "White Dragon" ],
			[ "Orange Dragon" ],
			[ "Black Dragon" ],
			[ "Blue Dragon" ],
			[ "Green Dragon" ],
			[ "Yellow Dragon" ],

			// elementals and stalkers

			[ "Stalker" ],
			[ "Air Elemental" ],
			[ "Fire Elemental" ],
			[ "Earth Elemental" ],
			[ "Water Elemental" ],

			// fungi and molds

			[ "Lichen", 		1, "1", [ "Touch:0d0" ],		0, 4, 1, 9, 0,		0, 4, true, 20, 200, 	small, null, null ],
			[ "Brown Mold" ],
			[ "Yellow Mold" ],
			[ "Green Mold" ],
			[ "Red Mold" ],
			[ "Shrieker" ],
			[ "Violet Fungus" ],

			// gnomes

			[ "Gnome", 		3, "1", [ "Weapon:1d6" ],		1, 13, 6, 10, 4,	0, 1, true, 650, 100, 	small, null, null ],
			[ "Gnome Lord", 	4, "1", [ "Weapon:1d8" ],		3, 33, 8, 10, 4,	0, 2, true, 700, 120, 	small, null, null ],
			[ "Gnomish Wizard",	5, "1", [ ],				3, 38, 10, 4, 10,	0, 1, true, 700, 120, 	small, null, null ],
			[ "Gnome King", 	6, "1", [ "Weapon:1d6" ],		5, 61, 10, 10, 20,	0, 1, true, 750, 150, 	small, null, null ],

			// large humanoids

			[ "Giant" ],
			[ "Stone Giant" ],
			[ "Hill Giant" ],
			[ "Fire Giant" ],
			[ "Frost Giant" ],
			[ "Storm Giant" ],
			[ "Ettin" ],
			[ "Titan" ],
			[ "Minotaur" ],

			// jabberwock

			[ "Jabberwock" ],
			[ "Jabberwock 2?" ],

			// keystone kops

			[ "Keystone Kop" ],
			[ "Kop Sergeant" ],
			[ "Kop Lieutenant" ],
			[ "Kop Kaptain" ],

			// liches

			[ "Lich" ],
			[ "Demilich" ],
			[ "Master Lich" ],
			[ "Arch-Lich" ],

			// mummies

			[ "Kobold Mummy", 	4, "1", [ "Claw:1d4" ],		3, 28, 8, 6, 20, 	-2, 1, true, 400, 50, 	small, [ cold, sleep, poison ], null ],
			[ "Gnome Mummy", 	5, "1", [ "Claw:1d6" ],		4, 41, 10, 6, 20, 	-3, 1, true, 650, 50, 	small, [ cold, sleep, poison ], null ],
			[ "Orc Mummy", 		6, "1", [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 850, 75, 	medium, [ cold, sleep, poison ], null ],
			[ "Dwarf Mummy", 	6, "1", [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 900, 150, 	medium, [ cold, sleep, poison ], null ],
			[ "Elf Mummy", 		7, "1", [ "Claw:2d4" ],		6, 73, 12, 4, 30, 	-5, 1, true, 800, 150, 	medium, [ cold, sleep, poison ], null ],
			[ "Elf Mummy", 		7, "1", [ "Claw:2x2d4" ],		6, 73, 12, 4, 30, 	-5, 1, true, 1450, 200, medium, [ cold, sleep, poison ], null ],
			[ "Ettin Mummy", 	8, "1", [ "Claw:2x2d6" ],		7, 92, 12, 4, 30, 	-6, 1, true, 1700, 250, huge, [ cold, sleep, poison ], null ],
			[ "Giant Mummy", 	10, "1", [ "Claw:2x3d4" ],		8, 116, 14, 3, 30, 	-7, 1, true, 2050, 375, huge, [ cold, sleep, poison ], null ],

			// nagas

			[ "Red Naga Spawn", 	4, "1", [ "Bite:1d4" ], 		3, 28, 10, 6, 0, 	0, 0, true, 500, 100, large, [ fire, poison ], [ fire, .1, poison, .1] ],
			[ "Black Naga Spawn", 	4, "1", [ "Bite:1d4" ], 		3, 28, 10, 6, 0, 	0, 0, true, 500, 100, large, [ acid, poison, petrify ], [ poison, .2] ],
			[ "Golden Naga Spawn", 	4, "1", [ "Bite:1d4" ], 		3, 28, 10, 6, 0, 	0, 0, true, 500, 100, large, [ poison ], [ poison, .2] ],
			[ "Golden Naga Spawn", 	4, "1", [ "Bite:1d4" ], 		3, 28, 10, 6, 0, 	0, 0, true, 500, 100, large, [ poison ], [ poison, .2] ],
			[ "Red Naga", 		8, "1", [ "Bite:2d4", "Breath:2d6"], 6, 82, 12, 4, 0,	-4, 1, true, 2600, 400, huge, [ fire, poison ], [ fire, .2, poison, .2 ] ],
			[ "Black Naga", 	10, "1", [ "Bite:2d6"], 		8, 132, 14, 2, 10, 	4, 1, true, 2600, 400, huge, [ poison, acid, petrify ], [ poison, .2 ]],
			[ "Golden Naga", 	13, "1", [ "Bite:2d6", "Magic:4d6"],	10, 239, 14, 2, 70, 	5, 1, true, 2600, 400, huge, [ poison ], [ poison, .2 ]],
			[ "Guardian Naga", 	16, "1", [ "Bite:1d6", "Spit:1d6", "Hug:2d4"],12, 295, 14, 2, 70, 	7, 1, true, 2600, 400, huge, [ poison ], [ poison, .2 ]],

			// ogres

			[ "Ogre" ],
			[ "Ogre Lord" ],
			[ "Ogre King" ],

			// puddings and amoeboids

			[ "Gray Ooze", 		4, "1", [ "Bite:2d8" ],		3, 28, 1, 8, 0,		0, 2, true, 500, 250, medium, [ fire, cold, poison, acid, petrify ], [ poison, .07, cold, .07, fire, .07 ] ],
			[ "Brown Pudding" ],
			[ "Black Pudding" ],
			[ "Green Slime" ],

			// quantum mechanic

			[ "Quantum Mechanic" ],

			// rust monster and disenchanter

			[ "Rust Monster" ],
			[ "Disenchanter" ],

			// snakes
			[ "Garter Snake", 	3, "1", [ "Bite:1d2" ], 		1, 8, 8, 8, 0, 		0, 1, true, 50, 60, 	tiny, null, null ],
			[ "Snake" ],
			[ "Water Moccasin" ],
			[ "Pit Viper" ],
			[ "Python" ],
			[ "Cobra" ],

			// trolls

			[ "Troll" ],
			[ "Ice Troll" ],
			[ "Rock Troll" ],
			[ "Water Troll" ],
			[ "Olog-Hai" ],

			// umber hulk

			[ "Umber Hulk" ],

			// vampires

			[ "Vampire" ],
			[ "Vampire Lord" ],
			[ "Vampire 2?" ],
			[ "Vlad the Impaler" ],

			// wraiths

			[ "Barrow Wight" ],
			[ "Wraith" ],
			[ "Nazgul" ],

			// xorn

			[ "Xorn" ],

			// apelike creatures

			[ "Monkey" ],
			[ "Ape" ],
			[ "Owlbear" ],
			[ "Yeti" ],
			[ "Carnivorous Ape" ],
			[ "Sasquatch" ],

			// zombies

			[ "Kobold Zombie" ],
			[ "Gnome Zombie" ],
			[ "Orc Zombie" ],
			[ "Dwarf Zombie" ],
			[ "Elf Zombie" ],
			[ "Human Zombie" ],
			[ "Ettin Zombie" ],
			[ "Giant Zombie" ],
			[ "Ghoul" ],
			[ "Skeleton" ],

			// golems

			[ "Straw Golem", 4, "1", [ "Claw:2x1d2" ], 		3, 28, 12, 10, 0, 	0, 1, false, 400, 0, large, [ sleep, poison ], null ],
			[ "Paper Golem" ],
			[ "Rope Golem" ],
			[ "Gold Golem" ],
			[ "Leather Golem" ],
			[ "Wood Golem" ],
			[ "Flesh Golem" ],
			[ "Clay Golem" ],
			[ "Stone Golem" ],
			[ "Glass Golem" ],
			[ "Iron Golem" ],

			// humans and elves

			[ "Human" ],
			[ "Wererat" ],
			[ "Werejackal" ],
			[ "Werewolf" ],
			[ "Elf" ],
			[ "Woodland-Elf" ],
			[ "Green-Elf" ],
			[ "Grey-Elf" ],
			[ "Elf-Lord" ],
			[ "Elvenking" ],
			[ "Doppelganger" ],
			[ "Nurse" ],
			[ "Shopkeeper" ],
			[ "Guard" ],
			[ "Prisoner" ],
			[ "Oracle" ],
			[ "Aligned Priest" ],
			[ "High Priest" ],
			[ "Soldier" ],
			[ "Sergeant" ],
			[ "Lieutenant" ],
			[ "Captain" ],
			[ "Watchman" ],
			[ "Watch Captain" ],
			[ "Medusa" ],
			[ "Wizard of Yendor" ],
			[ "Croesus" ],

			// ghosts and shades

			[ "Ghost" ],
			[ "Shade" ],

			// major demons

			[ "Water Demon" ],
			[ "Horned Devil" ],
			[ "Succubus" ],
			[ "Incubus" ],
			[ "Medusa" ],
			[ "Erinys" ],
			[ "Barbed Devil" ],
			[ "Marilith" ],
			[ "Vrock" ],
			[ "Hezrou" ],
			[ "Bone Devil" ],
			[ "Ice Devil" ],
			[ "Nalfeshnee" ],
			[ "Pit Fiend" ],
			[ "Balrog" ],
			[ "Jubilex" ],
			[ "Yeenoghu" ],
			[ "Orcus" ],
			[ "Geryon" ],
			[ "Dispater" ],
			[ "Baalzebub" ],
			[ "Asmodeus" ],
			[ "Demogorgon" ],
			[ "Death" ],
			[ "Pestilence" ],
			[ "Famine" ],
			[ "Mail Demon" ],
			[ "Djinni" ],
			[ "Sandestin" ],

			// sea monsters

			[ "Jellyfish" ],
			[ "Piranha" ],
			[ "Shark" ],
			[ "Giant Eel" ],
			[ "Electric Eel" ],
			[ "Kraken" ],

			// lizards

			[ "Newt", 		1, "1", [ "Bite:1d2" ], 	0, 1, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, null ],
			[ "Gecko", 		2, "1", [ "Bite:1d3" ], 	1, 8, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, null ],
			[ "Iguana", 		3, "1", [ "Bite:1d4" ], 	2, 17, 6, 7, 0, 	0, 5, true, 30, 30, tiny, null, null ],
			[ "Baby Crocodile" ],
			[ "Lizard" ],
			[ "Chameleon" ],
			[ "Crocodile" ],
			[ "Salamander" ],
			[ "Long Worm Entity" ],

			// player monsters

			[ "Archeologist" ],
			[ "Barbarian" ],
			[ "Caveman" ],
			[ "Cavewoman" ],
			[ "Healer" ],
			[ "Knight" ],
			[ "Monk" ],
			[ "Priest" ],
			[ "Priestess" ],
			[ "Ranger" ],
			[ "Rogue" ],
			[ "Samurai" ],
			[ "Tourist" ],
			[ "Valkyrie" ],
			[ "Wizard" ],

			// quest leaders

			[ "Unknown Quest Leader 1?" ],
			[ "Lord Carnarvon" ],
			[ "Pelias" ],
			[ "Shaman Karnov" ],
			[ "Unknown Quest Leader 2?" ],
			[ "Hippocrates" ],
			[ "King Arthur" ],
			[ "Grand Master" ],
			[ "Arch Priest" ],
			[ "Orion" ],
			[ "Master of Thieves" ],
			[ "Lord Sato" ],
			[ "Twoflower" ],
			[ "Norn" ],
			[ "Neferet the Green" ],

			// quest nemeses

			[ "Minion of Huhetotl" ],
			[ "Thoth Amon" ],
			[ "Chromatic Dragon" ],
			[ "Unknown Quest Nemesis 1?" ],
			[ "Cyclops" ],
			[ "Ixoth" ],
			[ "Master Kaen" ],
			[ "Nalzok" ],
			[ "Scorpius" ],
			[ "Master Assassin" ],
			[ "Ashikaga Takauji" ],
			[ "Lord Surtur" ],
			[ "The Dark One" ],

			// quest guardians

			[ "Student" ],
			[ "Chieftan" ],
			[ "Neanderthal" ],
			[ "Unknown Quest Guardian 1?" ],
			[ "Attendant" ],
			[ "Page" ],
			[ "Abbot" ],
			[ "Acolyte" ],
			[ "Hunter" ],
			[ "Thug" ],
			[ "Ninja" ],
			[ "Roshi" ],
			[ "Guide" ],
			[ "Warrior" ],
			[ "Apprentice" ],
		];

		return agentDatas;
	};

	DemoData.prototype.buildRoles = function()
	{
		var skillDefns = this.buildSkillDefns();

		var returnValues =
		[
			new Role
			(
				"Wizard",
				// ranks
				[
					new Role_Rank("Evoker", 0, null),
				],
				// skills
				[
					new Role_Skill(skillDefns["Attack Spells"], 4),
					new Role_Skill(skillDefns["Dagger"], 4),
					new Role_Skill(skillDefns["Quarterstaff"], 4),
				]
			),
		];

		return returnValues;
	};

	DemoData.prototype.buildSkillDefns = function()
	{
		var returnValues =
		[
			new SkillDefn("Attack Spells"),
			new SkillDefn("Dagger"),
			new SkillDefn("Quarterstaff"),
		];

		returnValues.addLookupsByName();

		return returnValues;
	};

	DemoData.prototype.buildSpellDefns = function()
	{
		var returnValues =
		[
			// todo
		];

		returnValues.addLookupsByName();

		return returnValues;
	};

	DemoData.prototype.buildTraitDefns = function()
	{
		var returnValues =
		[
			new TraitDefn("Strength"),
			new TraitDefn("Dexterity"),
			new TraitDefn("Willpower"),
			new TraitDefn("Constitution"),
			new TraitDefn("Charisma"),
		];

		returnValues.addLookupsByName();

		return returnValues;
	};
}
