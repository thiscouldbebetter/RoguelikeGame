
// partial class DemoData
{
	DemoData.prototype.buildEntityDefnGroups_Movers = function
	(
		visuals, activityDefns, itemCategories
	)
	{
		var returnValues = [];

		var sizeInPixels = visuals["Floor"].size;

		this.buildEntityDefnGroups_Movers_Player
		(
			visuals, activityDefns, itemCategories, returnValues
		);

		var rot = function(universe, world, place, entityTurnable)
		{
			var turnable = entityTurnable.turnable;
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

		// agents

		var itemHolder = new ItemHolder();

		var agentDatas = this.buildAgentDatas();

		var useCorpse = function(universe, world, place, entityItem, user)
		{
			// todo
		};

		var dieAndDropCorpse = function(universe, world, place, entityDying)
		{
			var itemDefnCorpse = entityDying.killable.itemDefnCorpse;
			entityDying.locatable.loc.pos.z = PlaceLevel.ZLayers.Items;
			var entityCorpse = new Entity
			(
				itemDefnCorpse.name + universe.idHelper.idNext(),
				[
					entityDying.locatable,
					new Item(itemDefnCorpse.name, 1),
					mappableDefns.Open,
					new Drawable(visuals["Corpse"]),
					new Turnable(rot)
				]
			);

			place.entitiesToSpawn.push(entityCorpse);
		};

		for (var i = 0; i < agentDatas.length; i++)
		{
			var agentData = agentDatas[i];
			var agentName = agentData.name;
			var difficulty = agentData.difficulty || 100; // todo
			var experienceToKill = agentData.baseExperience || 0;
			var movesPerTurn = agentData.speed || 0;

			var itemDefnCorpse = new ItemDefn
			(
				agentName + " Corpse", // name
				agentName + " Corpse", // appearance
				agentName + " Corpse", // description
				1, // mass
				1, // stackSizeMax,
				[ "Food" ], // categoryNames
				useCorpse
			);

			var entityDefnForAgent = new Entity
			(
				agentName,
				// properties
				[
					new ActorDefn(activityDefns["Move Toward Player"].name),
					mappableDefns.Transparent,
					itemHolder,
					new Demographics(null, null, difficulty, experienceToKill),
					new Drawable(visuals[agentName]),
					new Generatable(1),
					new Killable(5, null, dieAndDropCorpse, itemDefnCorpse),
					new Mover(movesPerTurn),
					new Namable(agentName),
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
			var difficulty = (entityDefnForAgent.demographics == null ? null : entityDefnForAgent.demographics.rank);
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
		var entityName = Player.name;

		var sizeInPixels = visuals["Floor"].size;

		var demographics = new Demographics
		(
			"Human", "Rogue",
			0, // rank
			0 // experienceToKill
		);

		var moverPlayer = new Mover
		(
			9, // movesPerTurn
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
			visualReticleDirectional
		]);

		var drawableDefnPlayer = new Drawable(visualForPlayer);

		var activityDefnName =
			activityDefns["Accept User Input"].name;
			//activityDefns["Demo User Input"].name;

		var equipmentSocketDefnGroup = new EquipmentSocketDefnGroup
		(
			"Equippable",
			[
				new EquipmentSocketDefn("Wielding", [ "Weapon" ] ),
				new EquipmentSocketDefn("Ammunition", [ "Ammunition" ] ),
				new EquipmentSocketDefn("Ready", [ "Wand", "Tool" ] ),
				new EquipmentSocketDefn("Head", [ "Headwear" ]),
				new EquipmentSocketDefn("Neck", [ "Neckwear" ]),
				new EquipmentSocketDefn("Shirt", [ "Shirt" ]),
				new EquipmentSocketDefn("Body", [ "BodyArmor" ]),
				new EquipmentSocketDefn("Cloak", [ "Cloak" ]),
				new EquipmentSocketDefn("Hands", [ "Glove" ] ),
				new EquipmentSocketDefn("Feet", [ "Footwear" ] ),
				new EquipmentSocketDefn("Left Finger", [ "Ring" ] ),
				new EquipmentSocketDefn("Right Finger", [ "Ring" ] ),
			]
		);

		var equipmentUser = new EquipmentUser(equipmentSocketDefnGroup);

		var entityDefnPlayer = new Entity
		(
			entityName,
			// properties
			[
				new ActorDefn(activityDefnName),
				mappableDefns.Transparent,
				demographics,
				drawableDefnPlayer,
				new Effectable(),
				equipmentUser,
				new ItemHolder(),
				new Killable(160),
				moverPlayer,
				new Player
				(
					8 // sightRange
				),
				new Starvable(1000)
			]
		);

		returnValues.push(entityDefnPlayer);
		returnValues[entityName] = entityDefnPlayer;
	};

	DemoData.prototype.buildAgentDatas = function()
	{
		// resistances and effects

		var acid = "acid";
		var aggravate = "aggravate";
		var cold = "cold";
		var disintegrate = "disintegrate";
		var fire = "fire";
		var lycanthropy = "lycanthropy";
		var petrify = "petrify";
		var poison = "poison";
		var shock = "shock";
		var sleep = "sleep";
		var strength = "strength";
		var stun = "stun";
		var telepathy = "telepathy";
		var teleportControl = "teleportControl";
		var teleportitis = "teleportitis";

		// sizes

		var tiny = 0;
		var small = 1;
		var medium = 2;
		var large = 3;
		var huge = 4;

		// number appearing
		var one = "1";

		// corpse drop frequency at http://www.steelypips.org/nethack/343/mon2-343.html

		function AgentData
		(
			name, difficulty, numberAppearing, attacks, baseLevel, baseExperience,
			speed, baseArmorClass, baseMagicResistance, alignment, frequency, isGenocidable,
			weight, nutrition, size, resistances, resistancesConveyed
		)
		{
			this.name = name;
			this.difficulty = difficulty;
			this.numberAppearing = numberAppearing;
			this.attacks = attacks;
			this.baseLevel = baseLevel;
			this.baseExperience = baseExperience;
			this.speed = speed;
			this.baseArmorClass = baseArmorClass;
			this.baseMagicResistance = baseMagicResistance;
			this.alignment = alignment;
			this.frequency = frequency;
			this.isGenocidable = isGenocidable,
			this.weight = weight;
			this.nutrition = nutrition;
			this.size = size;
			this.resistances = resistances;
			this.resistancesConveyed = resistancesConveyed;
		}

		var AD = AgentData;

		var agentDatas =
		[
			// insects

			//     name, 				df, no, 	attacks, 						lv,xp, sp, ac, mr, 	al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Giant Ant", 		4, "1d3", 	[ "Bite:1d4" ], 				2, 20, 18, 	3, 0, 	0, 3, 	true, 10, 	10, tiny, null, 		.33, 	null ),
			new AD("Killer Bee",		5, "2d6", 	[ "Sting:1d3" ],				1, 31, 18, -1, 0,	0, 2, 	true, 1, 	5, 	tiny, [ poison ], 	.33, 	[ poison, 1 ] ),
			new AD("Soldier Ant",		6, "1d3", 	[ "Bite:2d4", "Sting:3d4" ], 	3, 37, 18, 	3, 0, 	0, 2, 	true, 20, 	5, 	tiny, [ poison ], 	.33, 	[ poison, 1 ] ),
			new AD("Fire Ant", 			6, "1d3", 	[ "Bite:2d4", "Sting:2d4" ],	3, 34, 18, 	3, 10, 	0, 1, 	true, 30, 	10, tiny, [ fire ], 	.25,	[ fire, 1 ] ),
			new AD("Giant Beetle",		6, "1", 	[ "Bite:3d6" ],					5, 56, 6, 	4, 0,	0, 3, 	true, 10, 	10,	large, [ poison ], 	1, 		[ poison, 1 ], ),
			new AD("Queen Bee",			12, "1", 	[ "Sting:1d8" ], 				9, 225, 24, -4, 0, 	0, 0, 	true, 1, 	5, 	tiny, [ poison ], 	.25, 	[ poison, 1 ] ),

			// blobs

			//     name, 				df, no, 	attacks, 					lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, 												chance->resistConveyed
			new AD("Acid Blob", 		2, one, [ "Acid:1d8"  ],				1, 9, 	3, 8, 0,	0, 2, true, 30, 10, 	tiny, [sleep, poison, acid, petrify], 						.33, 	null ),
			new AD("Quivering Blob", 	6, one, [ "Touch:1d8" ],				5, 59, 	1, 8, 0, 	0, 2, true, 200, 100, 	small, [sleep, poison], 									.50, 	[ poison, 1 ] ),
			new AD("Gelatinous Cube", 	8, one, [ "Touch:2d4","Paralyze:1d4"], 	6, 76, 	6, 8, 0, 	0, 2, true, 600, 150, 	large, [ fire, cold, shock, sleep, poison, acid, petrify], 	1, 		[ fire, 1, cold, 1, shock, 1, sleep, 1 ] ),

			// cockatrices

			//     name, 				df, no, 	attacks, 		lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, size, 	resists, 				chance->resistConveyed
			new AD("Chickatrice", 		7, "1d3", 	[ "Bite:1d2" ],	4, 136, 4, 8, 30,	0, 1, true, 10, 10, tiny, 	[ poison, petrify ], 	.25, [ poison, 1 ] ),
			new AD("Cockatrice", 		7, one, 	[ "Bite:1d3" ],	5, 149, 6, 6, 30,	0, 5, true, 30, 30, small, 	[ poison, petrify ], 	.50, [ poison, 1 ] ),
			new AD("Pyrolisk", 			8, one, 	[ "Gaze:2d6" ],	6, 82, 	6, 6, 30,	0, 1, true, 30, 30, small, 	[ fire, poison ], 		.33, [ fire, 1, poison, 1 ] ),

			// canines

			//     name, 				df, no, 	attacks, 					lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Jackal", 			1, "1d3", [ "Bite:1d2" ],				0, 1, 12, 7, 0, 	0, 3, true, 300, 250, 	small, null, .50, null ),
			new AD("Fox",				1, one, [ "Bite:1d3" ],					0, 4, 15, 7, 0, 	0, 1, true, 300, 250, 	small, null, .33, null ),
			new AD("Coyote", 			2, "1d3", [ "Bite:1d4" ],				1, 8, 12, 7, 0,		0, 1, true, 300, 250, 	small, null, .33, null ),
			new AD("Werejackal" ),
			new AD("Little Dog",		3, one, [ "Bite:1d6" ],					3, 2, 20, 18, 6,	0, 1, true, 150, 150, 	small, null, .33, null ),
			new AD("Dog",				5, one, [ "Bite:1d6" ], 				4, 4, 44, 16, 0, 	0, 1, true, 400, 200, 	medium, null, .33, [ aggravate, 1 ] ),
			new AD("Large Dog",			7, one, [ "Bite:2d4" ],					6, 76, 15, 4, 0, 	0, 1, true, 800, 250, 	medium, null, .33, null ),
			new AD("Dingo",				5, one, [ "Bite:1d5" ],					4, 44, 16, 5, 0,	0, 1, true, 400, 200, 	medium, null, .33, null ),
			new AD("Wolf",				6, "1d3", [ "Bite:2d4" ], 				6, 56, 12, 4, 0, 	0, 2, true, 500, 250, 	medium, null, .50, null ),
			new AD("Werewolf" ),
			new AD("Warg",				8, "1d3", [ "Bite:2d6" ],				7, 92, 12, 4, 0, 	-5, 2, true, 850, 350, 	medium, null, 		.50, null ),
			new AD("Winter Wolf Cub", 	7, "1d3", [ "Bite:1d8", "Breath:1d8" ],	5, 64, 12, 4, 0, 	-5, 2, true, 250, 200, 	small, [ cold ], 	.50, [ cold, .33 ] 	),
			new AD("Winter Wolf",		9, one, [ "Bite:2d6", "Breath:2d6" ],	7, 102, 12, 4, 20, 	0, 1, true, 700, 300, 	large, [ cold ], 	1, [ cold, .47 ]	),
			new AD("Hell Hound Pup",	9, "1d3", [ "Bite:2d6", "Breath:2d6" ],	9, 102, 12, 4, 20, -5, 1, true, 200, 200, 	small,	[ fire ], 	.33, [ fire, .47 ] ),
			new AD("Hell Hound",		14, one, [ "Bite:3d6", "Breath:3d6"],	12, 290, 14, 2, 20, 0, 1, true, 600, 300, 	medium,	[ fire ], 	.33, [ fire, .80 ] ),
			new AD("Cerberus" ),

			// eyes and spheres

			//     name, 				df, no, attacks, 			lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Gas Spore", 		2, one, [ "Explode:4d6" ],	2, 1, 12, 3, 10,  	0, 1, true, 10, 10, 	small, null, 	0, null),
			new AD("Floating Eye", 		3, one, [ ], 				2, 17, 1, 9, 10, 	0, 5, true, 10, 10, 	small, null, 	.50, [ telepathy, 1]),
			new AD("Flaming Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ cold ], 0, null ),
			new AD("Freezing Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ fire ], 0, null ),
			new AD("Shocking Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ shock ], 0, null ),
			new AD("Beholder" ),

			// felines

			//     name, 		df, no, attacks, 						lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Kitten", 	3, one, [ "Bite:1d6" ], 				2, 20, 18, 6, 0, 	0, 1, true, 150, 150, 	small, null, .33, null ),
			new AD("Housecat",	5, one, [ "Bite:1d6" ], 				4, 44, 16, 5, 0, 	0, 1, true, 200, 200, 	small, null, .33, null ),
			new AD("Jaguar",	6, one, [ "Claw:1d4", "Bite:1d8" ],		4, 44, 15, 6, 0, 	0, 2, true, 600, 300, 	large, null, 1, null ),
			new AD("Lynx",		7, one, [ "Claw:1d4", "Bite:1d10" ], 	5, 59, 15, 6, 0,	0, 1, true, 600, 300, 	large, null, .33, null ),
			new AD("Panther", 	7, one, [ "Claw:1d6", "Bite:1d10" ], 	5, 59, 15, 6, 0,	0, 1, true, 600, 300, 	large, null, 1, null ),
			new AD("Large Cat",	7, one, [ "Bite:2d4" ], 				6, 76, 15, 4, 0, 	0, 1, true, 250, 250, 	small, null, .33, null ),
			new AD("Tiger",		8, one, [ "Claw:2d4", "Bite:1d10" ], 	6, 73, 12, 6, 0,	0, 2, true, 600, 300, 	large, null, 1, null ),

			// gremlins and gargoyles

			new AD("Gremlin" ), // .50
			new AD("Gargoyle" ), // .50
			new AD("Winged Gargoyle" ), // .33

			// humanoids

			new AD("Hobbit", 		2, one, [ "Weapon:1d6" ], 		1, 13, 9, 10, 0, 	6, 2, true, 500, 200, 	small, null, .50, null ),
			new AD("Dwarf", 		4, one, [ "Weapon:1d8" ],		2, 22, 6, 10, 10, 	4, 3, true, 900, 300, 	medium, null, .50, null ),
			new AD("Bugbear" ), 		// 1.00
			new AD("Dwarf Lord" ), 	// .50
			new AD("Dwarf King" ), 	// .33
			new AD("Mind Flayer" ),	// .33
			new AD("Master Mind Flayer" ), // .33

			// minor demons

			//     name, 			df, no, attacks, 						lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Manes", 		3, "2d6", [ "Claw:2x1d3", "Bite:1d4"], 	1, 8, 3, 7, 0,		-7, 1, true, 100, 100, small, [ sleep, poison ], 0, null ),
			new AD("Homunculus", 	3, one, [ "Bite:1d3" ], 				2, 19, 12, 6, 10, 	-7, 2, true, 60, 100, tiny, [sleep, poison]), // .33
			new AD("Imp", 			4, one, [ "Claw:1d4" ], 				3, 33, 12, 2, 20, 	-7, 1, true, 20, 10, tiny, null, null ), // .25
			new AD("Lemure", 		5, one, [ "Claw:1d3" ], 				3, 28, 3, 7, 0, 	-7, 1, true, 150, 100, medium, [sleep, poison]), // 0
			new AD("Quasit", 		7, one, [ "Claw:2x1d2" ], 				3, 36, 15, 2, 20, -7, 2, true, 200, 200, small, [poison], .20, [poison] ), // .50
			new AD("Tengu", 		7, one, [ "Bite:1d7" ], 				6, 76, 13, 5, 30, 7, 3, true, 300, 200, small, [poison], .15, [poison, teleportControl, teleportitis] ), // .50

			// jellies

			new AD("Blue Jelly" ), // .50
			new AD("Spotted Jelly" ), // .33
			new AD("Ochre Jelly" ), // .50

			// kobolds

			new AD("Kobold", 		1, one, [ "Weapon:1d4" ],		0, 6, 6, 10, 0, 	-2, 1, true, 400, 100, small, [ poison ], null ),
			new AD("Large Kobold" ),
			new AD("Kobold Lord" ),
			new AD("Kobold Shaman" ),

			// leprechauns

			new AD("Leprechaun" ),

			// mimics

			new AD("Small Mimic", 	8, one, [ "Claw:3d4" ],		7, 92, 3, 7, 0,		0, 2, true, 300, 200, medium, [ acid ], null ),
			new AD("Large Mimic", 	9, one, [ "Claw:3d4" ],		8, 113, 3, 7, 10,	0, 1, true, 600, 400, large, [ acid ], null ),
			new AD("Giant Mimic", 	8, one, [ "Claw:2x3d4" ],		9, 186, 3, 7, 20,	0, 1, true, 800, 500, large, [ acid ], null ),

			// nymphs

			new AD("Wood Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ),
			new AD("Water Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ),
			new AD("Mountain Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, null ),

			// orcs

			new AD("Goblin", 		1, one, [ "Weapon:1d4" ], 		0, 6, 9, 10, 0, 	-3, 2, true, 400, 100, small, null, null ),
			new AD("Hobgoblin", 		3, one, [ "Weapon:1d6" ],		1, 13, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, null ),
			new AD("Orc", 		3, "2d6", [ "Weapon:1d8" ], 		1, 13, 9, 10, 0, 	-3, 0, true, 850, 150, medium, null, null ),
			new AD("Hill Orc",		4, "2d6", [ "Weapon:1d6" ],		2, 22, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, null ),
			new AD("Mordor Orc" ),
			new AD("Uruk-hai" ),
			new AD("Orc Shaman" ),
			new AD("Orc Captain" ),

			// piercer

			new AD("Rock Piercer",	4, one, [ "Bite:2d6" ],		3, 28, 1, 3, 0,		0, 4, true, 200, 200, small, null, null ),
			new AD("Iron Piercer",	6, one, [ "Bite:3d6" ],		5, 63, 1, 0, 0,		0, 2, true, 400, 300, medium, null, null ),
			new AD("Glass Piercer",	9, one, [ "Bite:4d6" ],		7, 106, 1, 0, 0,	0, 4, true, 400, 300, medium, [ acid ], null ),

			// quadrupeds

			new AD("Rothe", 		4, one, [ "Claw:1d3", "Bite:1d8" ],	2, 17, 9, 7, 0, 	0, 4, true, 400, 100, large, null, null ),
			new AD("Mumak" ),
			new AD("Leocrotta" ),
			new AD("Wumpus" ),
			new AD("Titanothere" ),
			new AD("Baluchitherium" ),
			new AD("Mastodon" ),

			// rodents

			new AD("Sewer Rat", 		1, "1d3", [ "Bite:1d3" ],		0, 1, 12, 7, 0,		0, 1, true, 20, 12, 	tiny, null, null ),
			new AD("Giant Rat",		2, "1d3", [ "Bite:1d3" ],		1, 8, 10, 7, 0, 	0, 2, true, 30, 30, 	tiny, null, null ),
			new AD("Rabid Rat",		4, one, [ "Bite:2d4" ],		2, 17, 12, 6, 0, 	0, 1, true, 30, 5, 	tiny, [ poison ], null ),
			new AD("Wererat" ),
			new AD("Rock Mole" ),
			new AD("Woodchuck" ),

			// spiders and centipedes

			new AD("Cave Spider", 	3, "1d3", [ "Bite:1d2" ],		1, 8, 12, 3, 0, 	0, 2, true, 50, 50, 	tiny, [ poison ], [ poison, .07 ] ),
			new AD("Centipede" ),
			new AD("Giant Spider" ),
			new AD("Scorpion" ),

			// trappers, lurkers above
			new AD("Lurker Above" ),
			new AD("Trapper" ),

			// horses and unicorns
			new AD("White Unicorn" ),
			new AD("Gray Unicorn" ),
			new AD("Black Unicorn" ),
			new AD("Pony" ),
			new AD("Horse" ),
			new AD("Warhorse" ),

			// vortices

			new AD("Fog Cloud", 		4, one, [ "Suffocate:1d6" ],		3, 38, 1, 0, 0, 	0, 2, true, 0, 0, 	huge, [ sleep, poison, petrify ], null ),
			new AD("Dust Vortex" ),
			new AD("Ice Vortex" ),
			new AD("Energy Vortex" ),
			new AD("Steam Vortex" ),
			new AD("Fire Vortex" ),

			// worms
			new AD("Baby Long Worm" ),
			new AD("Baby Purple Worm" ),
			new AD("Long Worm" ),
			new AD("Purple Worm" ),

			// fantastical insects
			new AD("Grid Bug", 		1, "1d3", [ "Bite:0d0"],		0, 1, 12, 9, 0, 	0, 3, true, 15, 10, 	tiny, [ shock, poison ], null ),
			new AD("Xan" ),

			// lights
			new AD("Yellow Light", 	5, one, [ ],				3, 44, 15, 0, 0, 	0, 4, true, 0, 0, 	small, [ fire, cold, shock, disintegrate, sleep, poison, acid, petrify ], null ),
			new AD("Black Light" ),

			// zruties

			new AD("Zruty" ),

			// angelic beings
			//     name, 		df, no, attacks, 									lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, 	resists, 					chance->resistConveyed
			new AD("Couatl" ),
			new AD("Aleax", 	12, one,[ "Weapon:1d6", "Weapon:1d6", "Kick:1d4" ], 10, 298, 8, 0, 30, 	7, 1, true, 1450, 400, 	medium, [cold,shock,sleep,poison], null, null),
			new AD("Angel" ),
			new AD("Ki-rin" ),
			new AD("Archon" ),

			// bats and birds

			new AD("Bat", 			2, one, [ "Bite:1d4" ], 		0, 6, 22, 8, 0,		0, 1, true, 20, 20, 	tiny, null, [  ] ),
			new AD("Giant Bat", 	3, one, [ "Bite:1d6" ],		2, 22, 22, 7, 0, 	0, 2, true, 30, 30, 	small, null, [  ] ),
			new AD("Raven" ),
			new AD("Vampire Bat" ),

			// centaurs

			new AD("Plains Centaur" ),
			new AD("Forest Centaur" ),
			new AD("Mountain Centaur" ),

			// dragons

			new AD("Baby Gray Dragon" ),
			new AD("Baby Silver Dragon" ),
			new AD("Baby Silver Dragon 2" ),
			new AD("Baby Red Dragon" ),
			new AD("Baby White Dragon" ),
			new AD("Baby Orange Dragon" ),
			new AD("Baby Black Dragon" ),
			new AD("Baby Blue Dragon" ),
			new AD("Baby Green Dragon" ),
			new AD("Baby Yellow Dragon" ),
			new AD("Gray Dragon" ),
			new AD("Silver Dragon" ),
			new AD("Silver Dragon 2" ),
			new AD("Red Dragon" ),
			new AD("White Dragon" ),
			new AD("Orange Dragon" ),
			new AD("Black Dragon" ),
			new AD("Blue Dragon" ),
			new AD("Green Dragon" ),
			new AD("Yellow Dragon" ),

			// elementals and stalkers

			new AD("Stalker" ),
			new AD("Air Elemental" ),
			new AD("Fire Elemental" ),
			new AD("Earth Elemental" ),
			new AD("Water Elemental" ),

			// fungi and molds

			new AD("Lichen", 			1, one, [ "Touch:0d0" ],		0, 4, 1, 9, 0,		0, 4, true, 20, 200, 	small, null, null ),
			new AD("Brown Mold" ),
			new AD("Yellow Mold" ),
			new AD("Green Mold" ),
			new AD("Red Mold" ),
			new AD("Shrieker" ),
			new AD("Violet Fungus" ),

			// gnomes

			new AD("Gnome", 			3, one, [ "Weapon:1d6" ],		1, 13, 6, 10, 4,	0, 1, true, 650, 100, 	small, null, null ),
			new AD("Gnome Lord", 		4, one, [ "Weapon:1d8" ],		3, 33, 8, 10, 4,	0, 2, true, 700, 120, 	small, null, null ),
			new AD("Gnomish Wizard",	5, one, [ ],					3, 38, 10, 4, 10,	0, 1, true, 700, 120, 	small, null, null ),
			new AD("Gnome King", 		6, one, [ "Weapon:1d6" ],		5, 61, 10, 10, 20,	0, 1, true, 750, 150, 	small, null, null ),

			// large humanoids

			//     name, 				df, no, 	attacks, 								lv,xp, sp, ac, mr, 	al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Giant", 			8, one,		[ "Weapon:2d10" ], 						6, 127, 6, 0, 0, 	2, 0, 	true, 2250, 750, huge, null, 		.50, 	[ strength ] ),
			new AD("Stone Giant", 		8, one, 	[ "Weapon:2d10" ], 						6, 127, 6, 0, 0, 	2, 1, 	true, 2250, 750, huge, null, 		.50,	[ strength ] ),
			new AD("Hill Giant", 		10, one, 	[ "Weapon:2d8" ], 						8, 174, 10, 6, 0, 	-2, 1, 	true, 2200, 700, huge, null, 		.50,	[ strength ] ),
			new AD("Fire Giant",		11, one, 	[ "Weapon:2d10" ], 						9, 254, 12, 4, 5, 	2, 1, 	true, 2250, 750, huge, [fire], 		.30, 	[ fire, strength ] ),
			new AD("Frost Giant", 		13, one, 	[ "Weapon:2d12" ], 						10, 296, 12, 3, 10, -3, 1, 	true, 2250, 750, huge, [cold],		.33,	[ cold, strength ] ),
			new AD("Storm Giant", 		19, one, 	[ "Weapon:2d12" ], 						16, 536, 12, 3, 10, -3, 1, 	true, 2250, 750, huge, [shock],		.50,	[ shock, strength ] ),
			new AD("Ettin", 			13, one, 	[ "Melee:2d8,Melee:3d6"],				10, 291, 12, 3, 0, 	0, 1, 	true, 1700, 500, huge, null, 		null, 	null),
			new AD("Titan", 			20, one, 	[ "Weapon:2d8" ],						16, 553, 18, -3, 70, 9, 1, 	true, 2300, 900, huge, null, 		null, 	null),
			new AD("Minotaur", 			17, one, 	[ "Claw:3d10","Claw:3d10","Butt:2d8"],  15, 504, 15, 6, 0, 0, 0, 	true, 1500, 700, large, null, 		null, 	null),

			// jabberwock

			new AD("Jabberwock" ),
			new AD("Jabberwock 2?" ),

			// keystone kops

			new AD("Keystone Kop" ),
			new AD("Kop Sergeant" ),
			new AD("Kop Lieutenant" ),
			new AD("Kop Kaptain" ),

			// liches

			new AD("Lich" ),
			new AD("Demilich" ),
			new AD("Master Lich" ),
			new AD("Arch-Lich" ),

			// mummies

			//     name, 				df, no, 	attacks, 		lv,xp, sp, ac, mr, 	al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Kobold Mummy", 		4, one, [ "Claw:1d4" ],		3, 28, 8, 6, 20, 	-2, 1, true, 400, 50, 	small, [ cold, sleep, poison ], null ),
			new AD("Gnome Mummy", 		5, one, [ "Claw:1d6" ],		4, 41, 10, 6, 20, 	-3, 1, true, 650, 50, 	small, [ cold, sleep, poison ], null ),
			new AD("Orc Mummy", 		6, one, [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 850, 75, 	medium, [ cold, sleep, poison ], null ),
			new AD("Dwarf Mummy", 		6, one, [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 900, 150, 	medium, [ cold, sleep, poison ], null ),
			new AD("Elf Mummy", 		7, one, [ "Claw:2d4" ],		6, 73, 12, 4, 30, 	-5, 1, true, 800, 150, 	medium, [ cold, sleep, poison ], null ),
			new AD("Elf Mummy", 		7, one, [ "Claw:2x2d4" ],	6, 73, 12, 4, 30, 	-5, 1, true, 1450, 200, medium, [ cold, sleep, poison ], null ),
			new AD("Ettin Mummy", 		8, one, [ "Claw:2x2d6" ],	7, 92, 12, 4, 30, 	-6, 1, true, 1700, 250, huge, [ cold, sleep, poison ], null ),
			new AD("Giant Mummy", 		10, one, [ "Claw:2x3d4" ],	8, 116, 14, 3, 30, 	-7, 1, true, 2050, 375, huge, [ cold, sleep, poison ], null ),

			// nagas

			//     name, 					df, no, 	attacks, 						lv,xp, sp, ac, mr, 		al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Red Naga Spawn", 		4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ fire, poison ], [ fire, .1, poison, .1] ),
			new AD("Black Naga Spawn", 		4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ acid, poison, petrify ], [ poison, .2] ),
			new AD("Golden Naga Spawn", 	4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ poison ], [ poison, .2] ),
			new AD("Golden Naga Spawn", 	4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ poison ], [ poison, .2] ),
			new AD("Red Naga", 				8, one, [ "Bite:2d4", "Breath:2d6"], 		6, 82, 12, 4, 0,		-4, 1, true, 2600, 400, huge, [ fire, poison ], [ fire, .2, poison, .2 ] ),
			new AD("Black Naga", 			10, one, [ "Bite:2d6"], 					8, 132, 14, 2, 10, 		4, 1, true, 2600, 400, huge, [ poison, acid, petrify ], [ poison, .2 ]),
			new AD("Golden Naga", 			13, one, [ "Bite:2d6", "Magic:4d6"],		10, 239, 14, 2, 70, 	5, 1, true, 2600, 400, huge, [ poison ], [ poison, .2 ]),
			new AD("Guardian Naga", 		16, one, [ "Bite:1d6", "Spit:1d6", "Hug:2d4"],12, 295, 14, 2, 70, 	7, 1, true, 2600, 400, huge, [ poison ], [ poison, .2 ]),

			// ogres

			//     name, 		df, no, attacks, 			lv,xp, sp, ac,mr, al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Ogre", 		7, one, [ "Weapon:2d5" ], 	5, 61, 10, 5, 0, -3, 1, 	true, 1600, 600, large, null, null ),
			new AD("Ogre Lord", 9, one, [ "Weapon:2d6" ], 	7, 97, 12, 3, 30, -5, 2, 	true, 1700, 700, large, null, null ),
			new AD("Ogre King", 11, one, [ "Weapon:3d5" ], 	9, 194, 14, 4, 60, -7, 2,	true, 1700, 750, large, null, null ),

			// puddings and amoeboids

			new AD("Gray Ooze", 		4, one, [ "Bite:2d8" ],		3, 28, 1, 8, 0,		0, 2, true, 500, 250, medium, [ fire, cold, poison, acid, petrify ], [ poison, .07, cold, .07, fire, .07 ] ),
			new AD("Brown Pudding" ),
			new AD("Black Pudding" ),
			new AD("Green Slime" ),

			// quantum mechanic

			new AD("Quantum Mechanic" ),

			// rust monster and disenchanter

			new AD("Rust Monster" ),
			new AD("Disenchanter" ),

			// snakes
			new AD("Garter Snake", 	3, one, [ "Bite:1d2" ], 		1, 8, 8, 8, 0, 		0, 1, true, 50, 60, 	tiny, null, null ),
			new AD("Snake" ),
			new AD("Water Moccasin" ),
			new AD("Pit Viper" ),
			new AD("Python" ),
			new AD("Cobra" ),

			// trolls

			new AD("Troll" ),
			new AD("Ice Troll" ),
			new AD("Rock Troll" ),
			new AD("Water Troll" ),
			new AD("Olog-Hai" ),

			// umber hulk

			new AD("Umber Hulk" ),

			// vampires

			new AD("Vampire" ),
			new AD("Vampire Lord" ),
			new AD("Vampire 2?" ),
			new AD("Vlad the Impaler" ),

			// wraiths

			new AD("Barrow Wight" ),
			new AD("Wraith" ),
			new AD("Nazgul" ),

			// xorn

			new AD("Xorn" ),

			// apelike creatures

			new AD("Monkey" ),
			new AD("Ape" ),
			new AD("Owlbear" ),
			new AD("Yeti" ),
			new AD("Carnivorous Ape" ),
			new AD("Sasquatch" ),

			// zombies

			new AD("Kobold Zombie" ),
			new AD("Gnome Zombie" ),
			new AD("Orc Zombie" ),
			new AD("Dwarf Zombie" ),
			new AD("Elf Zombie" ),
			new AD("Human Zombie" ),
			new AD("Ettin Zombie" ),
			new AD("Giant Zombie" ),
			new AD("Ghoul" ),
			new AD("Skeleton" ),

			// golems

			//     name, 				df, no, attacks, 						lv,xp, sp, ac, mr,al,fq, geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Straw Golem", 		4, one, [ "Claw:2x1d2" ], 				3, 28, 12, 10, 0, 0, 1, false, 400, 0, large, [ sleep, poison ], null ),
			new AD("Paper Golem", 		4, one, [ "Claw:1d3" ], 				3, 31, 12, 10, 0, 0, 1, false, 400, 0, large, [ sleep, poison ], null ),
			new AD("Rope Golem",		6, one, [ "Claw:2x1d4", "Choke:6d1"],	4, 44, 9, 	8, 0, 0, 1, false, 450, 0, large, [ sleep, poison ], null ),
			new AD("Gold Golem",		6, one, [ "Claw:2x2d3" ], 				5, 56, 9, 	6, 0, 0, 1, false, 450, 0, large, [ sleep, poison ], null ),
			new AD("Leather Golem", 	7, one, [ "Claw:2x1d6" ], 				6, 73, 6, 	6, 0, 0, 1, false, 800, 0, large, [ sleep, poison ], null ),
			new AD("Wood Golem", 		8, one, [ "Claw:3d4" ], 				7, 92, 3, 	4, 0, 0, 1, false, 900, 0, large, [ sleep, poison ], null ),
			new AD("Flesh Golem", 		10, one, [ "Claw:2x2d8" ], 				9, 186, 8, 9, 30, 0, 1, false, 1400, 600, large, [sleep,poison], null ),
			new AD("Clay Golem",		12, one, [ "Claw:3d10" ], 				11,249, 7, 7, 40, 0, 1, false, 1550, 0, large, [ sleep, poison ], null ),
			new AD("Stone Golem", 		15, one, [ "Claw:3d8" ], 				14,345, 6, 5, 50, 0, 1, false, 1900, 0, large, [ sleep, poison ], null ),
			new AD("Glass Golem", 		18, one, [ "Claw:2x2d8" ], 				18,409, 6, 1, 50, 0, 1, false, 1800, 0, large, [ sleep, poison ], null ),
			new AD("Iron Golem", 		22, one, [ "Weapon:4d10", "Breath:4d6"],18,545, 6, 3, 60, 0, 1, false, 2000, 0, large, [ sleep, poison ], null ),

			// humans and elves

			//     name, 				df, no, attacks, 			lv,xp,sp, ac, mr,al,fq, 	geno, wt, 	nt, size, resists, 	chance->resistConveyed
			new AD("Human",				2, one, [ "Weapon:1d6" ], 	0, 6, 12, 10, 0, 0,	0, 		false, 1450, 400, medium, null, 	null ),
			new AD("Wererat", 			3, one, [ "Weapon:2d4" ], 	2, 22, 12,10, 10,-7, 1, 	false, 1450, 500, medium, null, 	1, [ lycanthropy ] ),
			new AD("Werejackal", 		3, one, [ "Weapon:2d4" ],	2, 22, 12, 10, 10, -7, 1, 	false, 1450, 400, medium, [poison], 1, [ lycanthropy ] ),
			new AD("Werewolf", 			6, one, [ "Weapon:2d4" ], 	5, 61, 12, 10, 20, -7, 1,	false, 1450, 400, medium, [poison], 1, [ lycanthropy ] ),
			new AD("Elf", 				12, one, ["Weapon:1d8" ], 	10, 216, 12, 10, 2, -3, 0, 	false, 800, 350, medium, [sleep], 	1, [sleep] ),
			new AD("Woodland-Elf", 		6, one, [ "Weapon:2d4" ], 	4, 46, 12, 10, 10, -5, 2, 	true, 800, 350, medium, [sleep], .27, [sleep] ),
			new AD("Green-Elf", 		7, one, [ "Weapon:2d4" ], 	5, 61, 12, 10, 10, -6, 2, 	true, 800, 350, medium, [sleep], .33, [sleep] ),
			new AD("Grey-Elf", 			8, one, [ "Weapon:2d4" ], 	6, 78, 12, 10, 10, -7, 2, 	true, 800, 350, medium, [sleep], .40, [sleep] ),
			new AD("Elf-Lord", 			11, one, [ "Weapon:2x2d4" ],8, 123, 12, 10, 20, -9, 2, 	true, 800, 350, medium, [sleep], .53, [sleep] ),
			new AD("Elvenking", 		11, one, [ "Weapon:2x2d4" ],9, 196, 12, 10, 25, -10, 1, true, 800, 3450, medium, [sleep], .60, [sleep] ),
			new AD("Doppelganger" ),
			new AD("Nurse" ),
			new AD("Shopkeeper" ),
			new AD("Guard" ),
			new AD("Prisoner" ),
			new AD("Oracle" ),
			new AD("Aligned Priest" ),
			new AD("High Priest" ),
			new AD("Soldier" ),
			new AD("Sergeant" ),
			new AD("Lieutenant" ),
			new AD("Captain" ),
			new AD("Watchman" ),
			new AD("Watch Captain" ),
			new AD("Medusa" ),
			new AD("Wizard of Yendor" ),
			new AD("Croesus" ),

			// ghosts and shades

			new AD("Ghost" ),
			new AD("Shade" ),

			// major demons

			//     name, 				df, no, attacks, 												lv,xp, sp, ac, mr,	al, fq, 	geno, wt, 	nt, size, resists, 	chance->resistConveyed
			new AD("Water Demon", 		11, one, [ "Weapon:1d3", "Claw:1d3", "Bite:1d3" ], 				8, 196, 12, -4, 30, -7, 0, false, 1450, 400, medium, [fire, poison], null),
			new AD("Horned Devil", 		9, 	one, [ "Weapon:1d4", "Claw:1d4", "Bite:2d3", "Sting:1d3" ], 6, 147, 9, -5, 50, 11, 2, false, 1450, 400, medium, [fire, poison], null ),
			new AD("Succubus", 			8, 	one, [ "Claw:2x1d3" ], 										6, 122, 12, 0, 70, -9, 1, false, 1450, 400, medium, [fire, poison], null ),
			new AD("Incubus", 			8, 	one, [ "Claw:2x1d3" ], 										6, 122, 12, 0, 70, -9, 1, false, 1450, 400, medium, [fire, poison], null ),
			new AD("Erinys", 			10, one, [ "Weapon:2d4" ], 										7, 158, 12, 2, 30, 10, 2, false, 1450, 400, medium, [fire, poison], null ),
			new AD("Barbed Devil", 		10, one, [ "Claw:2x2d4", "Sting:3d4" ],							8, 179, 12, 0, 35, 8, 2, false, 1450, 400, medium, [fire, poison], null ),
			new AD("Marilith" ),
			new AD("Vrock" ),
			new AD("Hezrou" ),
			new AD("Bone Devil" ),
			new AD("Ice Devil" ),
			new AD("Nalfeshnee" ),
			new AD("Pit Fiend" ),
			new AD("Balrog" ),
			new AD("Jubilex" ),
			new AD("Yeenoghu" ),
			new AD("Orcus" ),
			new AD("Geryon" ),
			new AD("Dispater" ),
			new AD("Baalzebub" ),
			new AD("Asmodeus" ),
			new AD("Demogorgon" ),
			new AD("Death" ),
			new AD("Pestilence" ),
			new AD("Famine" ),
			new AD("Mail Demon" ),
			new AD("Djinni" ),
			new AD("Sandestin" ),

			// sea monsters

			new AD("Jellyfish" ),
			new AD("Piranha" ),
			new AD("Shark" ),
			new AD("Giant Eel" ),
			new AD("Electric Eel" ),
			new AD("Kraken" ),

			// lizards

			new AD("Newt", 		1, one, [ "Bite:1d2" ], 	0, 1, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, null ),
			new AD("Gecko", 		2, one, [ "Bite:1d3" ], 	1, 8, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, null ),
			new AD("Iguana", 		3, one, [ "Bite:1d4" ], 	2, 17, 6, 7, 0, 	0, 5, true, 30, 30, tiny, null, null ),
			new AD("Baby Crocodile" ),
			new AD("Lizard" ),
			new AD("Chameleon" ),
			new AD("Crocodile" ),
			new AD("Salamander" ),
			new AD("Long Worm Entity" ),

			// player monsters

			new AD("Archeologist" ),
			new AD("Barbarian" ),
			new AD("Caveman" ),
			new AD("Cavewoman" ),
			new AD("Healer" ),
			new AD("Knight" ),
			new AD("Monk" ),
			new AD("Priest" ),
			new AD("Priestess" ),
			new AD("Ranger" ),
			new AD("Rogue" ),
			new AD("Samurai" ),
			new AD("Tourist" ),
			new AD("Valkyrie" ),
			new AD("Wizard" ),

			// quest leaders

			new AD("Unknown Quest Leader 1?" ),
			new AD("Lord Carnarvon" ),
			new AD("Pelias" ),
			new AD("Shaman Karnov" ),
			new AD("Unknown Quest Leader 2?" ),
			new AD("Hippocrates" ),
			new AD("King Arthur" ),
			new AD("Grand Master" ),
			new AD("Arch Priest" ),
			new AD("Orion" ),
			new AD("Master of Thieves" ),
			new AD("Lord Sato" ),
			new AD("Twoflower" ),
			new AD("Norn" ),
			new AD("Neferet the Green" ),

			// quest nemeses

			new AD("Minion of Huhetotl" ),
			new AD("Thoth Amon" ),
			new AD("Chromatic Dragon" ),
			new AD("Unknown Quest Nemesis 1?" ),
			new AD("Cyclops" ),
			new AD("Ixoth" ),
			new AD("Master Kaen" ),
			new AD("Nalzok" ),
			new AD("Scorpius" ),
			new AD("Master Assassin" ),
			new AD("Ashikaga Takauji" ),
			new AD("Lord Surtur" ),
			new AD("The Dark One" ),

			// quest guardians

			new AD("Student" ),
			new AD("Chieftan" ),
			new AD("Neanderthal" ),
			new AD("Unknown Quest Guardian 1?" ),
			new AD("Attendant" ),
			new AD("Page" ),
			new AD("Abbot" ),
			new AD("Acolyte" ),
			new AD("Hunter" ),
			new AD("Thug" ),
			new AD("Ninja" ),
			new AD("Roshi" ),
			new AD("Guide" ),
			new AD("Warrior" ),
			new AD("Apprentice" ),
		];

		return agentDatas;
	};

	DemoData.prototype.buildRoles = function()
	{
		var returnValues =
		[
			new Role("Rogue"),
			new Role("Wizard"),
		];

		return returnValues;
	};
}
