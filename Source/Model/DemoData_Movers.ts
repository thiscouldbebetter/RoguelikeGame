
class DemoData_Movers
{
	parent: DemoData_Main;
	mappableDefns: MappableDefn_Instances;

	constructor(parent: DemoData_Main)
	{
		this.parent = parent;

		this.mappableDefns = MappableDefn.Instances();
	}

	buildEntityDefnGroups_MoversAndCorpses
	(
		visualsByName: Map<string, Visual>,
		activityDefns: Map<string, ActivityDefn>,
		itemCategories: ItemCategory[]
	)
	{
		var entityDefnsMovers = new Array<Entity>();
		var entityDefnsMoversByName = new Map<string, Entity>();
		var entityDefnsCorpses = new Array<Entity>();
		var entityDefnsCorpsesByName = new Map<string, Entity>();

		//var sizeInPixels = visuals.get("Floor").size;

		this.buildEntityDefnGroups_MoversAndCorpses_Player
		(
			visualsByName, activityDefns, itemCategories, entityDefnsMovers
		);

		var rot = (universe: Universe, world: World, place: Place, entityTurnableAsEntity: Entity) =>
		{
			var entityTurnable = entityTurnableAsEntity as Entity2;
			var turnable = entityTurnable.turnable();
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

		var itemHolder = new ItemHolder
		(
			[], // itemEntities
			100, // massMax,
			0 // reachRadius
		);

		var agentDatas = this.buildAgentDatas();

		var useCorpse =
			(universe: Universe, world: World, place: Place, entityItem: Entity, user: Entity) =>
			{
				return "todo";
			};

		for (var i = 0; i < agentDatas.length; i++)
		{
			var agentData = agentDatas[i];
			var agentName = agentData.name;
			var difficulty: number = agentData.difficulty || 100; // todo
			var experienceToKill = agentData.baseExperience || 0;
			var movesPerTurn = agentData.speed || 0;

			var itemDefnName = agentName + " Corpse";
			var itemDefnCorpse = new ItemDefn
			(
				itemDefnName, // name
				itemDefnName, // appearance
				itemDefnName, // description
				1, // mass
				1, // tradeValue
				1, // stackSizeMax,
				[ "Food" ], // categoryNames
				useCorpse,
				null
			);
			var entityDefnCorpse = new Entity2
			(
				itemDefnCorpse.name,
				[
					new Locatable(null),
					new Item(itemDefnCorpse.name, 1),
					itemDefnCorpse,
					this.mappableDefns.Open,
					new Drawable(visualsByName.get("Corpse"), true),
					new Turnable(rot)
				]
			);
			//var entityDropChanceCorpse = new EntityDropChance(1, entityDefnCorpse);

			entityDefnsCorpses.push(entityDefnCorpse);
			entityDefnsCorpsesByName.set(itemDefnName, entityDefnCorpse);

			var entityDefnForAgent = new Entity2
			(
				agentName,
				// properties
				[
					new ActorDefn(activityDefns.get("Move Toward Player").name),
					this.mappableDefns.Transparent,
					itemHolder,
					new Demographics(null, null, difficulty, experienceToKill),
					new Drawable(visualsByName.get(agentName), true),
					new Generatable(1),
					new Killable(5, null, null),
					new Mover(movesPerTurn),
					new Namable2(agentName, agentName),
				]
			);

			entityDefnsMovers.push(entityDefnForAgent);
			entityDefnsMoversByName.set(agentName, entityDefnForAgent);
		}

		var entityGroupAgents = new EntityDefnGroup
		(
			"Agents",
			0, // relativeFrequency
			entityDefnsMovers
		);

		var entityGroupCorpses = new EntityDefnGroup
		(
			"Corpses",
			0, // relativeFrequency
			entityDefnsCorpses
		);

		var agentGroups = [ entityGroupAgents ];

		var entityDefnGroupsByDifficulty = new Map<number, EntityDefnGroup>();

		for (var i = 0; i < entityDefnsMovers.length; i++)
		{
			var entityDefnForAgent = entityDefnsMovers[i] as Entity2;
			var entityDemographics = entityDefnForAgent.demographics();
			var difficulty = (entityDemographics == null ? 100 : entityDemographics.rank);
			if (difficulty != null)
			{
				var entityDefnGroupForDifficulty =
					entityDefnGroupsByDifficulty.get(difficulty);
				if (entityDefnGroupForDifficulty == null)
				{
					entityDefnGroupForDifficulty = new EntityDefnGroup
					(
						"AgentsOfDifficulty" + difficulty,
						0, // relativeFrequency
						[]
					);
					entityDefnGroupsByDifficulty.set(difficulty, entityDefnGroupForDifficulty);
					agentGroups.push(entityDefnGroupForDifficulty);
				}

				entityDefnGroupForDifficulty.entityDefns.push(entityDefnForAgent);
			}
		}

		var returnValues = [ agentGroups, entityGroupCorpses ];

		return returnValues;
	}

	buildEntityDefnGroups_MoversAndCorpses_Player
	(
		visuals: Map<string, Visual>, activityDefns: Map<string, ActivityDefn>,
		itemCategories: ItemCategory[], returnValues: any
	)
	{
		var entityName = Player.name; // "Player".

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

		var visualForPlayerBase = visuals.get("Rogue");

		var visualReticleDirectional = new VisualDirectional
		(
			new VisualNone(), // visualForNoDirection
			[
				visuals.get("Reticle0"),
				visuals.get("Reticle1"),
				visuals.get("Reticle2"),
				visuals.get("Reticle3"),
				visuals.get("Reticle4"),
				visuals.get("Reticle5"),
				visuals.get("Reticle6"),
				visuals.get("Reticle7"),
			],
			null // headingInTurnsGetForEntity
		);

		var visualForPlayer = new VisualGroup
		([
			visualForPlayerBase,
			visualReticleDirectional
		]);

		var drawableDefnPlayer = new Drawable(visualForPlayer, true);

		var activityDefnName =
			activityDefns.get("Accept User Input").name;
			//activityDefns.get("Demo User Input").name;

		var equipmentSocketDefnGroup = new EquipmentSocketDefnGroup
		(
			"Equippable",
			[
				new EquipmentSocketDefn("Wielding", [ "Weapon" ] ),
				new EquipmentSocketDefn("Ammunition", [ "Ammunition" ] ),
				new EquipmentSocketDefn("Tool", [ "Wand", "Tool" ] ),
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

		var itemHolder = new ItemHolder
		(
			[
				new Item("Dagger", 1)
			],
			100, // weightMax
			0 // reachRange
		);

		var toControl = (u: Universe, size: Coords, e: Entity, isMenu: boolean) =>
		{
			var toControlMethod = (isMenu ? Playable.toControlMenu : (e as Entity2).player().toControlOverlay);
			var returnValue = toControlMethod(u, size, e, u.venueCurrent);
			return returnValue;
		};

		var controllable = new Controllable(toControl);

		var spellCaster = new SpellCaster([]);

		var entityDefnPlayer = new Entity2
		(
			entityName,
			// properties
			[
				new ActorDefn(activityDefnName),
				this.mappableDefns.Transparent,
				controllable,
				demographics,
				drawableDefnPlayer,
				new Effectable2(null),
				equipmentUser,
				itemHolder,
				new Killable(160, null, null),
				moverPlayer,
				new Player
				(
					8 // sightRange
				),
				spellCaster,
				new Starvable2(1000)
			]
		);

		returnValues.push(entityDefnPlayer);
		returnValues[entityName] = entityDefnPlayer;
	}

	buildAgentDatas()
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
		// var stun = "stun";
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

		var AD = AgentData;

		var agentDatas =
		[
			// insects

			//     name, 				df, no, 	attacks, 						lv,xp, sp, ac, mr, 	al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Giant Ant", 		4, "1d3", 	[ "Bite:1d4" ], 				2, 20, 18, 	3, 0, 	0, 3, 	true, 10, 	10, tiny, null, 		.33, 	null ),
			new AD("Killer Bee",		5, "2d6", 	[ "Sting:1d3" ],				1, 31, 18, -1, 0,	0, 2, 	true, 1, 	5, 	tiny, [ poison ], 	.33, 	[ poison ] ),
			new AD("Soldier Ant",		6, "1d3", 	[ "Bite:2d4", "Sting:3d4" ], 	3, 37, 18, 	3, 0, 	0, 2, 	true, 20, 	5, 	tiny, [ poison ], 	.33, 	[ poison ] ),
			new AD("Fire Ant", 			6, "1d3", 	[ "Bite:2d4", "Sting:2d4" ],	3, 34, 18, 	3, 10, 	0, 1, 	true, 30, 	10, tiny, [ fire ], 	.25,	[ fire ] ),
			new AD("Giant Beetle",		6, "1", 	[ "Bite:3d6" ],					5, 56, 6, 	4, 0,	0, 3, 	true, 10, 	10,	large, [ poison ], 	1, 		[ poison ], ),
			new AD("Queen Bee",			12, "1", 	[ "Sting:1d8" ], 				9, 225, 24, -4, 0, 	0, 0, 	true, 1, 	5, 	tiny, [ poison ], 	.25, 	[ poison ] ),

			// blobs

			//     name, 				df, no, 	attacks, 					lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, 												chance->resistConveyed
			new AD("Acid Blob", 		2, one, [ "Acid:1d8"  ],				1, 9, 	3, 8, 0,	0, 2, true, 30, 10, 	tiny, [sleep, poison, acid, petrify], 						.33, 	null ),
			new AD("Quivering Blob", 	6, one, [ "Touch:1d8" ],				5, 59, 	1, 8, 0, 	0, 2, true, 200, 100, 	small, [sleep, poison], 									.50, 	[ poison ] ),
			new AD("Gelatinous Cube", 	8, one, [ "Touch:2d4","Paralyze:1d4"], 	6, 76, 	6, 8, 0, 	0, 2, true, 600, 150, 	large, [ fire, cold, shock, sleep, poison, acid, petrify], 	1, 		[ fire, cold, shock, sleep ] ),

			// cockatrices

			//     name, 				df, no, 	attacks, 		lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, size, 	resists, 				chance->resistConveyed
			new AD("Chickatrice", 		7, "1d3", 	[ "Bite:1d2" ],	4, 136, 4, 8, 30,	0, 1, true, 10, 10, tiny, 	[ poison, petrify ], 	.25, [ poison ] ),
			new AD("Cockatrice", 		7, one, 	[ "Bite:1d3" ],	5, 149, 6, 6, 30,	0, 5, true, 30, 30, small, 	[ poison, petrify ], 	.50, [ poison ] ),
			new AD("Pyrolisk", 			8, one, 	[ "Gaze:2d6" ],	6, 82, 	6, 6, 30,	0, 1, true, 30, 30, small, 	[ fire, poison ], 		.33, [ fire, poison ] ),

			// canines

			//     name, 				df, no, 	attacks, 					lv,xp, 	sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Jackal", 			1, "1d3", [ "Bite:1d2" ],				0, 1, 12, 7, 0, 	0, 3, true, 300, 250, 	small, null, .50, null ),
			new AD("Fox",				1, one, [ "Bite:1d3" ],					0, 4, 15, 7, 0, 	0, 1, true, 300, 250, 	small, null, .33, null ),
			new AD("Coyote", 			2, "1d3", [ "Bite:1d4" ],				1, 8, 12, 7, 0,		0, 1, true, 300, 250, 	small, null, .33, null ),
			AD.fromName("Werejackal" ),
			new AD("Little Dog",		3, one, [ "Bite:1d6" ],					3, 2, 20, 18, 6,	0, 1, true, 150, 150, 	small, null, .33, null ),
			new AD("Dog",				5, one, [ "Bite:1d6" ], 				4, 4, 44, 16, 0, 	0, 1, true, 400, 200, 	medium, null, 1, [ aggravate ] ),
			new AD("Large Dog",			7, one, [ "Bite:2d4" ],					6, 76, 15, 4, 0, 	0, 1, true, 800, 250, 	medium, null, .33, null ),
			new AD("Dingo",				5, one, [ "Bite:1d5" ],					4, 44, 16, 5, 0,	0, 1, true, 400, 200, 	medium, null, .33, null ),
			new AD("Wolf",				6, "1d3", [ "Bite:2d4" ], 				6, 56, 12, 4, 0, 	0, 2, true, 500, 250, 	medium, null, .50, null ),
			AD.fromName("Werewolf" ),
			new AD("Warg",				8, "1d3", [ "Bite:2d6" ],				7, 92, 12, 4, 0, 	-5, 2, true, 850, 350, 	medium, null, 		.50, null ),
			new AD("Winter Wolf Cub", 	7, "1d3", [ "Bite:1d8", "Breath:1d8" ],	5, 64, 12, 4, 0, 	-5, 2, true, 250, 200, 	small, [ cold ], 	.33, [ cold ] ),
			new AD("Winter Wolf",		9, one, [ "Bite:2d6", "Breath:2d6" ],	7, 102, 12, 4, 20, 	0, 1, true, 700, 300, 	large, [ cold ], 	.47, [ cold ] ),
			new AD("Hell Hound Pup",	9, "1d3", [ "Bite:2d6", "Breath:2d6" ],	9, 102, 12, 4, 20, -5, 1, true, 200, 200, 	small,	[ fire ], 	.47, [ fire ] ),
			new AD("Hell Hound",		14, one, [ "Bite:3d6", "Breath:3d6"],	12, 290, 14, 2, 20, 0, 1, true, 600, 300, 	medium,	[ fire ], 	.47, [ fire ] ),
			AD.fromName("Cerberus" ),

			// eyes and spheres

			//     name, 				df, no, attacks, 			lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Gas Spore", 		2, one, [ "Explode:4d6" ],	2, 1, 12, 3, 10,  	0, 1, true, 10, 10, 	small, null, 	0, null),
			new AD("Floating Eye", 		3, one, [ ], 				2, 17, 1, 9, 10, 	0, 5, true, 10, 10, 	small, null, 	.50, [ telepathy, 1]),
			new AD("Flaming Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ cold ], 0, null ),
			new AD("Freezing Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ fire ], 0, null ),
			new AD("Shocking Sphere",	3, one, [ "Explode:4d6" ],	6, 91, 13, 4, 0, 	0, 2, true, 10, 10, 	small, [ shock ], 0, null ),
			AD.fromName("Beholder" ),

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

			AD.fromName("Gremlin" ), // .50
			AD.fromName("Gargoyle" ), // .50
			AD.fromName("Winged Gargoyle" ), // .33

			// humanoids

			new AD("Hobbit", 		2, one, [ "Weapon:1d6" ], 		1, 13, 9, 10, 0, 	6, 2, true, 500, 200, 	small, null, .50, null ),
			new AD("Dwarf", 		4, one, [ "Weapon:1d8" ],		2, 22, 6, 10, 10, 	4, 3, true, 900, 300, 	medium, null, .50, null ),
			AD.fromName("Bugbear" ), 		// 1.00
			AD.fromName("Dwarf Lord" ), 	// .50
			AD.fromName("Dwarf King" ), 	// .33
			AD.fromName("Mind Flayer" ),	// .33
			AD.fromName("Master Mind Flayer" ), // .33

			// minor demons

			//     name, 			df, no, attacks, 						lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, resists, chance->resistConveyed
			new AD("Manes", 		3, "2d6", [ "Claw:2x1d3", "Bite:1d4"], 	1, 8, 3, 7, 0,		-7, 1, true, 100, 100, small, [ sleep, poison ], 0, null ),
			new AD("Homunculus", 	3, one, [ "Bite:1d3" ], 				2, 19, 12, 6, 10, 	-7, 2, true, 60, 100, tiny, null, .33, [sleep, poison]),
			new AD("Imp", 			4, one, [ "Claw:1d4" ], 				3, 33, 12, 2, 20, 	-7, 1, true, 20, 10, tiny, null, .25, null ),
			new AD("Lemure", 		5, one, [ "Claw:1d3" ], 				3, 28, 3, 7, 0, 	-7, 1, true, 150, 100, medium, null, 0, [sleep, poison]), // 0 - ??
			new AD("Quasit", 		7, one, [ "Claw:2x1d2" ], 				3, 36, 15, 2, 20, -7, 2, true, 200, 200, small, [poison], .20, [poison] ), // .50 - ??
			new AD("Tengu", 		7, one, [ "Bite:1d7" ], 				6, 76, 13, 5, 30, 7, 3, true, 300, 200, small, [poison], .15, [poison, teleportControl, teleportitis] ), // .50 - ??

			// jellies

			AD.fromName("Blue Jelly" ), // .50
			AD.fromName("Spotted Jelly" ), // .33
			AD.fromName("Ochre Jelly" ), // .50

			// kobolds

			new AD("Kobold", 		1, one, [ "Weapon:1d4" ],		0, 6, 6, 10, 0, 	-2, 1, true, 400, 100, small, [ poison ], 0, null ),
			AD.fromName("Large Kobold" ),
			AD.fromName("Kobold Lord" ),
			AD.fromName("Kobold Shaman" ),

			// leprechauns

			AD.fromName("Leprechaun" ),

			// mimics

			new AD("Small Mimic", 	8, one, [ "Claw:3d4" ],		7, 92, 3, 7, 0,		0, 2, true, 300, 200, medium, [ acid ], 0, null ),
			new AD("Large Mimic", 	9, one, [ "Claw:3d4" ],		8, 113, 3, 7, 10,	0, 1, true, 600, 400, large, [ acid ], 0, null ),
			new AD("Giant Mimic", 	8, one, [ "Claw:2x3d4" ],		9, 186, 3, 7, 20,	0, 1, true, 800, 500, large, [ acid ], 0, null ),

			// nymphs

			new AD("Wood Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, 0, null ),
			new AD("Water Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, 0, null ),
			new AD("Mountain Nymph", 	5, one, [], 				3, 28, 12, 9, 20, 	0, 2, true, 600, 300, medium, null, 0, null ),

			// orcs

			new AD("Goblin", 		1, one, [ "Weapon:1d4" ], 		0, 6, 9, 10, 0, 	-3, 2, true, 400, 100, small, null, 0, null ),
			new AD("Hobgoblin", 		3, one, [ "Weapon:1d6" ],		1, 13, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, 0, null ),
			new AD("Orc", 		3, "2d6", [ "Weapon:1d8" ], 		1, 13, 9, 10, 0, 	-3, 0, true, 850, 150, medium, null, 0, null ),
			new AD("Hill Orc",		4, "2d6", [ "Weapon:1d6" ],		2, 22, 9, 10, 0,	-4, 2, true, 1000, 200, medium, null, 0, null ),
			AD.fromName("Mordor Orc" ),
			AD.fromName("Uruk-hai" ),
			AD.fromName("Orc Shaman" ),
			AD.fromName("Orc Captain" ),

			// piercer

			new AD("Rock Piercer",	4, one, [ "Bite:2d6" ],		3, 28, 1, 3, 0,		0, 4, true, 200, 200, small, null, 0, null ),
			new AD("Iron Piercer",	6, one, [ "Bite:3d6" ],		5, 63, 1, 0, 0,		0, 2, true, 400, 300, medium, null, 0, null ),
			new AD("Glass Piercer",	9, one, [ "Bite:4d6" ],		7, 106, 1, 0, 0,	0, 4, true, 400, 300, medium, [ acid ], 0, null ),

			// quadrupeds

			new AD("Rothe", 		4, one, [ "Claw:1d3", "Bite:1d8" ],	2, 17, 9, 7, 0, 	0, 4, true, 400, 100, large, null, 0, null ),
			AD.fromName("Mumak" ),
			AD.fromName("Leocrotta" ),
			AD.fromName("Wumpus" ),
			AD.fromName("Titanothere" ),
			AD.fromName("Baluchitherium" ),
			AD.fromName("Mastodon" ),

			// rodents

			new AD("Sewer Rat", 		1, "1d3", [ "Bite:1d3" ],		0, 1, 12, 7, 0,		0, 1, true, 20, 12, 	tiny, null, 0, null ),
			new AD("Giant Rat",		2, "1d3", [ "Bite:1d3" ],		1, 8, 10, 7, 0, 	0, 2, true, 30, 30, 	tiny, null, 0, null ),
			new AD("Rabid Rat",		4, one, [ "Bite:2d4" ],		2, 17, 12, 6, 0, 	0, 1, true, 30, 5, 	tiny, [ poison ], 0, null ),
			AD.fromName("Wererat" ),
			AD.fromName("Rock Mole" ),
			AD.fromName("Groundhog" ),

			// spiders and centipedes

			new AD("Cave Spider", 	3, "1d3", [ "Bite:1d2" ],		1, 8, 12, 3, 0, 	0, 2, true, 50, 50, 	tiny, [ poison ], .07, [ poison ] ),
			AD.fromName("Giant Millipede" ),
			AD.fromName("Giant Spider" ),
			AD.fromName("Scorpion" ),

			// trappers, lurkers above
			AD.fromName("Lurker Above" ),
			AD.fromName("Trapper" ),

			// horses and unicorns
			AD.fromName("White Unicorn" ),
			AD.fromName("Gray Unicorn" ),
			AD.fromName("Black Unicorn" ),
			AD.fromName("Pony" ),
			AD.fromName("Horse" ),
			AD.fromName("Warhorse" ),

			// vortices

			new AD("Fog Cloud", 		4, one, [ "Suffocate:1d6" ],		3, 38, 1, 0, 0, 	0, 2, true, 0, 0, 	huge, [ sleep, poison, petrify ], 0, null ),
			AD.fromName("Dust Vortex" ),
			AD.fromName("Ice Vortex" ),
			AD.fromName("Energy Vortex" ),
			AD.fromName("Steam Vortex" ),
			AD.fromName("Fire Vortex" ),

			// worms
			AD.fromName("Baby Long Worm" ),
			AD.fromName("Baby Purple Worm" ),
			AD.fromName("Long Worm" ),
			AD.fromName("Purple Worm" ),

			// fantastical insects
			new AD("Grid Bug", 		1, "1d3", [ "Bite:0d0"],		0, 1, 12, 9, 0, 	0, 3, true, 15, 10, 	tiny, [ shock, poison ], 0, null ),
			AD.fromName("Xan" ),

			// lights
			new AD("Yellow Light", 	5, one, [ ],				3, 44, 15, 0, 0, 	0, 4, true, 0, 0, 	small, [ fire, cold, shock, disintegrate, sleep, poison, acid, petrify ], 0, null ),
			AD.fromName("Black Light" ),

			// zruties

			AD.fromName("Zruty" ),

			// angelic beings
			//     name, 		df, no, attacks, 									lv,xp, sp,ac,mr, 	al,fq,geno, wt, nt, 	size, 	resists, 					chance->resistConveyed
			AD.fromName("Couatl" ),
			new AD("Aleax", 	12, one,[ "Weapon:1d6", "Weapon:1d6", "Kick:1d4" ], 10, 298, 8, 0, 30, 	7, 1, true, 1450, 400, 	medium, [cold,shock,sleep,poison], 0, null),
			AD.fromName("Angel" ),
			AD.fromName("Ki-rin" ),
			AD.fromName("Archon" ),

			// bats and birds

			new AD("Bat", 			2, one, [ "Bite:1d4" ], 		0, 6, 22, 8, 0,		0, 1, true, 20, 20, 	tiny, null, 0, null ),
			new AD("Giant Bat", 	3, one, [ "Bite:1d6" ],		2, 22, 22, 7, 0, 	0, 2, true, 30, 30, 	small, null, 0, null ),
			AD.fromName("Raven" ),
			AD.fromName("Vampire Bat" ),

			// centaurs

			AD.fromName("Plains Centaur" ),
			AD.fromName("Forest Centaur" ),
			AD.fromName("Mountain Centaur" ),

			// dragons

			AD.fromName("Baby Gray Dragon" ),
			AD.fromName("Baby Silver Dragon" ),
			AD.fromName("Baby Shimmering Dragon" ),
			AD.fromName("Baby Red Dragon" ),
			AD.fromName("Baby White Dragon" ),
			AD.fromName("Baby Orange Dragon" ),
			AD.fromName("Baby Black Dragon" ),
			AD.fromName("Baby Blue Dragon" ),
			AD.fromName("Baby Green Dragon" ),
			AD.fromName("Baby Yellow Dragon" ),
			AD.fromName("Gray Dragon" ),
			AD.fromName("Silver Dragon" ),
			AD.fromName("Shimmering Dragon" ),
			AD.fromName("Red Dragon" ),
			AD.fromName("White Dragon" ),
			AD.fromName("Orange Dragon" ),
			AD.fromName("Black Dragon" ),
			AD.fromName("Blue Dragon" ),
			AD.fromName("Green Dragon" ),
			AD.fromName("Yellow Dragon" ),

			// elementals and stalkers

			AD.fromName("Stalker" ),
			AD.fromName("Air Elemental" ),
			AD.fromName("Fire Elemental" ),
			AD.fromName("Earth Elemental" ),
			AD.fromName("Water Elemental" ),

			// fungi and molds

			new AD("Lichen", 			1, one, [ "Touch:0d0" ],		0, 4, 1, 9, 0,		0, 4, true, 20, 200, 	small, null, 0, null ),
			AD.fromName("Brown Mold" ),
			AD.fromName("Yellow Mold" ),
			AD.fromName("Green Mold" ),
			AD.fromName("Red Mold" ),
			AD.fromName("Shrieker" ),
			AD.fromName("Violet Fungus" ),

			// gnomes

			new AD("Gnome", 			3, one, [ "Weapon:1d6" ],		1, 13, 6, 10, 4,	0, 1, true, 650, 100, 	small, null, 0, null ),
			new AD("Gnome Lord", 		4, one, [ "Weapon:1d8" ],		3, 33, 8, 10, 4,	0, 2, true, 700, 120, 	small, null, 0, null ),
			new AD("Gnomish Wizard",	5, one, [ ],					3, 38, 10, 4, 10,	0, 1, true, 700, 120, 	small, null, 0, null ),
			new AD("Gnome King", 		6, one, [ "Weapon:1d6" ],		5, 61, 10, 10, 20,	0, 1, true, 750, 150, 	small, null, 0, null ),

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

			AD.fromName("Jabberwock" ),
			AD.fromName("[workaround for tile alignment bug]" ), // hack
			AD.fromName("Jabberwock 2" ),

			// keystone kops

			AD.fromName("Keystone Kop" ),
			AD.fromName("Kop Sergeant" ),
			AD.fromName("Kop Lieutenant" ),
			AD.fromName("Kop Kaptain" ),

			// liches

			AD.fromName("Lich" ),
			AD.fromName("Demilich" ),
			AD.fromName("Master Lich" ),
			AD.fromName("Arch-Lich" ),

			// mummies

			//     name, 				df, no, 	attacks, 		lv,xp, sp, ac, mr, 	al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Kobold Mummy", 		4, one, [ "Claw:1d4" ],		3, 28, 8, 6, 20, 	-2, 1, true, 400, 50, 	small, [ cold, sleep, poison ], 0, null ),
			new AD("Gnome Mummy", 		5, one, [ "Claw:1d6" ],		4, 41, 10, 6, 20, 	-3, 1, true, 650, 50, 	small, [ cold, sleep, poison ], 0, null ),
			new AD("Orc Mummy", 		6, one, [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 850, 75, 	medium, [ cold, sleep, poison ], 0, null ),
			new AD("Dwarf Mummy", 		6, one, [ "Claw:1d6" ],		5, 56, 10, 5, 20, 	-4, 1, true, 900, 150, 	medium, [ cold, sleep, poison ], 0, null ),
			new AD("Elf Mummy", 		7, one, [ "Claw:2d4" ],		6, 73, 12, 4, 30, 	-5, 1, true, 800, 150, 	medium, [ cold, sleep, poison ], 0, null ),
			new AD("Elf Mummy", 		7, one, [ "Claw:2x2d4" ],	6, 73, 12, 4, 30, 	-5, 1, true, 1450, 200, medium, [ cold, sleep, poison ], 0, null ),
			new AD("Ettin Mummy", 		8, one, [ "Claw:2x2d6" ],	7, 92, 12, 4, 30, 	-6, 1, true, 1700, 250, huge, [ cold, sleep, poison ], 0, null ),
			new AD("Giant Mummy", 		10, one, [ "Claw:2x3d4" ],	8, 116, 14, 3, 30, 	-7, 1, true, 2050, 375, huge, [ cold, sleep, poison ], 0, null ),

			// nagas

			//     name, 					df, no, 	attacks, 						lv,xp, sp, ac, mr, 		al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Red Naga Spawn", 		4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ fire, poison ], .1, [ fire, poison] ),
			new AD("Black Naga Spawn", 		4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ acid, poison, petrify ], .2, [ poison ] ),
			new AD("Golden Naga Spawn", 	4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ poison ], .2, [ poison ] ),
			new AD("Golden Naga Spawn", 	4, one, [ "Bite:1d4" ], 					3, 28, 10, 6, 0, 		0, 0, true, 500, 100, large, [ poison ], .2, [ poison ] ),
			new AD("Red Naga", 				8, one, [ "Bite:2d4", "Breath:2d6"], 		6, 82, 12, 4, 0,		-4, 1, true, 2600, 400, huge, [ fire, poison ], .2, [ fire, poison ] ),
			new AD("Black Naga", 			10, one, [ "Bite:2d6"], 					8, 132, 14, 2, 10, 		4, 1, true, 2600, 400, huge, [ poison, acid, petrify ], .2, [ poison ]),
			new AD("Golden Naga", 			13, one, [ "Bite:2d6", "Magic:4d6"],		10, 239, 14, 2, 70, 	5, 1, true, 2600, 400, huge, [ poison ], .2, [ poison ]),
			new AD("Guardian Naga", 		16, one, [ "Bite:1d6", "Spit:1d6", "Hug:2d4"],12, 295, 14, 2, 70, 	7, 1, true, 2600, 400, huge, [ poison ], .2, [ poison ]),

			// ogres

			//     name, 		df, no, attacks, 			lv,xp, sp, ac,mr, al,fq, 	geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Ogre", 		7, one, [ "Weapon:2d5" ], 	5, 61, 10, 5, 0, -3, 1, 	true, 1600, 600, large, null, 0, null ),
			new AD("Ogre Lord", 9, one, [ "Weapon:2d6" ], 	7, 97, 12, 3, 30, -5, 2, 	true, 1700, 700, large, null, 0, null ),
			new AD("Ogre King", 11, one, [ "Weapon:3d5" ], 	9, 194, 14, 4, 60, -7, 2,	true, 1700, 750, large, null, 0, null ),

			// puddings and amoeboids

			new AD("Gray Ooze", 		4, one, [ "Bite:2d8" ],		3, 28, 1, 8, 0,		0, 2, true, 500, 250, medium, [ fire, cold, poison, acid, petrify ], .07, [ poison, cold, fire ] ),
			AD.fromName("Brown Pudding" ),
			AD.fromName("Black Pudding" ),
			AD.fromName("Green Slime" ),

			// quantum mechanic

			AD.fromName("Quantum Mechanic" ),

			// rust monster and disenchanter

			AD.fromName("Rust Monster" ),
			AD.fromName("Disenchanter" ),

			// snakes
			new AD("Garter Snake", 	3, one, [ "Bite:1d2" ], 		1, 8, 8, 8, 0, 		0, 1, true, 50, 60, 	tiny, null, 0, null ),
			AD.fromName("Snake" ),
			AD.fromName("Water Moccasin" ),
			AD.fromName("Pit Viper" ),
			AD.fromName("Python" ),
			AD.fromName("Cobra" ),

			// trolls

			AD.fromName("Troll" ),
			AD.fromName("Ice Troll" ),
			AD.fromName("Rock Troll" ),
			AD.fromName("Water Troll" ),
			AD.fromName("Olog-Hai" ),

			// umber hulk

			AD.fromName("Umber Hulk" ),

			// vampires

			AD.fromName("Vampire" ),
			AD.fromName("Vampire Lord" ),
			AD.fromName("Vampire 2" ),
			AD.fromName("Vlad the Impaler" ),

			// wraiths

			AD.fromName("Barrow Wight" ),
			AD.fromName("Wraith" ),
			AD.fromName("Nazgul" ),

			// xorn

			AD.fromName("Xorn" ),

			// apelike creatures

			AD.fromName("Monkey" ),
			AD.fromName("Ape" ),
			AD.fromName("Owlbear" ),
			AD.fromName("Yeti" ),
			AD.fromName("Carnivorous Ape" ),
			AD.fromName("Sasquatch" ),

			// zombies

			AD.fromName("Kobold Zombie" ),
			AD.fromName("Gnome Zombie" ),
			AD.fromName("Orc Zombie" ),
			AD.fromName("Dwarf Zombie" ),
			AD.fromName("Elf Zombie" ),
			AD.fromName("Human Zombie" ),
			AD.fromName("Ettin Zombie" ),
			AD.fromName("Giant Zombie" ),
			AD.fromName("Ghoul" ),
			AD.fromName("Skeleton" ),

			// golems

			//     name, 				df, no, attacks, 						lv,xp, sp, ac, mr,al,fq, geno, wt, 	nt, size, resists, 		chance->resistConveyed
			new AD("Straw Golem", 		4, one, [ "Claw:2x1d2" ], 				3, 28, 12, 10, 0, 0, 1, false, 400, 0, large, [ sleep, poison ], 0, null ),
			new AD("Paper Golem", 		4, one, [ "Claw:1d3" ], 				3, 31, 12, 10, 0, 0, 1, false, 400, 0, large, [ sleep, poison ], 0, null ),
			new AD("Rope Golem",		6, one, [ "Claw:2x1d4", "Choke:6d1"],	4, 44, 9, 	8, 0, 0, 1, false, 450, 0, large, [ sleep, poison ], 0, null ),
			new AD("Gold Golem",		6, one, [ "Claw:2x2d3" ], 				5, 56, 9, 	6, 0, 0, 1, false, 450, 0, large, [ sleep, poison ], 0, null ),
			new AD("Leather Golem", 	7, one, [ "Claw:2x1d6" ], 				6, 73, 6, 	6, 0, 0, 1, false, 800, 0, large, [ sleep, poison ], 0, null ),
			new AD("Wood Golem", 		8, one, [ "Claw:3d4" ], 				7, 92, 3, 	4, 0, 0, 1, false, 900, 0, large, [ sleep, poison ], 0, null ),
			new AD("Flesh Golem", 		10, one, [ "Claw:2x2d8" ], 				9, 186, 8, 9, 30, 0, 1, false, 1400, 600, large, [sleep,poison], 0, null ),
			new AD("Clay Golem",		12, one, [ "Claw:3d10" ], 				11,249, 7, 7, 40, 0, 1, false, 1550, 0, large, [ sleep, poison ], 0, null ),
			new AD("Stone Golem", 		15, one, [ "Claw:3d8" ], 				14,345, 6, 5, 50, 0, 1, false, 1900, 0, large, [ sleep, poison ], 0, null ),
			new AD("Glass Golem", 		18, one, [ "Claw:2x2d8" ], 				18,409, 6, 1, 50, 0, 1, false, 1800, 0, large, [ sleep, poison ], 0, null ),
			new AD("Iron Golem", 		22, one, [ "Weapon:4d10", "Breath:4d6"],18,545, 6, 3, 60, 0, 1, false, 2000, 0, large, [ sleep, poison ], 0, null ),

			// humans and elves

			//     name, 				df, no, attacks, 			lv,xp,sp, ac, mr,al,fq, 	geno, wt, 	nt, size, resists, 	chance->resistConveyed
			new AD("Human",				2, one, [ "Weapon:1d6" ], 	0, 6, 12, 10, 0, 0,	0, 		false, 1450, 400, medium, null, 	0, null ),
			new AD("Wererat", 			3, one, [ "Weapon:2d4" ], 	2, 22, 12,10, 10,-7, 1, 	false, 1450, 500, medium, null, 	1, [ lycanthropy ] ),
			new AD("Werejackal", 		3, one, [ "Weapon:2d4" ],	2, 22, 12, 10, 10, -7, 1, 	false, 1450, 400, medium, [poison], 1, [ lycanthropy ] ),
			new AD("Werewolf", 			6, one, [ "Weapon:2d4" ], 	5, 61, 12, 10, 20, -7, 1,	false, 1450, 400, medium, [poison], 1, [ lycanthropy ] ),
			new AD("Elf", 				12, one, ["Weapon:1d8" ], 	10, 216, 12, 10, 2, -3, 0, 	false, 800, 350, medium, [sleep], 	1, [sleep] ),
			new AD("Woodland-Elf", 		6, one, [ "Weapon:2d4" ], 	4, 46, 12, 10, 10, -5, 2, 	true, 800, 350, medium, [sleep], .27, [sleep] ),
			new AD("Green-Elf", 		7, one, [ "Weapon:2d4" ], 	5, 61, 12, 10, 10, -6, 2, 	true, 800, 350, medium, [sleep], .33, [sleep] ),
			new AD("Grey-Elf", 			8, one, [ "Weapon:2d4" ], 	6, 78, 12, 10, 10, -7, 2, 	true, 800, 350, medium, [sleep], .40, [sleep] ),
			new AD("Elf-Lord", 			11, one, [ "Weapon:2x2d4" ],8, 123, 12, 10, 20, -9, 2, 	true, 800, 350, medium, [sleep], .53, [sleep] ),
			new AD("Elvenking", 		11, one, [ "Weapon:2x2d4" ],9, 196, 12, 10, 25, -10, 1, true, 800, 3450, medium, [sleep], .60, [sleep] ),
			AD.fromName("Doppelganger" ),
			AD.fromName("Nurse" ),
			AD.fromName("Shopkeeper" ),
			AD.fromName("Guard" ),
			AD.fromName("Prisoner" ),
			AD.fromName("Oracle" ),
			AD.fromName("Aligned Priest" ),
			AD.fromName("High Priest" ),
			AD.fromName("Soldier" ),
			AD.fromName("Sergeant" ),
			AD.fromName("Lieutenant" ),
			AD.fromName("Captain" ),
			AD.fromName("Watchman" ),
			AD.fromName("Watch Captain" ),
			AD.fromName("Medusa" ),
			AD.fromName("Wizard of Yendor" ),
			AD.fromName("Croesus" ),

			// ghosts and shades

			AD.fromName("Ghost" ),
			AD.fromName("Shade" ),

			// major demons

			//     name, 				df, no, attacks, 												lv,xp, sp, ac, mr,	al, fq, 	geno, wt, 	nt, size, resists, 	chance->resistConveyed
			new AD("Water Demon", 		11, one, [ "Weapon:1d3", "Claw:1d3", "Bite:1d3" ], 				8, 196, 12, -4, 30, -7, 0, false, 1450, 400, medium, [fire, poison], 0, null),
			new AD("Horned Devil", 		9, 	one, [ "Weapon:1d4", "Claw:1d4", "Bite:2d3", "Sting:1d3" ], 6, 147, 9, -5, 50, 11, 2, false, 1450, 400, medium, [fire, poison], 0, null ),
			new AD("Succubus", 			8, 	one, [ "Claw:2x1d3" ], 										6, 122, 12, 0, 70, -9, 1, false, 1450, 400, medium, [fire, poison], 0, null ),
			new AD("Incubus", 			8, 	one, [ "Claw:2x1d3" ], 										6, 122, 12, 0, 70, -9, 1, false, 1450, 400, medium, [fire, poison], 0, null ),
			new AD("Erinys", 			10, one, [ "Weapon:2d4" ], 										7, 158, 12, 2, 30, 10, 2, false, 1450, 400, medium, [fire, poison], 0, null ),
			new AD("Barbed Devil", 		10, one, [ "Claw:2x2d4", "Sting:3d4" ],							8, 179, 12, 0, 35, 8, 2, false, 1450, 400, medium, [fire, poison], 0, null ),
			AD.fromName("Marilith" ),
			AD.fromName("Vrock" ),
			AD.fromName("Hezrou" ),
			AD.fromName("Bone Devil" ),
			AD.fromName("Ice Devil" ),
			AD.fromName("Nalfeshnee" ),
			AD.fromName("Pit Fiend" ),
			AD.fromName("Balrog" ),
			AD.fromName("Jubilex" ),
			AD.fromName("Yeenoghu" ),
			AD.fromName("Orcus" ),
			AD.fromName("Geryon" ),
			AD.fromName("Dispater" ),
			AD.fromName("Baalzebub" ),
			AD.fromName("Asmodeus" ),
			AD.fromName("Demogorgon" ),
			AD.fromName("Death" ),
			AD.fromName("Pestilence" ),
			AD.fromName("Famine" ),
			AD.fromName("Mail Demon" ),
			AD.fromName("Djinni" ),
			AD.fromName("Sandestin" ),

			// sea monsters

			AD.fromName("Jellyfish" ),
			AD.fromName("Piranha" ),
			AD.fromName("Shark" ),
			AD.fromName("Giant Eel" ),
			AD.fromName("Electric Eel" ),
			AD.fromName("Kraken" ),

			// lizards

			new AD("Newt", 		1, one, [ "Bite:1d2" ], 	0, 1, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, 0, null ),
			new AD("Gecko", 		2, one, [ "Bite:1d3" ], 	1, 8, 6, 8, 0, 		0, 5, true, 10, 20, tiny, null, 0, null ),
			new AD("Iguana", 		3, one, [ "Bite:1d4" ], 	2, 17, 6, 7, 0, 	0, 5, true, 30, 30, tiny, null, 0, null ),
			AD.fromName("Baby Crocodile" ),
			AD.fromName("Lizard" ),
			AD.fromName("Chameleon" ),
			AD.fromName("Crocodile" ),
			AD.fromName("Salamander" ),
			AD.fromName("Long Worm Head" ),

			// player monsters

			AD.fromName("Archeologist" ),
			AD.fromName("Barbarian" ),
			AD.fromName("Caveman" ),
			AD.fromName("Cavewoman" ),
			AD.fromName("Healer" ),
			AD.fromName("Knight" ),
			AD.fromName("Monk" ),
			AD.fromName("Priest" ),
			AD.fromName("Priestess" ),
			AD.fromName("Ranger" ),
			AD.fromName("Rogue" ),
			AD.fromName("Samurai" ),
			AD.fromName("Tourist" ),
			AD.fromName("Valkyrie" ),
			AD.fromName("Wizard" ),

			// quest leaders

			AD.fromName("Lord Carnarvon" ),
			AD.fromName("Pelias" ),
			AD.fromName("Shaman Karnov" ),
			AD.fromName("Earendil" ),
			AD.fromName("Elwing" ),
			AD.fromName("Hippocrates" ),
			AD.fromName("King Arthur" ),
			AD.fromName("Grand Master" ),
			AD.fromName("Arch Priest" ),
			AD.fromName("Orion" ),
			AD.fromName("Master of Thieves" ),
			AD.fromName("Lord Sato" ),
			AD.fromName("Twoflower" ),
			AD.fromName("Norn" ),
			AD.fromName("Neferet the Green" ),

			// quest nemeses

			AD.fromName("Minion of Huhetotl" ),
			AD.fromName("Thoth Amon" ),
			AD.fromName("Chromatic Dragon" ),
			AD.fromName("Goblin King" ),
			AD.fromName("Cyclops" ),
			AD.fromName("Ixoth" ),
			AD.fromName("Master Kaen" ),
			AD.fromName("Nalzok" ),
			AD.fromName("Scorpius" ),
			AD.fromName("Master Assassin" ),
			AD.fromName("Ashikaga Takauji" ),
			AD.fromName("Lord Surtur" ),
			AD.fromName("The Dark One" ),

			// quest guardians

			AD.fromName("Student" ),
			AD.fromName("Chieftan" ),
			AD.fromName("Neanderthal" ),
			AD.fromName("High-elf" ),
			AD.fromName("Attendant" ),
			AD.fromName("Page" ),
			AD.fromName("Abbot" ),
			AD.fromName("Acolyte" ),
			AD.fromName("Hunter" ),
			AD.fromName("Thug" ),
			AD.fromName("Ninja" ),
			AD.fromName("Roshi" ),
			AD.fromName("Guide" ),
			AD.fromName("Warrior" ),
			AD.fromName("Apprentice" ),
		];

		return agentDatas;
	}

	buildRoles()
	{
		var returnValues =
		[
			new Role("Rogue"),
			new Role("Wizard"),
		];

		return returnValues;
	}
}

class AgentData
{
	name: string;
	difficulty: number;
	numberAppearing: string;
	attacks: string[];
	baseLevel: number;
	baseExperience: number;
	speed: number;
	baseArmorClass: number;
	baseMagicResistance: number;
	alignment: number;
	frequency: number;
	isGenocidable: boolean;
	weight: number;
	nutrition: number;
	size: number;
	resistances: any;
	chanceOfConveyingResistance: number;
	resistancesConveyed: any;

	constructor
	(
		name: string, difficulty: number, numberAppearing: string,
		attacks: string[], baseLevel: number, baseExperience: number,
		speed: number, baseArmorClass: number,
		baseMagicResistance: number, alignment: number,
		frequency: number, isGenocidable: boolean,
		weight: number, nutrition: number, size: number, resistances: any,
		chanceOfConveyingResistance: number, resistancesConveyed: any
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
		this.chanceOfConveyingResistance = chanceOfConveyingResistance;
		this.resistancesConveyed = resistancesConveyed;

		// todo - Corpse drop frequency
	}

	static fromName(name: string)
	{
		return new AgentData
		(
			name,
			999, // difficulty: number;
			"1d1", // numberAppearing: string;
			new Array<string>(), // attacks: string[];
			0, // baseLevel: number;
			0, // baseExperience: number;
			0, // speed: number;
			0, // baseArmorClass: number;
			0, // baseMagicResistance: number;
			0, // alignment: number;
			0, // frequency: number;
			true, // isGenocidable: boolean;
			1, // weight: number;
			0, // nutrition: number;
			1, // size: Coords;
			new Array<any>(), // resistances: any;
			0, // chanceOfConveyingResistence: number;
			new Array<any>() // resistancesConveyed: any;
		);
	}
}
