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
			[], // categoryNames
			null // use
		);

		var itemPropertiesStandard = new ItemDefn
		(
			"[standard]",
			"[Appearance]",
			1, // mass
			999, // stackSizeMax
			[], // categoryNames
			null // use
		);

		var effectDoNothing = new Effect();

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

		var relativeFrequencies =
		[
			1, 1, 1, 1, 1, 1, 1, 1, 1
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
			var relativeFrequency = relativeFrequencies[i];

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
					mappableDefns.Open,
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						name,
						appearance,
						1, // mass
						1, // stackSizeMax
						[ "Amulet" ], // categoryNames
						ItemDefn.UseEquip
					),
					new Generatable(relativeFrequency),
				]
			);

			entityDefnSetAmulets.push(entityDefn);
		}

		var name = "Amulet of Yendor";
		var entityDefnAmuletOfYendor = new Entity
		(
			name,
			[
				mappableDefns.Open,
				new Drawable(visuals[name]),
				new ItemDefn
				(
					name,
					name,
					1, // mass
					1, // stackSizeMax
					[ "Amulet" ], // categoryNames
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
		function Food(name, satiety, weight)
		{
			// todo
			this.name = name;
			this.satiety = satiety;
			this.weight = weight;
		}

		var foods =
		[
			// name, satiety, mass
			new Food("Apple", 			50, 	2 ),
			new Food("Banana", 			80, 	2 ),
			new Food("C Ration", 		300, 	10 ),
			new Food("Candy Bar", 		100, 	2 ),
			new Food("Carrot", 			50, 	2 ),
			new Food("Cram Ration", 	600, 	15 ),
			new Food("Cream Pie", 		100, 	10 ),
			new Food("Egg", 			80, 	1 ),
			new Food("Eucalyptus Leaf", 30, 	1 ),
			new Food("Food Ration", 	800, 	20 ),
			new Food("Fortune Cookie", 	40, 	1 ),
			new Food("Garlic Clove", 	40, 	1 ),
			new Food("K Ration", 		400, 	10 ),
			new Food("Lembas Wafer", 	800, 	5 ),
			new Food("Orange", 			80, 	2 ),
			new Food("Melon", 			100, 	5 ),
			new Food("Pancake", 		200, 	2 ),
			new Food("Pear", 			50, 	2 ),
			new Food("Royal Jelly", 	200, 	2 ),
			new Food("Slime Mold", 		80, 	5 ),
			new Food("Tin", 			50, 	10 ),
			new Food("Wolfsbane Sprig", 40, 	1 )
		];

		var entityDefnSetFoods = [];

		var useFood = function(universe, world, place, userEntity, usedEntity)
		{
			userEntity.starvable.satietyAdd(usedEntity.food.satiety);
			userEntity.itemHolder.itemEntityRemove(usedEntity);
		}

		var categoryNamesFood = [ "Food" ];

		for (var i = 0; i < foods.length; i++)
		{
			var food = foods[i];
			var relativeFrequency = 1; // todo

			var entityDefn = new Entity
			(
				name,
				[
					mappableDefns.Open,
					new Drawable(visuals[name]),
					food,
					new ItemDefn
					(
						name,
						name, // appearance
						name, // description
						food.weight, // mass
						1, // stackSizeMax,
						categoryNamesFood,
						useFood
					),
					new Generatable(relativeFrequency)
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
		var effectMessageNotImplemented = new Effect
		(
			function start(universe, world, place, entityEffectable)
			{
				var player = entityEffectable.player;
				if (player != null)
				{
					player.messageLog.messageAdd("Potion effect not yet implemented!");
				}
			}
		);

		var namesAndEffectDefnsOfPotions =
		[
			[ "Acid", 			new Effect( function start(u, w, p, e) { e.killable.integrityAdd(-30); e.player.controlUpdate(w, te); } ) ],
			[ "Blindness", 		effectMessageNotImplemented ],
			[ "Booze", 			effectMessageNotImplemented ],
			[ "Enlightenment", 	effectMessageNotImplemented ],
			[ "Confusion", 		effectMessageNotImplemented ],
			[ "Fruit Juice", 	new Effect( function start(u, w, p, e) { e.starvable.satietyAdd(w, 100, targetEntity); e.player.controlUpdate(targetEntity); } ) ],
			[ "Gain Ability", 	effectMessageNotImplemented ],
			[ "Gain Energy", 	effectMessageNotImplemented ],
			[ "Gain Level", 	new Effect( function start(u, w, p, e) { e.demographics.level += 1; e.player.controlUpdate(te); } ) ],
			[ "Healing", 		new Effect( function start(u, w, p, e) { e.killable.integrityAdd(10); e.player.controlUpdate(w, te); } ) ],
			[ "Healing Extra", 	new Effect( function start(u, w, p, e) { e.killable.integrityAdd(30); e.player.controlUpdate(w, te); } ) ],
			[ "Healing Full", 	new Effect( function start(u, w, p, e) { e.killable.integrityAdd(1000); e.player.controlUpdate(w, te); } ) ],
			[ "Invisibility", 	effectMessageNotImplemented ],
			[ "Levitation", 	effectMessageNotImplemented ],
			[ "Monster Detection", effectMessageNotImplemented ],
			[ "Paralysis" , 	effectMessageNotImplemented ],
			[ "Object Detection", effectMessageNotImplemented ],
			[ "Oil", 			effectMessageNotImplemented ],
			[ "Polymorph", 		effectMessageNotImplemented ],
			[ "Restore Ability", effectMessageNotImplemented ],
			[ "See Invisible", 	effectMessageNotImplemented ],
			[ "Sickness", 		new Effect( function start(u, w, p, e) { e.killable.integrityAdd(-20); e.player.controlUpdate(w, te); } ) ],
			[ "Sleeping", 		effectMessageNotImplemented ],
			[ "Speed", 			effectMessageNotImplemented ],
			[ "Water", 			effectMessageNotImplemented ],
		];

		var appearances =
		[
			"Ruby","Pink","Orange","Yellow",
			"Emerald","Dark Green","Sky Blue","Cyan",
			"Brilliant Blue","Magenta","Purple-Red","Puce",
			"Milky","Swirly","Bubbly","Smoky",
			"Cloudy","Effervescent","Black","Golden",
			"Brown","Fizzy","Dark","White",
			"Murky", "Clear"
		];

		var entityDefnSetPotions = [];

		var categoryNamesPotion = [ "Potion" ];

		var useItemPotion = function(universe, world, place, entityUsing, entityUsed)
		{
			var message = null;
			var player = entityUsing.player;
			if (player != null)
			{
				var item = entityUsed.item;
				var itemDefn = item.defn(world);
				message = "You drink the " + itemDefn.appearance + ".";
				player.messageLog.messageAdd(message);
				var effectable = entityUsing.effectable;
				effectable.effectorApply(entityUsed.effector);
				effectable.updateForTurn(universe, world, place, entityUsing);
			}
			return message;
		};

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
			var effect = potionData[1];
			var relativeFrequency = 1; // todo

			var itemDefn = new ItemDefn
			(
				itemDefnName,
				appearance,
				appearance, // description
				1, // mass
				1, // stackSizeMax,
				categoryNamesPotion,
				useItemPotion
			);

			var effector = new Effector([effect]);

			var entityDefn = new Entity
			(
				itemDefnName,
				[
					mappableDefns.Open,
					new Drawable(visuals[appearance]),
					effector,
					itemDefn,
					new Generatable(relativeFrequency)
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

		function Ring(name, effect)
		{
			this.name = name;
			this.effect = effect;
		}

		var effectPreventHunger = new Effect
		(
			"Prevent Hunger",
			function apply(universe, world, place, entityToApplyTo)
			{
				entityToApplyTo.starvable.satietyAdd(1);
			}
		);

		var equipTodo = function equip(universe, world, place, entityEquippable)
		{
			entityEquippable.effectable.effects.push(effectPreventHunger);
		};

		var namesOfRings =
		[
			new Ring("Adornment", 			equipTodo), // 0
			new Ring("Aggravate Monster", 	equipTodo),
			new Ring("Conflict", 			equipTodo),
			new Ring("Free Action", 		equipTodo),
			new Ring("Gain Constitution", 	equipTodo),
			new Ring("Gain Strength", 		equipTodo), // 5
			new Ring("Hunger", 				equipTodo),
			new Ring("Increase Accuracy", 	equipTodo),
			new Ring("Increase Damage", 	equipTodo),
			new Ring("Invisibility", 		equipTodo),
			new Ring("Levitation", 			equipTodo), // 10
			new Ring("Polymorph", 			equipTodo),
			new Ring("Polymorph Control", 	equipTodo),
			new Ring("Protection", 			equipTodo),
			new Ring("Protection from Shape Changers", equipTodo),
			new Ring("Regeneration", 		equipTodo), // 15
			new Ring("Resist Cold", 		equipTodo),
			new Ring("Resist Shock", 		equipTodo),
			new Ring("Resist Fire", 		equipTodo),
			new Ring("Resist Posion", 		equipTodo),
			new Ring("Searching", 			equipTodo), // 20
			new Ring("See Invisible", 		equipTodo),
			new Ring("Slow Digestion", 		equipTodo),
			new Ring("Stealth", 			equipTodo),
			new Ring("Sustain Ability", 	equipTodo),
			new Ring("Teleport", 			equipTodo), // 25
			new Ring("Teleport Control", 	equipTodo),
			new Ring("Warning", 			equipTodo), // 27
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
						mappableDefns.Open,
						new Drawable(visuals[appearance]),
						new ItemDefn
						(
							name,
							appearance,
							1, // mass
							1, // stackSizeMax
							[ "Ring" ], // categoryNames
							ItemDefn.UseEquip
						),
						new Generatable(1), // todo
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
		function Scroll(name, use)
		{
			this.name = name;
			this.use = use;
		}

		var useScrollNotImplemented = function(universe, world, place, entityUsing)
		{
			var message = "You read the scroll aloud."
			var player = entityUsing.player;
			if (player != null)
			{
				player.messageLog.messageAdd(message);
				player.messageLog.messageAdd("Scroll effect not yet implemented!");
			}

			return message;
		};

		var scrolls =
		[
			new Scroll("Amnesia", useScrollNotImplemented ),
			new Scroll("Blank", useScrollNotImplemented ),
			new Scroll("Charging", useScrollNotImplemented ),
			new Scroll("Confuse Monster", useScrollNotImplemented ),
			new Scroll("Create Monster", useScrollNotImplemented ),
			new Scroll("Destroy Armor", useScrollNotImplemented ),
			new Scroll("Detect Food", useScrollNotImplemented ),
			new Scroll("Detect Gold", useScrollNotImplemented ),
			new Scroll("Earth", useScrollNotImplemented ),
			new Scroll("Enchant Armor", useScrollNotImplemented ),
			new Scroll("Enchant Weapon", useScrollNotImplemented ),
			new Scroll("Fire", useScrollNotImplemented ),
			new Scroll("Genocide", useScrollNotImplemented ),
			new Scroll("Identify", useScrollNotImplemented ),
			new Scroll("Light", useScrollNotImplemented ),
			new Scroll("Mapping", useScrollNotImplemented ),
			new Scroll("Punishment", useScrollNotImplemented ),
			new Scroll("Remove Curse", useScrollNotImplemented ),
			new Scroll("Scare Monster", useScrollNotImplemented ),
			new Scroll("Stinking Cloud", useScrollNotImplemented ),
			new Scroll("Taming", useScrollNotImplemented ),
			new Scroll("Teleport", useScrollNotImplemented ),
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

		var categoryNamesScroll = [ "Scroll" ];

		var mass = 1; // todo

		for (var i = 0; i < scrolls.length; i++)
		{
			var scroll = scrolls[i];
			var name = "Scroll of " + scroll.name;

			var appearance = appearances.random(this.randomizer);
			appearances.remove(appearance);
			appearance = "Scroll Titled '" + appearance + "'";

			var entityDefn = new Entity
			(
				name,
				[
					mappableDefns.Open,
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						name,
						appearance,
						appearance, // description
						mass,
						1, // stackSizeMax
						categoryNamesScroll,
						scroll.use
					),
					new Generatable(1) // todo
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

		var device = new Device
		(
			name,
			null, null, // init, update
			this.itemEffectorApply
		);

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

			// todo
			var effectLearnSpell = new Effect
			(
				"Learn Spell: " + nameOfSpellbook,
				function apply(world, targetEntity)
				{
					var spellToAdd = new SpellDefn("[Spell]");
					var spellsKnown = targetEntity.mover.spells.spells;

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
			);

			var entityDefn = new Entity
			(
				itemDefnName,
				[
					mappableDefns.Open,
					device,
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						itemDefnName,
						appearance,
						appearance, // description
						1, // mass
						1, // stackSizeMax
						[ "Spellbook" ], // categoryNames
						this.itemUseDevice
					),
					new Generatable(1) // todo
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
		var wandUseNotImplemented = function(universe, world, place, actingEntity, targetEntity)
		{
			return "Wand effect not implemented!";
		}

		var wandUseProjectileSpawn = function (universe, world, place, actingEntity, targetEntity)
		{
			var loc = targetEntity.locatable.loc;
			var venue = loc.place(world);

			var entityForProjectile = new Entity
			(
				"Projectile0",
				world.defn.entityDefns["Rock"].name,
				loc.pos.clone()
			);

			venue.entitiesToSpawn.push(entityForProjectile);

			targetEntity.controlUpdate(world);
		};

		var wandUseTeleport = function(universe, world, place, actingEntity, targetEntity)
		{
			var loc = targetEntity.locatable.loc;

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
				if (cellTerrain.costToTraverse > 100) // hack
				{
					teleportPos = null;
				}
			}
			loc.pos.overwriteWith(teleportPos);

			targetEntity.controlUpdate(world);
			targetEntity.player.controlUpdate(world, targetEntity);
		};

		function Wand(name, use)
		{
			this.name = name;
			this.use = use;
		}

		var wandDatas =
		[
			new Wand("Cancelling", 		wandUseNotImplemented), // 0
			new Wand("Cold", 			wandUseProjectileSpawn),
			new Wand("Create Monster", 	wandUseNotImplemented),
			new Wand("Death",			wandUseProjectileSpawn),
			new Wand("Digging",			wandUseTeleport),
			new Wand("Enlightenment",	wandUseNotImplemented), // 5
			new Wand("Fire",			wandUseProjectileSpawn),
			new Wand("Light", 			wandUseNotImplemented),
			new Wand("Lightning", 		wandUseProjectileSpawn),
			new Wand("Locking",			wandUseNotImplemented),
			new Wand("Make Invisible",	wandUseNotImplemented), // 10
			new Wand("Magic Missile",	wandUseProjectileSpawn),
			new Wand("Nothing",			wandUseNotImplemented),
			new Wand("Opening",			wandUseNotImplemented),
			new Wand("Polymorph",		wandUseNotImplemented),
			new Wand("Probing",			wandUseNotImplemented), // 15
			new Wand("Secret Door Detection", wandUseNotImplemented),
			new Wand("Sleep",			wandUseNotImplemented),
			new Wand("Slow Monster",	wandUseNotImplemented),
			new Wand("Speed Monster", 	wandUseNotImplemented),
			new Wand("Striking",		wandUseProjectileSpawn), // 20
			new Wand("Teleport",		wandUseTeleport),
			new Wand("Turn Undead",		wandUseNotImplemented),
			new Wand("Wishing",			wandUseNotImplemented), // 23
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

		var device = new Device
		(
			name,
			null, null, // init, update
			this.itemEffectorApply
		);

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
					mappableDefns.Open,
					device,
					new Drawable(visuals[appearance]),
					new ItemDefn
					(
						wandName,
						appearance,
						appearance, // description
						1, // mass
						1, // stackSizeMax
						[ "Wand" ], // categoryNames
						this.itemUseDevice
					),
					new Generatable(1) // todo
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
					mappableDefns.Open,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						name,
						appearance,
						1, // mass
						1, // stackSizeMax
						[ "Weapon" ], // categoryNames
						ItemDefn.UseEquip// use
					),
					new Generatable(1) // todo
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
					mappableDefns.Open,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						appearance,
						appearance,
						1, // mass
						1, // stackSizeMax
						[ "Armor" , category.Name ], // categoryNames
						ItemDefn.UseEquip // use
					),
					new Generatable(1) // todo
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
					mappableDefns.Open,
					new Drawable(visuals[name]),
					new ItemDefn
					(
						appearance,
						appearance,
						1, // mass
						1, // stackSizeMax
						[ "Tool" ], // categoryNames
						ItemDefn.UseEquip // use
					),
					new Generatable(1) // todo
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
						mappableDefns.Open,

						new Drawable(visuals[appearance]),
						new ItemDefn
						(
							name,
							appearance,
							1, // mass
							1, // stackSizeMax
							[ "Stone" ], // categoryNames
							ItemDefn.UseDoNothing
						),
						new Generatable(1) // todo
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

	DemoData.prototype.itemUseDevice = function(universe, world, place, userEntity, itemEntity)
	{
		var itemAppearance = itemEntity.item.defn(world).appearance;
		var itemMessage = "You use the " + itemAppearance + ".";

		var device = itemEntity.Device;
		var deviceMessage = device.use(universe, world, place, userEntity, itemEntity);

		var player = userEntity.player;
		if (player != null)
		{
			player.messageLog.messageAdd(itemMessage);
			player.messageLog.messageAdd(deviceMessage);
		}

		var message = itemMessage + " " + deviceMessage;
		return message;
	};
}
