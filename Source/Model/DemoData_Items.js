// partial class DemoData
{
	DemoData.prototype.buildEntityDefnGroups_Items = function(images, itemCategories)
	{
		// convenience variables

		var categoriesCommon =
		[
			"Collidable",
			"Drawable",
			"Item",
		];

		var sizeInPixels = images["Floor"].sizeInPixels;

		var itemPropertiesNoStack = new ItemDefn
		(
			"[noStack]",
			"[Appearance]",
			1, // mass
			1, // stackSizeMax
			1, // relativeFrequency
			[], // categoryNames
			null, // initialize
			null // use
		);

		var itemPropertiesStandard = new ItemDefn
		(
			"[standard]",
			"[Appearance]",
			1, // mass
			999, // stackSizeMax
			1, // relativeFrequency
			[], // categoryNames
			null, // initialize
			null // use
		);

		var effectDefnDoNothing = new EffectDefn
		(
			"Do Nothing",
			function apply(world, targetEntity)
			{
				// do nothing
			}
		);

		var effectDoNothing = new Effect(effectDefnDoNothing);

		var entityDefnSets = [];

		var methodsToRun =
		[
			this.buildEntityDefns_Items_Amulets,
			this.buildEntityDefns_Items_Armor,
			this.buildEntityDefns_Items_Containers,
			this.buildEntityDefns_Items_Food,
			this.buildEntityDefns_Items_Potions,
			this.buildEntityDefns_Items_Rings,
			this.buildEntityDefns_Items_Scrolls,
			this.buildEntityDefns_Items_Spellbooks,
			this.buildEntityDefns_Items_Stones,
			this.buildEntityDefns_Items_Tools,
			this.buildEntityDefns_Items_Wands,
			this.buildEntityDefns_Items_Weapons,
		];

		var itemDefnGroups = [];

		for (var i = 0; i < methodsToRun.length; i++)
		{
			var methodToRun = methodsToRun[i];
			var itemDefnGroup = methodToRun.call
			(
				this,
				images,
				itemCategories,
				categoriesCommon,
				sizeInPixels,
				itemPropertiesNoStack,
				itemPropertiesStandard,
				effectDoNothing,
				[] // entityDefnSets
			);

			itemDefnGroups.push(itemDefnGroup);

			entityDefnSets.push(itemDefnGroup.entityDefns);
		}

		return itemDefnGroups;
	};

	DemoData.prototype.buildEntityDefns_Items_Amulets = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var namesOfAmulets =
		[
			"Change", "ESP", "Life Saving", "Magical Breathing",
			"Reflection", "Restful Sleep", "Strangulation",
			"Unchanging", "Poision Resistance"
		];

		var appearances =
		[
			"Circular", "Concave", "Hexagonal", "Octagonal",
			"Oval", "Pyramidal", "Square", "Spherical", "Triangular",
		];

		var entityDefnSetAmulets = [];

		for (var i = 0; i < namesOfAmulets.length; i++)
		{
			var name = "Amulet of " + namesOfAmulets[i];

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom() * appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Amulet";
			appearances.removeAt(appearanceIndex);

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						name,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Amulet" ], // categoryNames
						ItemDefn.InitializeDoNothing,
						ItemDefn.UseEquip
					),
				]
			);

			entityDefnSetAmulets.push(entityDefn);
		}

		var name = "Amulet of Yendor";
		var entityDefnAmuletOfYendor = new Entity
		(
			name,
			[
				collidableDefns.Clear,
				new Drawable(visuals[name]),
				new ItemDefn
				(
					name,
					name,
					1, // mass
					1, // stackSizeMax
					0, // relativeFrequency
					[ "Amulet" ], // categoryNames
					ItemDefn.InitializeDoNothing,
					ItemDefn.UseEquip
				),
			]
		);

		entityDefnSetAmulets.push(entityDefnAmuletOfYendor);

		entityDefnSets.push(entityDefnSetAmulets);

		return new EntityDefnGroup("Amulets", 1, entityDefnSets[0]);
	};

	DemoData.prototype.buildEntityDefns_Items_Containers = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var entityDefnChest = new Entity
		(
			"Chest",
			[
				itemPropertiesNoStack,
				new Drawable(visuals["Chest"]),
			]
		);

		entityDefnSets.push([entityDefnChest]);

		var returnValue = new EntityDefnGroup("Containers", 1, entityDefnSets[0]);

		return returnValue;
	}

	DemoData.prototype.buildEntityDefns_Items_Food = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		// items - foods

		var namesOfFoods =
		[
			"Eucalyptus Leaf",
			"Apple",
			"Orange",
			"Pear",
			"Melon",
			"Banana",
			"Carrot",
			"Sprig of Wolfsbane",
			"Garlic Clove",
			"Slime Mold",
			"Royal Jelly",
			"Cream Pie",
			"Candy Bar",
			"Fortune Cookie",
			"Pancake",
			"Lembas Wafer",
			"Cram Ration",
			"Food Ration",
			"K Ration",
			"C Ration",
			"Tin",
		];

		var effectNourish = new Effect
		(
			new EffectDefn
			(
				"Nourish",
				function apply(world, targetEntity)
				{
					var moverData = targetEntity.MoverData;
					moverData.vitals.addSatietyToMover(world, 1000, targetEntity);
					moverData.controlUpdate(world, targetEntity);
				}
			)
		);

		var entityDefnSetFoods = [];

		for (var i = 0; i < namesOfFoods.length; i++)
		{
			var name = namesOfFoods[i];

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Device
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							effectNourish
						]
					),
					new Drawable(visuals[name]),
					new ItemDefn
					(
						name,
						name, // appearance
						1, // mass
						1, // stackSizeMax,
						1, // relativeFrequency
						[ "Food" ], // categoryNames
						ItemDefn.InitializeDevice,
						ItemDefn.UseDevice
					)
				]
			);

			entityDefnSetFoods.push(entityDefn);
		}

		entityDefnSets.push(entityDefnSetFoods);

		return new EntityDefnGroup("Food", 1, entityDefnSets[0]);
	}

	DemoData.prototype.buildEntityDefns_Items_Potions = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		// items - magic - potions

		var ED = EffectDefn;

		var effectMessageNotImplemented = new EffectDefn
		(
			"Display Not Implemented Message",
			function apply(world, actingEntity, targetEntity)
			{
				var actingEntityDefnName = actingEntity.name;
				/*
				world.font.spawnMessageFloater
				(
					world,
					actingEntityDefnName,
					"NOT IMPLEMENTED - " + actingEntityDefnName,
					targetEntity.loc
				);
				*/

				targetEntity.controlUpdate(world);
			}
		);

		var namesAndEffectDefnsOfPotions =
		[
			[ "Acid" 		, new ED( null, function(w, ae, te) { te.MoverData.integrityAdd(-30); te.MoverData.controlUpdate(w, te); } ) ],
			[ "Blindness" 		, effectMessageNotImplemented ],
			[ "Booze" 		, effectMessageNotImplemented ],
			[ "Enlightenment" 	, effectMessageNotImplemented ],
			[ "Confusion" 		, effectMessageNotImplemented ],
			[ "Fruit Juice" 	, new ED( null, function(w, ae, te) { te.MoverData.vitals.addSatietyToMover(w, 100, targetEntity); te.MoverData.controlUpdate(targetEntity); } ) ],
			[ "Gain Ability" 	, new ED( null, function(w, ae, te) { te.MoverData.traits.strength += 1; te.MoverData.controlUpdate(w, te); } ) ],
			[ "Gain Energy" 	, new ED( null, function(w, ae, te) { te.MoverData.vitals.energy += 100; te.MoverData.controlUpdate(te); } ) ],
			[ "Gain Level" 		, new ED( null, function(w, ae, te) { te.MoverData.demographics.level += 1; te.MoverData.controlUpdate(te); } ) ],
			[ "Healing" 		, new ED( null, function(w, ae, te) { te.killableData.integrityAdd(10); te.MoverData.controlUpdate(w, te); } ) ],
			[ "Healing Extra" 	, new ED( null, function(w, ae, te) { te.killableData.integrityAdd(30); te.MoverData.controlUpdate(w, te); } ) ],
			[ "Healing Full" 	, new ED( null, function(w, ae, te) { te.killableData.integrityAdd(1000); te.MoverData.controlUpdate(w, te); } ) ],
			[ "Invisibility" 	, effectMessageNotImplemented ],
			[ "Levitation" 		, effectMessageNotImplemented ],
			[ "Monster Detection" 	, effectMessageNotImplemented ],
			[ "Paralysis" 		, effectMessageNotImplemented ],
			[ "Object Detection" 	, effectMessageNotImplemented ],
			[ "Oil" 		, effectMessageNotImplemented ],
			[ "Polymorph" 		, effectMessageNotImplemented ],
			[ "Restore aeility" 	, effectMessageNotImplemented ],
			[ "See Invisible" 	, effectMessageNotImplemented ],
			[ "Sickness" 		, new ED( null, function(w, ae, te) { te.killableData.integrityAdd(-20); te.MoverData.controlUpdate(w, te); } ) ],
			[ "Sleeping" 		, effectMessageNotImplemented ],
			[ "Speed" 		, effectMessageNotImplemented ],
			[ "Water" 		, effectMessageNotImplemented ],
		];

		var appearances =
		[
			"Ruby","Pink","Orange","Yellow",
			"Emerald","Dark Green","Sky Blue","Cyan",
			"Brilliant Blue","Magenta","Purple-Red","Puce",
			"Milky","Swirly","Bubbly","Smoky",
			"Cloudy","Effervescent","Black","Golden",
			"Brown","Fizzy","Dark","White",
			"Murky", "Clear",
		];

		var entityDefnSetPotions = [];

		for (var i = 0; i < namesAndEffectDefnsOfPotions.length; i++)
		{
			var itemDefnName = "Potion of " + name;

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Potion";
			appearances.removeAt(appearanceIndex);

			var potionData = namesAndEffectDefnsOfPotions[i];
			var name = potionData[0];
			var effectDefn = potionData[1];
			effectDefn.name = name;

			var entityDefn = new Entity
			(
				itemDefnName,
				[
					collidableDefns.Clear,
					new Device
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							new Effect(effectDefn)
						]
					),
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						itemDefnName,
						appearance,
						1, // mass
						1, // stackSizeMax,
						1, // relativeFrequency
						[ "Potion" ], // categoryNames
						ItemDefn.InitializeDevice,
						ItemDefn.UseDevice
					)
				]
			);

			entityDefnSetPotions.push(entityDefn);
		}

		entityDefnSets.push(entityDefnSetPotions);

		return new EntityDefnGroup("Potions", 1, entityDefnSets[0]);
	};

	DemoData.prototype.buildEntityDefns_Items_Rings = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		// items - magic - rings

		var namesOfRings =
		[
			"Adornment",		// 0
			"Aggravate Monster",
			"Conflict",
			"Free Action",
			"Gain Constitution",
			"Gain Strength",	// 5
			"Hunger",
			"Increase Accuracy",
			"Increase Damage",
			"Invisibility",
			"Levitation",		// 10
			"Polymorph",
			"Polymorph Control",
			"Protection",
			"Protection from Shape Changers",
			"Regeneration",		// 15
			"Resist Cold",
			"Resist Shock",
			"Resist Fire",
			"Resist Posion",
			"Searching",		// 20
			"See Invisible",
			"Slow Digestion",
			"Stealth",
			"Sustain Ability",
			"Teleport",		// 25
			"Teleport Control",
			"Warning",		// 27
		];

		appearances =
		[
			"Pearl","Iron","Twisted","Steel",
			"Wire","Engagement","Shiny","Bronze",
			"Brass","Copper","Silver","Gold",
			"Wooden","Granite","Opal","Clay",
			"Coral","Black Onyx","Moonstone","Tiger Eye",
			"Jade","Agate","Topaz","Sapphire",
			"Ruby","Diamond","Ivory","Emerald",
		];

		var entityDefnSetRings = [];

		for (var i = 0; i < namesOfRings.length; i++)
		{
			var name = "Ring of " + namesOfRings[i];

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom() * appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Ring";
			appearances.removeAt(appearanceIndex);

			entityDefnSetRings.push
			(
				new Entity
				(
					name,
					[
						collidableDefns.Clear,
						new Drawable(visuals[appearance]),
						new ItemDefn
						(
							name,
							appearance,
							1, // mass
							1, // stackSizeMax
							1, // relativeFrequency
							[ "Ring" ], // categoryNames
							ItemDefn.InitializeDoNothing,
							ItemDefn.UseEquip
						),
					]
				)
			);
		}

		entityDefnSets.push(entityDefnSetRings);

		return new EntityDefnGroup("Rings", 1, entityDefnSets[0]);
	};

	DemoData.prototype.buildEntityDefns_Items_Scrolls = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		// items - magic - scrolls

		var namesOfScrolls =
		[
			"Amnesia", // 0
			"Blank",
			"Charging",
			"Confuse Monster",
			"Create Monster",
			"Destroy Armor",  // 5
			"Detect Food",
			"Detect Gold",
			"Earth",
			"Enchant Armor",
			"Enchant Weapon", // 10
			"Fire",
			"Genocide",
			"Identify",
			"Light",
			"Mapping", // 15
			"Punishment",
			"Remove Curse",
			"Scare Monster",
			"Stinking Cloud",
			"Taming", // 20
			"Teleport", // 21
		];

		appearances =
		[
			"Andova Begarin", "Daiyen Fooels", "Duam Xnaht", "Eblib Yloh",
			"Elam Ebow", "Foobie Bletch", "Garven Deh", "Hackem Muche",
			"Juyed Awk Yacc", "Kernod Wel", "Kirje", "Lep Gex Ven Zea",
			"NR 9", "Pratyavayah", "Prirutsenie", "Read Me",
			"Temov", "Tharr", "Ve Forbryderne", "Velox Neb",
			"Venzar Borgavve", "Verr Yed Horre", "Xixaxa Xoxaxa Xuxaxa", "Yum Yum",
			"Zelgo Mer",
		];

		var entityDefnSetScrolls = [];

		for (var i = 0; i < namesOfScrolls.length; i++)
		{
			var name = "Scroll of " + namesOfScrolls[i];

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = "Scroll Titled '" + appearances[appearanceIndex] + "'";
			appearances.removeAt(appearanceIndex);

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Device
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							effectDoNothing
						]
					),
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						name,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Scroll" ], // categoryNames
						ItemDefn.InitializeDevice,
						ItemDefn.UseDevice
					),
				]
			);

			entityDefnSetScrolls.push(entityDefn);
		}

		entityDefnSets.push(entityDefnSetScrolls);

		var returnValue = new EntityDefnGroup("Scrolls", 1, entityDefnSetScrolls);

		return returnValue;
	}

	DemoData.prototype.buildEntityDefns_Items_Spellbooks = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var namesOfSpellbooks =
		[
			// attack

			"Force Bolt", // 0
			"Drain Life",
			"Magic Missile",
			"Cone of Cold",
			"Fireball",
			"Finger of Death",  // 5

			// clerical

			"Protection",
			"Create Monster",
			"Remove Curse",
			"Create Familiar",
			"Turn Undead", // 10

			// divination

			"Detect Monsters",
			"Light",
			"Detect Food",
			"Clairvoyance",
			"Detect Unseen", // 15
			"Identify",
			"Detect Treasure",
			"Magic Mapping",

			// enchantment
			"Sleep",
			"Confuse Monster", // 20
			"Slow Monster",
			"Cause Fear",
			"Charm Monster",

			// escape

			"Jumping",
			"Haste", // 25
			"Invisibility",
			"Levitation",
			"Teleport Away",

			// healing

			"Healing",
			"Cure Blindness", // 30
			"Cure Sickness",
			"Extra Healing",
			"Stone to Flesh",
			"Restore Ability",

			// matter

			"Knock", // 35
			"Wizard Lock",
			"Dig",
			"Polymorph",
			"Cancellation", // 39
 		];

		var appearances =
		[
			"Parchment","Vellum","Ragged","Dogeared",
			"Mottled","Stained","Cloth","Leather",
			"White","Pink","Red","Orange",
			"Yellow","Velvet","Light Green","Dark Green",
			"Turquoise","Cyan","Light Blue","Dark Blue",
			"Indigo","Magenta","Purple","Violet",
			"Tan","Plaid","Light Brown","Dark Brown",
			"Gray","Wrinkled","Dusty","Bronze",
			"Copper","Silver","Gold","Glittering",
			"Shining","Dull","Thin","Thick",
		];

		var entityDefnSetSpellbooks = [];

		for (var i = 0; i < namesOfSpellbooks.length; i++)
		{
			var nameOfSpellbook = namesOfSpellbooks[i];
			var itemDefnName = "Spellbook of " + nameOfSpellbook;

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Spellbook";
			appearances.removeAt(appearanceIndex);

			var effectLearnSpell = new Effect
			(
				new EffectDefn
				(
					"Learn Spell: " + nameOfSpellbook,
					function apply(world, targetEntity)
					{
						var spellToAdd = new SpellDefn("[Spell]");
						var spellsKnown = targetEntity.MoverData.spells.spells;

						var isSpellAlreadyKnown = false;
						for (var i = 0; i < spellsKnown.length; i++)
						{
							if (spellsKnown[i].name == spellToAdd.name)
							{
								isSpellAlreadyKnown = true;
								break;
							}
						}

						if (isSpellAlreadyKnown == false)
						{
							spellsKnown.push(spellToAdd);
						}
					}
				)
			);

			var entityDefn = new Entity
			(
				itemDefnName,
				[
					collidableDefns.Clear,
					new Device(10, true, [ effectLearnSpell ]),
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						itemDefnName,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Spellbook" ], // categoryNames
						ItemDefn.InitializeDevice,
						ItemDefn.UseDevice
					)
				]
			);

			entityDefnSetSpellbooks.push(entityDefn);
		}

		entityDefnSets.push(entityDefnSetSpellbooks);

		var returnValue = new EntityDefnGroup("Spellbooks", 1, entityDefnSets[0]);

		return returnValue;
	}

	DemoData.prototype.buildEntityDefns_Items_Wands = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var effectMessage = new Effect
		(
			new EffectDefn
			(
				"Display a Message",
				function apply(world, actingEntity, targetEntity)
				{
					var actingEntityDefnName = actingEntity.name;
					/*
					world.font.spawnMessageFloater
					(
						world,
						actingEntityDefnName,
						"NOT IMPLEMENTED - " + actingEntityDefnName,
						targetEntity.loc
					);
					*/

					targetEntity.controlUpdate(world);
				}
			)
		);

		var effectProjectileSpawn = new Effect
		(
			new EffectDefn
			(
				"Spawn Projectile",
				function apply(world, actingEntity, targetEntity)
				{
					var loc = targetEntity.Locatable.loc;
					var venue = loc.place(world);

					var entityForProjectile = new Entity
					(
						"Projectile0",
						world.defn.entityDefns["Rock"].name,
						loc.pos.clone()
					);

					venue.entitiesToSpawn.push(entityForProjectile);

					targetEntity.controlUpdate(world);
				}
			)
		);

		var effectTeleport = new Effect
		(
			new EffectDefn
			(
				"Teleport",
				function apply(world, actingEntity, targetEntity)
				{
					var loc = targetEntity.Locatable.loc;

					var teleportPos = null;
					while (teleportPos == null)
					{
						var map = loc.place(world).map;
						teleportPos = new Coords().randomize(randomizer).multiply
						(
							map.sizeInCells
						).floor();

						var cellToTeleportTo = map.cellAtPos(teleportPos);
						var cellTerrain = cellToTeleportTo.terrain(map);
						if (cellTerrain.costToTraverse > 1)
						{
							teleportPos = null;
						}
					}
					loc.pos.overwriteWith(teleportPos);

					targetEntity.controlUpdate(world);
					targetEntity.MoverData.controlUpdate(world, targetEntity);
				}
			)
		);

		var wandDatas =
		[
			[ "Cancelling", 	effectMessage ], // 0
			[ "Cold", 		effectProjectileSpawn ],
			[ "Create Monster", 	effectMessage ],
			[ "Death",		effectProjectileSpawn ],
			[ "Digging",		effectTeleport ],
			[ "Enlightenment",	effectMessage ], // 5
			[ "Fire",		effectProjectileSpawn ],
			[ "Light", 		effectMessage ],
			[ "Lightning", 		effectProjectileSpawn ],
			[ "Locking",		effectMessage ],
			[ "Make Invisible",	effectMessage ], // 10
			[ "Magic Missile",	effectProjectileSpawn ],
			[ "Nothing",		effectMessage ],
			[ "Opening",		effectMessage ],
			[ "Polymorph",		effectMessage ],
			[ "Probing",		effectMessage ], // 15
			[ "Secret Door Detection", effectMessage ],
			[ "Sleep",		effectMessage ],
			[ "Slow Monster",	effectMessage ],
			[ "Speed Monster", 	effectMessage ],
			[ "Striking",		effectProjectileSpawn ], // 20
			[ "Teleport",		effectTeleport ],
			[ "Turn Undead",	effectMessage ],
			[ "Wishing",		effectMessage ], // 23
		];

		appearances =
		[
			"Glass","Balsa","Crystal","Maple",
			"Pine","Oak","Ebony","Marble",
			"Tin","Brass","Copper","Silver",
			"Platinum","Iridium","Zinc","Aluminum",
			"Uranium","Iron","Steel","Hexagonal",
			"Short","Runed","Long","Curved",
			"Forked","Spiked","Jeweled",
		];

		var entityDefnSetWands = [];

		for (var i = 0; i < wandDatas.length; i++)
		{
			var wandData = wandDatas[i];
			var name = wandData[0];
			var effect = wandData[1];

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom(),
				appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Wand";
			appearances.removeAt(appearanceIndex);

			var wandName = "Wand of " + name;
			var entityDefnWand = new Entity
			(
				wandName,
				[
					collidableDefns.Clear,
					new Device
					(
						10, // chargesMax
						false, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							effect
						]
					),
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						wandName,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Wand" ], // categoryNames
						ItemDefn.InitializeDevice,
						ItemDefn.UseDevice
					),
				]
			);

			entityDefnSetWands.push(entityDefnWand);
		}

		entityDefnSets.push(entityDefnSetWands);

		return new EntityDefnGroup("Wands", 1, entityDefnSets[0]);

	}

	DemoData.prototype.buildEntityDefns_Items_MagicTools = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		// todo
	}

	DemoData.prototype.buildEntityDefns_Items_Weapons = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var namesAndAppearancesOfWeapons =
		[
			[ "Arrow", "Arrow" ],
			[ "Battle Axe", "Battle Axe" ],
			[ "Bow", "Bow" ],
			[ "Bow2", "Bow2" ],
			[ "Bow3", "Bow3" ],
			[ "Bow4", "Bow4" ],
			[ "Sling", "Sling" ],
			[ "Crossbow", "Crossbow" ],
			[ "Crossbow Bolt", "Crossbow Bolt" ],
			[ "Dagger", "Dagger" ],
			[ "Elven Dagger", "Runed Dagger" ],
			[ "Hand Axe", "Hand Axe" ],
			[ "Knife", "Knife" ],
			[ "Orcish Dagger", "Crude Dagger" ],
			[ "Polearm1", "Polearm1" ],
			[ "Silver Arrow", "Silver Arrow" ],
			[ "Sword", "Sword" ],
		];

		var entityDefnSetWeapons = [];

		for (var i = 0; i < namesAndAppearancesOfWeapons.length; i++)
		{
			var nameAndAppearance = namesAndAppearancesOfWeapons[i];
			var name = nameAndAppearance[0];
			var appearance = nameAndAppearance[1];

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						name,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Weapon" ], // categoryNames
						null, // initialize
						ItemDefn.UseEquip// use
					),
				]
			);

			entityDefnSetWeapons.push(entityDefn);
		};

		entityDefnSets["Group_Weapons"] = entityDefnSetWeapons;
		entityDefnSets.push(entityDefnSetWeapons);

		return new EntityDefnGroup("Weapons", 1, entityDefnSets[0]);
	}

	DemoData.prototype.buildEntityDefns_Items_Armor = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var headwear = categories["Headwear"];
		var bodyArmor = categories["BodyArmor"];
		var shirt = categories["Shirt"];
		var cloak = categories["Cloak"];
		var footwear = categories["Footwear"];
		var shield = categories["Shield"];

		var namesAndCategoriesOfArmor =
		[
			[ "Elven Leather Helmet",headwear ],
			[ "Orcish Helmet", 	headwear ],
			[ "Dwarvish Helmet", 	headwear ],
			[ "Black Hat", 		headwear ],
			[ "Cornuthaum", 	headwear ],
			[ "Dunce Cap",  	headwear ],
			[ "Cooking Pot",  	headwear ],
			[ "Plumed Helmet",  	headwear ],
			[ "Etched Helmet",  	headwear ],
			[ "Crested Helmet", 	headwear ],
			[ "Visored Helmet",  	headwear ],

			[ "Plate Mail", 	bodyArmor ],
			[  "Crystal Plate Mail", bodyArmor ],
			[ "Bronze Plate Mail", 	bodyArmor ],
			[ "Armor1", 		bodyArmor ],
			[ "Armor2", 		bodyArmor ],
			[ "Elven Mithril Shirt", bodyArmor],
			[ "Dwarven Mithril Shirt", bodyArmor],
			[ "Armor3", 		bodyArmor ],
			[ "Orcish Chain Mail", 	bodyArmor ],
			[ "Armor4", 		bodyArmor ],
			[ "Studded Leather Armor", bodyArmor ],
			[ "Armor5", 		bodyArmor ],
			[ "Armor6", 		bodyArmor ],
			[ "Leather Armor", 	bodyArmor ],
			[ "Leather Jacket", 	bodyArmor ],

			[ "Hawaiian Shirt",  	shirt],
			[ "Tee Shirt",  	shirt],

			[ "Mummy Wrapping",  	cloak ],
			[ "Elven Cloak",  	cloak ],
			[ "Leather Cloak",  	cloak ],
			[ "Hooded Cloak",  	cloak ],
			[ "Oilskin Cloak",  	cloak ],
			[ "Robe",  		cloak ],
			[ "Apron",  		cloak ],
			[ "Leather Cloak 2",  	cloak ],
			[ "Tattered Cloak",  	cloak ],
			[ "Opera Cloak",  	cloak ],
			[ "Ornamental Cope",  	cloak ],
			[ "Piece of Cloth",  	cloak ],

			[ "Low Boots", 		footwear ],
			[ "Dwarven Boots",  	footwear ],
			[ "High Boots",  	footwear ],
			[ "Combat Boots", 	footwear ],
			[ "Jungle Boots",  	footwear ],
			[ "Elven Boots",  	footwear ],
			[ "Mud Boots",  	footwear ],
			[ "Buckled Boots", 	footwear ],
			[ "Riding Boots", 	footwear ],
			[ "Snow Boots", 	footwear ],

			[ "Polished Shield", 	shield ],
			[ "Small Round Shield", shield ],
		];

		var entityDefnSetArmor = [];

		for (var i = 0; i < namesAndCategoriesOfArmor.length; i++)
		{
			var nameAndCategory = namesAndCategoriesOfArmor[i];
			var name = nameAndCategory[0];
			var appearance = name; // hack
			var category = nameAndCategory[1];

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						appearance,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Armor" , category.Name ], // categoryNames
						null, // initialize
						ItemDefn.UseEquip // use
					)
				]
			);

			entityDefnSetArmor.push(entityDefn);
		};

		entityDefnSets.push(entityDefnSetArmor);
		entityDefnSets["Group_Armor"] = entityDefnSetArmor;

		return new EntityDefnGroup("Armor", 1, entityDefnSets[0]);
	}

	DemoData.prototype.buildEntityDefns_Items_Tools = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var entityDefnSet = [];

		var namesAndAppearances =
		[
			[ "Key", ],
			[ "Lockpick"],
			[ "Credit Card" ],
			[ "Candle" ],
			[ "Candle2" ],
			[ "Lantern" ],
			[ "Oil Lamp" ],
			[ "Magic Lamp" ],
			[ "Expensive Camera" ],
			[ "Mirror" ],
			[ "Crystal Orb" ],
			[ "Eyeglasses" ],
			[ "Blindfold" ],
			[ "Towel" ],
			[ "Saddle" ],
			[ "Leash" ],
			[ "Stethoscope" ],
			[ "Tinning Kit" ],
			[ "Tin Opener" ],
			[ "Can of Grease" ],
			[ "Figurine" ],
			[ "Magic Marker" ],
			[ "Unarmed Land Mine" ],
			[ "Unarmed Bear Trap" ],
			[ "Tin Whistle" ],
			[ "Magic Whistle" ],
			[ "Flute" ],
			[ "Flute2" ],
			[ "Tooled Horn" ],
			[ "Horn of Cold" ],
			[ "Horn of Plenty" ],
			[ "Horn4" ],
			[ "Harp" ],
			[ "Harp2" ],
			[ "Bell" ],
			[ "Trumpet" ],
			[ "Drum" ],
			[ "Earthquake Drum" ],
			[ "Pickaxe" ],
			[ "Grappling Hook" ],
			[ "Unicorn Horn" ],
			[ "Candelabra" ],
			[ "Bell of Opening" ],
		];

		for (var i = 0; i < namesAndAppearances.length; i++)
		{
			var nameAndAppearance = namesAndAppearances[i];
			var name = nameAndAppearance[0];
			var appearance = nameAndAppearance[0]; // hack

			var entityDefn = new Entity
			(
				name,
				[
					collidableDefns.Clear,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						appearance,
						appearance,
						1, // mass
						1, // stackSizeMax
						1, // relativeFrequency
						[ "Tool" ], // categoryNames
						null, // initialize
						ItemDefn.UseEquip // use
					),

				]
			);

			entityDefnSet.push(entityDefn);
		};

		return new EntityDefnGroup("Tools", 1, entityDefnSet);
	}

	DemoData.prototype.buildEntityDefns_Items_Stones = function
	(
		visuals,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		var namesOfStones =
		[
			// precious stones

			"Dilithium Crystal", // 0
			"Diamond",
			"Ruby",
			"Jacinth",
			"Sapphire",
			"Black Opal", // 5
			"Emerald",
			"Turqoise",
			"Citrine",
			"Aquamarine",
			"Piece of Amber", // 10
			"Topaz",
			"Piece of Jet",
			"Opal",
			"Chrysoberyl",
			"Garnet", // 15
			"Amethyst",
			"Jasper",
			"Piece of Fluorite",
			"Piece of Jade",
			"Piece of Obsidian", // 20
			"Agate",

			// glass

			"White Glass",
			"Blue Glass",
			"Red Glass",
			"Yellowish Brown Glass", // 25
			"Orange Glass",
			"Yellow Glass",
			"Black Glass",
			"Green Glass",
			"Violet Glass", // 30

			// gray stones

			"Luckstone",
			"Loadstone",
			"Touchstone",
			"Flint",

			// rock

			"Rock", // 35
		];

		var appearancesOfStones =
		[
			"White Gem","White Gem","Red Gem","Orange Gem",
			"Blue Gem","Black Gem","Green Gem","Green Gem",
			"Yellow Gem","Green Gem","Brownish Gem","Brownish Gem",
			"Black Gem","White Gem","Yellow Gem","Red Gem",
			"Violet Gem","Red Gem","Violet Gem","Black Gem",
			"Orange Gem","Green Gem","White Gem", "Blue Gem",
			"Red Gem","Brownish Gem","Orange Gem", "Yellow Gem",
			"Black Gem","Green Gem","Violet Gem","Gray Stone",
			"Gray Stone","Gray Stone","Gray Stone","Rock",
		];

		var entityDefnSetStones = [];

		for (var i = 0; i < namesOfStones.length; i++)
		{
			var name = namesOfStones[i];
			var appearance = appearancesOfStones[i];

			entityDefnSetStones.push
			(
				new Entity
				(
					name,
					[
						collidableDefns.Clear,

						new Drawable(visuals[appearance]),
						new ItemDefn
						(
							name,
							appearance,
							1, // mass
							1, // stackSizeMax
							1, // relativeFrequency
							[ "Stone" ], // categoryNames
							ItemDefn.InitializeDoNothing,
							ItemDefn.UseDoNothing
						),
					]
				)
			);
		}

		entityDefnSets.push(entityDefnSetStones);
		entityDefnSets["Group_Stones"] = entityDefnSetStones;

		var entityDefnSetValuables = [];

		entityDefnSetValuables.push
		(
			new Entity
			(
				"Coins",
				[
					itemPropertiesStandard,
					new Drawable(visuals["Coins"]),
				].concatenateAll()
			)
		);

		entityDefnSets["Group_Valuables"] = entityDefnSetValuables;
		entityDefnSets.push(entityDefnSetValuables);

		return new EntityDefnGroup("Stones", 1, entityDefnSets[0]);
		return new EntityDefnGroup("Valuables", 1, entityDefnSets[1]);
	}

	DemoData.prototype.buildEntityDefns_Items_EquipmentSocketDefnSet = function(itemCategories)
	{
		var biped = new EquipmentSocketDefnSet
		(
			"Biped",
			[
				new EquipmentSocketDefn("Head", [ itemCategories.Headwear.name ]),
				new EquipmentSocketDefn("Neck", [ itemCategories.Neckwear.name ]),
				new EquipmentSocketDefn("Shirt", [ itemCategories.Shirt.name ]),
				new EquipmentSocketDefn("Entity", [ itemCategories.BodyArmor.name ]),
				new EquipmentSocketDefn("Cloak", [ itemCategories.Cloak.name ]),
				new EquipmentSocketDefn("Hands", [ itemCategories.Glove.name ] ),
				new EquipmentSocketDefn("Feet", [ itemCategories.Footwear.name ] ),
				new EquipmentSocketDefn("Left Finger", [ itemCategories.Ring.name ] ),
				new EquipmentSocketDefn("Right Finger", [ itemCategories.Ring.name ] ),
				new EquipmentSocketDefn("Wielding", [ itemCategories.Weapon.name ] ),
				new EquipmentSocketDefn("Ammunition", [ itemCategories.Ammunition.name ] ),
			]
		);

		return biped;
	};

	DemoData.prototype.buildItemCategories = function()
	{
		var returnValues =
		[
			new ItemCategory("Headwear"),
			new ItemCategory("Neckwear"),
			new ItemCategory("Shirt"),
			new ItemCategory("BodyArmor"),
			new ItemCategory("Cloak"),
			new ItemCategory("Glove"),
			new ItemCategory("Footwear"),
			new ItemCategory("Shield"),

			new ItemCategory("Armor"),
			new ItemCategory("Food"),
			new ItemCategory("Potion"),
			new ItemCategory("Ring"),
			new ItemCategory("Scroll"),
			new ItemCategory("Spellbook"),
			new ItemCategory("Tool"),
			new ItemCategory("Wand"),
			new ItemCategory("Weapon"),
			new ItemCategory("Ammunition"),
		];

		returnValues.addLookupsByName();

		return returnValues;
	};
}
