
function DemoData(randomizer)
{
	this.randomizer = randomizer;
	this.imageHelper = new ImageHelper();
}
{
	var collidableDefns = CollidableDefn.Instances();

	DemoData.prototype.buildActions = function()
	{
		// Action.perform() declarations

		var actionEmplacement_Use_Perform = function(universe, world, actor, action)
		{
			var loc = actor.loc;
			var venue = loc.venue(world);
			var posInCells = actor.loc.posInCells;
			var usablesPresentInCell = venue.entitiesWithPropertyNamePresentAtCellPos
			(
				"Portal",
				posInCells
			);

			if (usablesPresentInCell.length == 0)
			{
				return;
			}

			var usableToUse = usablesPresentInCell[0];
			var costToUse = 1;

			if (actor.moverData.movesThisTurn < costToUse)
			{
				return;
			}

			actor.moverData.movesThisTurn -= costToUse;

			var portal = usableToUse;

			var portalData = portal.portalData;
			var destinationVenueName = portalData.destinationVenueName;
			var destinationEntityName = portalData.destinationEntityName;

			var destinationVenue = world.venues[destinationVenueName];
			if (destinationVenue != null)
			{
				destinationVenue.initialize(universe, world);
				destinationVenue.update(universe, world);

				var entities = destinationVenue.entities;
				var destinationEntity = entities[destinationEntityName];
				if (destinationEntity != null)
				{
					actor.loc.venue(world).entitiesToRemove.push(actor);
					destinationVenue.entitiesToSpawn.push(actor);
					actor.loc.posInCells.overwriteWith
					(
						destinationEntity.loc.posInCells
					);

					world.venueNext = destinationVenue;

					actor.moverData.controlUpdate(world, actor);
				}
			}
		}

		var actionItem_DropSelected_Perform = function(universe, world, actor, action)
		{
			var loc = actor.loc;
			var venue = loc.venue(world);
			var posInCells = loc.posInCells;
			var itemsPresentInCell = venue.entitiesWithPropertyPresentAtCellPos
			(
				"Item",
				posInCells
			);

			var containerData = actor.containerData;
			var itemToDrop = containerData.itemSelected;
			var costToDrop = 1;

			if (itemToDrop != null && actor.moverData.movesThisTurn >= costToDrop)
			{
				actor.moverData.movesThisTurn -= costToDrop;
				actor.containerData.dropItem(world, actor, itemToDrop);
			}
		}

		var actionItem_PickUp_Perform = function(universe, world, actor, action)
		{
			var loc = actor.loc;
			var venue = loc.venue(world);
			var posInCells = actor.loc.posInCells;

			var entitiesPresentAtCellPos = venue.map.cellAtPos(posInCells).entitiesPresent;

			for (var i = 0; i < entitiesPresentAtCellPos.length; i++)
			{
				var entityPresent = entitiesPresentAtCellPos[i];
				var entityPresentDefn = entityPresent.defn(world);
				var itemToPickUp = entityPresentDefn.Item;
				if (itemToPickUp != null)
				{
					var costToPickUp = 1;

					if (actor.moverData.movesThisTurn >= costToPickUp)
					{
						actor.moverData.movesThisTurn -= costToPickUp;

						actor.containerData.pickUpItem(world, actor, entityPresent);
						actor.playerData.messageLog.messageAdd("You pick up the " + itemToPickUp.appearance + ".");
					}
				}
			}
		}

		var actionItem_SelectAtOffset_Perform = function(universe, world, actor, action)
		{
			var containerData = actor.containerData;
			var itemsHeld = containerData.items;

			if (itemsHeld.length == 0)
			{
				return;
			}

			var itemSelected = containerData.itemSelected;

			var indexOfItemSelected;

			if (itemSelected == null)
			{
				indexOfItemSelected = 0;
			}
			else
			{
				var indexOfItemSelected = itemsHeld.indexOf
				(
					itemSelected
				);

				var indexOffset = this.argumentForPerform;

				indexOfItemSelected += indexOffset;

				indexOfItemSelected = indexOfItemSelected.wrapToRangeMinMax
				(
					0, itemsHeld.length
				);
			}

			containerData.itemSelected = itemsHeld[indexOfItemSelected];

			actor.moverData.controlUpdate(world, actor);
		}

		var actionItem_TargetSelected_Perform = function(universe, world, actor, action)
		{
			var containerData = actor.containerData;
			containerData.itemTargeted = containerData.itemSelected;
			actor.moverData.controlUpdate(world, actor);
		}

		var actionItem_UseSelected_Perform = function(universe, world, actor, action)
		{
			var itemToUse = actor.containerData.itemSelected;

			if (itemToUse != null)
			{
				var movesToUse = 1; // todo

				if (actor.moverData.movesThisTurn >= movesToUse)
				{
					actor.moverData.movesThisTurn -= movesToUse;

					itemToUse.defn.itemDefn.use(world, actor, itemToUse, actor);
				}
			}
		}

		var actionMove_Perform = function(universe, world, actor, action)
		{
			var directionToMove = action.argumentForPerform;

			if (directionToMove.magnitude() == 0)
			{
				return;
			}

			var actorLoc = actor.loc;
			var venue = actorLoc.venue(world);

			var posInCellsDestination = actorLoc.posInCells.clone().add
			(
				directionToMove
			);

			var cellDestination = venue.map.cellAtPos(posInCellsDestination);

			var entitiesInCellDestination = cellDestination.entitiesPresent;

			var isDestinationAccessible = true;

			for (var b = 0; b < entitiesInCellDestination.length; b++)
			{
				var entityInCell = entitiesInCellDestination[b];

				if (entityInCell.collidableData.defn.blocksMovement == true)
				{
					isDestinationAccessible = false;
				}

				if (entityInCell.defn(world).properties["Mover"] != null)
				{
					isDestinationAccessible = false;

					var costToAttack = 1; // todo
					actor.moverData.movesThisTurn -= costToAttack;

					// todo - Calculate damage.
					var damageInflicted = DiceRoll.roll(world.randomizer, "1d6");

					var entityDefns = world.defn.entityDefns;
					var defnsOfEntitiesToSpawn = [];

					world.font.spawnMessageFloater
					(
						world, "Dagger", "-" + damageInflicted, actorLoc
					);

					if (damageInflicted > 0)
					{
						entityInCell.killableData.integrityAdd
						(
							0 - damageInflicted
						);

						if (entityInCell.killableData.integrity <= 0)
						{
							defnsOfEntitiesToSpawn.push
							(
								entityInCell.defn(world).Mover.entityDefnCorpse
							);
						}
						else
						{
							defnsOfEntitiesToSpawn.push
							(
								entityDefns["Blood"]
							);
						}
					}

					for (var i = 0; i < defnsOfEntitiesToSpawn.length; i++)
					{
						var defnOfEntityToSpawn = defnsOfEntitiesToSpawn[i];

						var entityToSpawn = new Entity
						(
							defnOfEntityToSpawn.name + "_Spawned",
							defnOfEntityToSpawn.name,
							posInCellsDestination
						);

						venue.entitiesToSpawn.push
						(
							entityToSpawn
						);
					}
				}
			}

			if (isDestinationAccessible == true)
			{
				var costToTraverse = cellDestination.terrain.costToTraverse;
				if (costToTraverse <= actor.moverData.movesThisTurn)
				{
					actor.moverData.movesThisTurn -= costToTraverse;

					var cellDeparted = actor.collidableData.mapCellOccupied;
					var entitiesInCellDeparted = cellDeparted.entitiesPresent;
					entitiesInCellDeparted.splice
					(
						entitiesInCellDeparted.indexOf(actor),
						1
					);

					entitiesInCellDestination.push(actor);
					actor.collidableData.mapCellOccupied = cellDestination;

					actor.loc.posInCells.overwriteWith
					(
						posInCellsDestination
					);
				}
			}

		}

		var actionWait_Perform = function(universe, world, actor, action)
		{
			actor.moverData.movesThisTurn = 0;
		}

		// directions

		var directions = new Direction_Instances()._ByHeading;

		// actions

		var actionEmplacement_Use = new Action
		(
			"Use Emplacement", 1, actionEmplacement_Use_Perform
		);

		var actionItem_DropSelected = new Action
		(
			"Drop Selected Item", 1, actionItem_DropSelected_Perform
		);

		var actionItem_PickUp = new Action
		(
			"Pick Up Item", 1, actionItem_PickUp_Perform
		);

		var actionItem_SelectNext = new Action
		(
			"Select Next Item", null, actionItem_SelectAtOffset_Perform, 1
		);

		var actionItem_SelectPrev = new Action
		(
			"Select Previous Item", null, actionItem_SelectAtOffset_Perform, -1
		);

		var actionItem_TargetSelected= new Action
		(
			"Target Selected Item", 1, actionItem_TargetSelected_Perform
		);

		var actionItem_UseSelected 	= new Action
		(
			"Use Selected Item", 1, actionItem_UseSelected_Perform
		);

		var actionMoveE = new Action
		(
			"Move East", null, actionMove_Perform, directions[0]
		);

		var actionMoveSE = new Action
		(
			"Move Southeast", null, actionMove_Perform, directions[1]
		);

		var actionMoveS = new Action
		(
			"Move South", null, actionMove_Perform, directions[2]
		);

		var actionMoveSW = new Action
		(
			"Move Southwest", null, actionMove_Perform, directions[3]
		);

		var actionMoveW = new Action
		(
			"Move West", null, actionMove_Perform, directions[4]
		);

		var actionMoveNW = new Action
		(
			"Move Northwest", null, actionMove_Perform, directions[5]
		);

		var actionMoveN = new Action
		(
			"Move North", null, actionMove_Perform, directions[6]
		);

		var actionMoveNE = new Action
		(
			"Move Northeast", null, actionMove_Perform, directions[7]
		);

		var actionWait = new Action("Wait", null, actionWait_Perform);

		var returnValues =
		[
			actionEmplacement_Use,
			actionItem_DropSelected,
			actionItem_PickUp,
			actionItem_SelectNext,
			actionItem_SelectPrev,
			actionItem_TargetSelected,
			actionItem_UseSelected,
			actionMoveE,
			actionMoveSE,
			actionMoveS,
			actionMoveSW,
			actionMoveW,
			actionMoveNW,
			actionMoveN,
			actionMoveNE,
			actionWait,
		];

		// hack
		returnValues._MovesByHeading =
		[
			actionMoveE,
			actionMoveSE,
			actionMoveS,
			actionMoveSW,
			actionMoveW,
			actionMoveNW,
			actionMoveN,
			actionMoveNE,
		];

		returnValues.addLookupsByName();

		return returnValues;
	}

	DemoData.prototype.buildActivityDefns = function()
	{
		var activityDefnDoNothing = new ActivityDefn
		(
			"Do Nothing",

			// initialize
			function(universe, world, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, actor, activity)
			{
				// do nothing
			}
		);

		var activityDefnGenerateMovers = new ActivityDefn
		(
			"Generate Movers",

			// initialize
			function(universe, world, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, actor, activity)
			{
				var actorLoc = actor.loc;
				var venue = actorLoc.venue(world);

				var agentsInVenue = venue.entitiesByPropertyName["Mover"];

				var numberOfAgentsDesired = 0; // hack - No monsters yet.

				if (agentsInVenue.length < numberOfAgentsDesired)
				{
					var chanceOfSpawnPerTurn = 1; // hack - actually per tick

					if (Math.random() < chanceOfSpawnPerTurn)
					{
						var difficulty = 1; // hack

						var entityDefnGroupName = "AgentsOfDifficulty" + difficulty;
						var entityDefnsForAgentsOfDifficulty =
							world.defn.entityDefnGroups[entityDefnGroupName].entityDefns;
						var numberOfEntityDefns = entityDefnsForAgentsOfDifficulty.length;
						var entityDefnIndex = Math.floor(Math.random() * numberOfEntityDefns);
						var entityDefnForAgentToSpawn = entityDefnsForAgentsOfDifficulty[entityDefnIndex];

						var randomizer = world.randomizer;
						var posToSpawnAt = new Coords().randomize
						(
							randomizer
						).multiply
						(
							venue.map.sizeInCells
						).floor();

						var entityForAgent = new Entity
						(
							entityDefnForAgentToSpawn.name + "0",
							entityDefnForAgentToSpawn.name,
							posToSpawnAt
						);

						venue.entitiesToSpawn.push(entityForAgent);
					}
				}
			}
		);

		var activityDefnMoveRandomly = new ActivityDefn
		(
			"Move Randomly",

			// initialize
			function(universe, world, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, actor, activity)
			{
				// hack
				var actionsMoves = world.defn.actions._MovesByHeading;

				var numberOfDirectionsAvailable = actionsMoves.length;
				var directionIndexRandom = Math.floor
				(
					numberOfDirectionsAvailable
					* this.randomizer.getNextRandom() // Math.random()
				);

				var actionMoveInRandomDirection = actionsMoves[directionIndexRandom];

				actor.actorData.actions.push(actionMoveInRandomDirection);
			}
		);

		var activityDefnMoveTowardPlayer = new ActivityDefn
		(
			"Move Toward Player",

			// initialize
			function(universe, world, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, actor, activity)
			{
				if (actor.moverData.movesThisTurn <= 0)
				{
					return;
				}

				var actorLoc = actor.loc;
				var venue = actorLoc.venue(world);
				var players = venue.entitiesByPropertyName["Player"];

				if (players != null && players.length > 0)
				{
					var player = players[0];

					var path = new Path
					(
						venue.map,
						actorLoc.posInCells,
						player.loc.posInCells
					);

					path.calculate();

					if (path.nodes.length < 2)
					{
						return;
					}

					var pathNode1 = path.nodes[1];

					var directionsToPathNode1 = pathNode1.cellPos.clone().subtract
					(
						actor.loc.posInCells
					).directions();

					var heading = Heading.fromCoords(directionsToPathNode1);

					// hack
					var actionsMoves = world.defn.actions._MovesByHeading;
					var actionMoveInDirection = actionsMoves[heading];

					actor.actorData.actions.push
					(
						actionMoveInDirection
					);
				}
			}
		);

		var activityDefnUserInputAccept = new ActivityDefn
		(
			"Accept User Input",

			// initialize
			function(universe, world, actor, activity)
			{
				activity.target =
				[
					new InputToActionMapping("f", "Use Selected Item"),
					new InputToActionMapping("g", "Pick Up Item"),
					new InputToActionMapping("r", "Drop Selected Item"),
					new InputToActionMapping("t", "Target Selected Item"),
					new InputToActionMapping("u", "Use Emplacement"),

					new InputToActionMapping("_1", "Move Southwest"),
					new InputToActionMapping("_2", "Move South"),
					new InputToActionMapping("_3", "Move Southeast"),
					new InputToActionMapping("_4", "Move West"),
					new InputToActionMapping("_6", "Move East"),
					new InputToActionMapping("_7", "Move Northwest"),
					new InputToActionMapping("_8", "Move North"),
					new InputToActionMapping("_9", "Move Northeast"),

					new InputToActionMapping("]", "Select Next Item"),
					new InputToActionMapping("[", "Select Previous Item"),
					new InputToActionMapping(".", "Wait"),
				].addLookups( function(element) { return element["inputName"]; } );
			},

			function perform(universe, world, actor, activity)
			{
				var inputHelper = universe.inputHelper;
				var inputToActionMappings = activity.target;
				var inputsActive = inputHelper.inputsPressed;
				var actionsFromActor = actor.actorData.actions;

				for (var i = 0; i < inputsActive.length; i++)
				{
					var input = inputsActive[i];
					var inputMapping = inputToActionMappings[input.name];
					if (inputMapping != null)
					{
						var actionName = inputMapping.actionName;
						var action = world.defn.actions[actionName];

						var ticksToHold =
						(
							action.ticksToHold == null ? action.ticksSoFar : action.ticksToHold
						);

						if (action.ticksSoFar <= ticksToHold)
						{
							actionsFromActor.push(action);
						}

						actionsFromActor.push(action);
					}
				}
			}
		);

		var returnValues =
		[
			activityDefnDoNothing,
			activityDefnGenerateMovers,
			activityDefnMoveRandomly,
			activityDefnMoveTowardPlayer,
			activityDefnUserInputAccept,
		];

		returnValues.addLookupsByName();

		return returnValues;
	}

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
	}

	DemoData.prototype.buildEntityDefnGroups = function(images, activityDefns, itemCategories)
	{
		// entityDefns

		var emplacements = this.buildEntityDefnGroups_Emplacements(images);

		var items = this.buildEntityDefnGroups_Items(images, itemCategories);

		var movers = this.buildEntityDefnGroups_Movers(images, activityDefns, itemCategories);

		var returnValues =
		[
			[ emplacements ],
			items,
			movers,
		].concatenateAll();

		return returnValues;
	}

	DemoData.prototype.buildEntityDefnGroups_Emplacements = function(visuals)
	{
		var sizeInPixels = visuals["Floor"].size;

		var entityDefns =
		[
			new EntityDefn
			(
				"Blood",
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals["Blood"], sizeInPixels),
					new EmplacementDefn(),
					new EphemeralDefn(30),
				]
			),

			new EntityDefn
			(
				"Door",
				[
					collidableDefns.Concealing,
					new DrawableDefn(visuals["Door"], sizeInPixels) ,
					new EmplacementDefn(),
				]
			),

			new EntityDefn
			(
				"Gravestone",
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals["Gravestone"], sizeInPixels),
					new EmplacementDefn(),
				]
			),

			new EntityDefn
			(
				"StairsDown",
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals["StairsDown"], sizeInPixels),
					new EmplacementDefn(),
					new PortalDefn(),
				]
			),

			new EntityDefn
			(
				"StairsExit",
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals["StairsUp"], sizeInPixels),
					new EmplacementDefn(),
				]
			),

			new EntityDefn
			(
				"StairsUp",
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals["StairsUp"], sizeInPixels),
					new EmplacementDefn(),
					new PortalDefn(),
				]
			),

		];

		var returnValue = new EntityDefnGroup
		(
			"Emplacements",
			1, // relativeFrequency
			entityDefns
		);

		return returnValue;
	}

	DemoData.prototype.buildEntityDefnGroups_Items = function(images, itemCategories)
	{
		// convenience variables

		var animation = AnimationDefnSetFake.buildFromImage;

		var categoriesCommon =
		[
			"Collidable",
			"Drawable",
			"Item",
		];

		var sizeInPixels = images["Floor"].sizeInPixels;

		var itemPropertiesNoStack = new ItemDefn
		(
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
			this.buildEntityDefns_Items_Containers,
			this.buildEntityDefns_Items_Food,
			this.buildEntityDefns_Items_Potions,
			this.buildEntityDefns_Items_Rings,
			this.buildEntityDefns_Items_Scrolls,
			this.buildEntityDefns_Items_Spellbooks,
			this.buildEntityDefns_Items_Wands,
			this.buildEntityDefns_Items_Weapons,
			this.buildEntityDefns_Items_Armor,
			this.buildEntityDefns_Items_Tools,
			this.buildEntityDefns_Items_Stones,
		];

		var itemDefnGroups = [];

		for (var i = 0; i < methodsToRun.length; i++)
		{
			var methodToRun = methodsToRun[i];
			var itemDefnGroup = methodToRun.call
			(
				this,
				images,
				animation,
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
	}

	DemoData.prototype.buildEntityDefns_Items_Containers = function
	(
		visuals,
		animation,
		categories,
		categoriesCommon,
		sizeInPixels,
		itemPropertiesNoStack,
		itemPropertiesStandard,
		effectDoNothing,
		entityDefnSets
	)
	{
		entityDefnSets.push
		([
			new EntityDefn
			(
				"Chest",
				[
					itemPropertiesNoStack,
					new DrawableDefn(visuals["Chest"], sizeInPixels),
				]
			),
		]);

		var returnValue = new EntityDefnGroup("Containers", 1, entityDefnSets[0]);

		return returnValue;
	}

	DemoData.prototype.buildEntityDefns_Items_Food = function
	(
		visuals,
		animation,
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
					targetEntity.moverData.vitals.addSatietyToMover(world, 1000, targetEntity);
					targetEntity.moverData.controlUpdate(world, targetEntity);
				}
			)
		);

		var entityDefnSetFoods = [];

		for (var i = 0; i < namesOfFoods.length; i++)
		{
			var name = namesOfFoods[i];

			var entityDefn = new EntityDefn
			(
				name,
				[
					collidableDefns.Clear,
					new DeviceDefn
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							effectNourish
						]
					),
					new DrawableDefn(visuals[name], sizeInPixels),
					new ItemDefn
					(
						name,
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
		animation,
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
				var actingEntityDefnName = actingEntity.defn(world).name;
				world.font.spawnMessageFloater
				(
					world,
					actingEntityDefnName,
					"NOT IMPLEMENTED - " + actingEntityDefnName,
					targetEntity.loc
				);

				targetEntity.controlUpdate(world);
			}
		);

		var namesAndEffectDefnsOfPotions =
		[
			[ "Acid" 		, new ED( null, function(w, ae, te) { te.moverData.integrityAdd(-30); te.moverData.controlUpdate(w, te); } ) ],
			[ "Blindness" 		, effectMessageNotImplemented ],
			[ "Booze" 		, effectMessageNotImplemented ],
			[ "Enlightenment" 	, effectMessageNotImplemented ],
			[ "Confusion" 		, effectMessageNotImplemented ],
			[ "Fruit Juice" 	, new ED( null, function(w, ae, te) { te.moverData.vitals.addSatietyToMover(w, 100, targetEntity); te.moverData.controlUpdate(targetEntity); } ) ],
			[ "Gain aeility" 	, new ED( null, function(w, ae, te) { te.moverData.traits.strength += 1; te.moverData.controlUpdate(w, te); } ) ],
			[ "Gain Energy" 	, new ED( null, function(w, ae, te) { te.moverData.vitals.energy += 100; te.moverData.controlUpdate(te); } ) ],
			[ "Gain Level" 		, new ED( null, function(w, ae, te) { te.moverData.demographics.level += 1; te.moverData.controlUpdate(te); } ) ],
			[ "Healing" 		, new ED( null, function(w, ae, te) { te.killaeleData.integrityAdd(10); te.moverData.controlUpdate(w, te); } ) ],
			[ "Healing Extra" 	, new ED( null, function(w, ae, te) { te.killaeleData.integrityAdd(30); te.moverData.controlUpdate(w, te); } ) ],
			[ "Healing Full" 	, new ED( null, function(w, ae, te) { te.killaeleData.integrityAdd(1000); te.moverData.controlUpdate(w, te); } ) ],
			[ "Invisibility" 	, effectMessageNotImplemented ],
			[ "Levitation" 		, effectMessageNotImplemented ],
			[ "Monster Detection" 	, effectMessageNotImplemented ],
			[ "Paralysis" 		, effectMessageNotImplemented ],
			[ "Object Detection" 	, effectMessageNotImplemented ],
			[ "Oil" 		, effectMessageNotImplemented ],
			[ "Polymorph" 		, effectMessageNotImplemented ],
			[ "Restore aeility" 	, effectMessageNotImplemented ],
			[ "See Invisible" 	, effectMessageNotImplemented ],
			[ "Sickness" 		, new ED( null, function(w, ae, te) { te.killaeleData.integrityAdd(-20); te.moverData.controlUpdate(w, te); } ) ],
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
			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Potion";
			appearances.splice(appearanceIndex, 1);

			var potionData = namesAndEffectDefnsOfPotions[i];
			var name = potionData[0];
			var effectDefn = potionData[1];
			effectDefn.name = name;

			var entityDefn = new EntityDefn
			(
				"Potion of " + name,
				[
					collidableDefns.Clear,
					new DeviceDefn
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							new Effect(effectDefn)
						]
					),
					new DrawableDefn(visuals[appearance], sizeInPixels),
					new ItemDefn
					(
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
	}

	DemoData.prototype.buildEntityDefns_Items_Rings = function
	(
		visuals,
		animation,
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
			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom() * appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Ring";
			appearances.splice(appearanceIndex, 1);

			entityDefnSetRings.push
			(
				new EntityDefn
				(
					"Ring of " + namesOfRings[i],
					[
						collidableDefns.Clear,
						new DrawableDefn(visuals[appearance], sizeInPixels),
						new ItemDefn
						(
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
	}

	DemoData.prototype.buildEntityDefns_Items_Scrolls = function
	(
		visuals,
		animation,
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
			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = "Scroll Titled '" + appearances[appearanceIndex] + "'";
			appearances.splice(appearanceIndex, 1);

			var entityDefn = new EntityDefn
			(
				"Scroll of " + namesOfScrolls[i],
				[
					collidableDefns.Clear,
					new DeviceDefn
					(
						1, // chargesMax
						true, // consumedWhenAllChargesUsed
						// effectsToApply
						[
							effectDoNothing
						]
					),
					new DrawableDefn(visuals[appearance], sizeInPixels),
					new ItemDefn
					(
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
		animation,
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

			var appearanceIndex = Math.floor
			(
				this.randomizer.getNextRandom()
				* appearances.length
			);
			var appearance = appearances[appearanceIndex] + " Spellbook";
			appearances.splice(appearanceIndex, 1);

			var effectLearnSpell = new Effect
			(
				new EffectDefn
				(
					"Learn Spell: " + nameOfSpellbook,
					function apply(world, targetEntity)
					{
						var spellToAdd = new SpellDefn("[Spell]");
						var spellsKnown = targetEntity.moverData.spells.spells;

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

			var entityDefn = new EntityDefn
			(
				"Spellbook of " + nameOfSpellbook,
				[
					collidableDefns.Clear,
					new DeviceDefn(10, true, [ effectLearnSpell ]),
					new DrawableDefn(visuals[appearance], sizeInPixels),
					new ItemDefn
					(
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
		animation,
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
					var actingEntityDefnName = actingEntity.defn(world).name;
					world.font.spawnMessageFloater
					(
						world,
						actingEntityDefnName,
						"NOT IMPLEMENTED - " + actingEntityDefnName,
						targetEntity.loc
					);

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
					var loc = targetEntity.loc;
					var venue = loc.venue(world);

					var entityForProjectile = new Entity
					(
						"Projectile0",
						world.defn.entityDefns["Rock"].name,
						loc.posInCells.clone()
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
					var loc = targetEntity.loc;

					var teleportPos = null;
					while (teleportPos == null)
					{
						var map = loc.venue(world).map;
						teleportPos = new Coords().randomize(randomizer).multiply
						(
							map.sizeInCells
						).floor();

						var cellToTeleportTo = map.cellAtPos(teleportPos);
						if (cellToTeleportTo.terrain.costToTraverse > 1)
						{
							teleportPos = null;
						}
					}
					loc.posInCells.overwriteWith(teleportPos);

					targetEntity.controlUpdate(world);
					targetEntity.moverData.controlUpdate(world, targetEntity);
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
			appearances.splice(appearanceIndex, 1);

			entityDefnSetWands.push
			(
				new EntityDefn
				(
					"Wand of " + name,
					[
						collidableDefns.Clear,
						new DeviceDefn
						(
							10, // chargesMax
							false, // consumedWhenAllChargesUsed
							// effectsToApply
							[
								effect
							]
						),
						new DrawableDefn(visuals[appearance], sizeInPixels),
						new ItemDefn
						(
							appearance,
							1, // mass
							1, // stackSizeMax
							1, // relativeFrequency
							[ "Wand" ], // categoryNames
							ItemDefn.InitializeDevice,
							ItemDefn.UseDevice
						),
					]
				)
			);
		}

		entityDefnSets.push(entityDefnSetWands);

		return new EntityDefnGroup("Wands", 1, entityDefnSets[0]);

	}

	DemoData.prototype.buildEntityDefns_Items_MagicTools = function
	(
		visuals,
		animation,
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
		animation,
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

			var entityDefn = new EntityDefn
			(
				name,
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals[name], sizeInPixels),
					new ItemDefn
					(
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
		animation,
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

			var entityDefn = new EntityDefn
			(
				name,
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals[name], sizeInPixels),
					new ItemDefn
					(
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
		animation,
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

			var entityDefn = new EntityDefn
			(
				name,
				[
					collidableDefns.Clear,
					new DrawableDefn(visuals[name], sizeInPixels),
					new ItemDefn
					(
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
		animation,
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
			var appearance = appearancesOfStones[i];

			entityDefnSetStones.push
			(
				new EntityDefn
				(
					namesOfStones[i],
					[
						collidableDefns.Clear,

						new DrawableDefn(visuals[appearance], sizeInPixels),
						new ItemDefn
						(
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
			new EntityDefn
			(
				"Coins",
				[
					itemPropertiesStandard,
					new DrawableDefn(visuals["Coins"], sizeInPixels),
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
	}

	DemoData.prototype.buildEntityDefnGroups_Movers = function(visuals, activityDefns, itemCategories)
	{
		var returnValues = [];

		// convenience variables

		var animation = AnimationDefnSet.buildFromImage;

		var sizeInPixels = visuals["Floor"].size;

		var skillDefns = this.buildSkillDefns();
		var spellDefns = this.buildSpellDefns();
		var traitDefns = this.buildTraitDefns();

		// player

		var equipmentSocketDefnSetBiped = this.buildEntityDefns_Items_EquipmentSocketDefnSet
		(
			itemCategories
		);

		var entityDefnCorpse = new EntityDefn
		(
			"Corpse",
			[
				collidableDefns.Clear,
				new DrawableDefn(visuals["Corpse"], sizeInPixels),
				new ItemDefn
				(
					"Corpse",
					1, // mass
					1, // stackSizeMax,
					1, // relativeFrequency
					[], // categoryNames
					ItemDefn.InitializeDevice,
					ItemDefn.UseDevice
				),
			]
		);

		returnValues.push(entityDefnCorpse);
		returnValues[entityDefnCorpse.name] = entityDefnCorpse;

		var moverDefnPlayer = new MoverDefn
		(
			999, // difficulty
			1, // movesPerTurn
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
			entityDefnCorpse,
			[] // attributeGroups
		);

		var visualForPlayerBase = visuals["Rogue"];

		var animationDefnSetPlayer = new AnimationDefnSet
		(
			"AnimationDefnSetPlayer",
			[
				new AnimationDefn
				(
					"AnimationDefnPlayer",
					"AnimationDefnPlayer", // animationDefnNameNext
					[
						new AnimationFrame
						(
							visualForPlayerBase,
							100 // ticksToHold
						),
						new AnimationFrame
						(
							visuals["Wizard"],
							100 // ticksToHold
						),

					]
				)
			]
		);

		var animationDefnSetReticle = new AnimationDefnSet
		(
			"AnimationDefnSetReticle",
			[
				new AnimationDefn
				(
					"AnimationDefnReticle",
					"AnimationDefnReticle", // animationDefnNameNext
					[
						new AnimationFrame
						(
							visuals["Reticle0"],
							10 // ticksToHold
						),
						new AnimationFrame
						(
							visuals["Reticle1"],
							10 // ticksToHold
						),
					]
				)
			]
		);

		var visualForPlayer = new VisualSet
		(
			"Player",
			[
				animationDefnSetPlayer.toRun(),
				animationDefnSetReticle.toRun(),
			]
		);

		var drawableDefnPlayer = new DrawableDefn
		(

			visualForPlayer,
			sizeInPixels,
			1 // zIndex
		);

		var entityDefnPlayer = new EntityDefn
		(
			"Player",
			// properties
			[
				new ActorDefn(activityDefns["Accept User Input"].name),
				collidableDefns.Blocking,
				new ContainerDefn(),
				drawableDefnPlayer,
				new EquippableDefn(equipmentSocketDefnSetBiped),
				new KillableDefn(160, null),
				moverDefnPlayer,
				new PlayerDefn(),
			]
		);

		returnValues.push(entityDefnPlayer);
		returnValues["Player"] = entityDefnPlayer;

		// agents

		var containerDefn = new ContainerDefn();

		var agentDatas = this.buildAgentDatas();

		for (var i = 0; i < agentDatas.length; i++)
		{
			var agentData = agentDatas[i];
			var agentName = agentData[0];
			var difficulty = agentData[1];

			var entityDefnForAgent = new EntityDefn
			(
				agentName,
				// properties
				[
					new ActorDefn(activityDefns["Move Toward Player"].name),
					collidableDefns.Blocking,
					containerDefn,
					new EquippableDefn(equipmentSocketDefnSetBiped),
					new EnemyDefn(),
					new KillableDefn(5, null),
					new MoverDefn
					(
						difficulty,
						1, // movesPerTurn
						new MoverData_Demographics(null, null),
						new MoverData_Skills([]),
						new MoverData_Spells([]),
						new MoverData_Traits(10, 10, 10, 10, 10),
						new MoverDefn_Vitals(20, 1000),
						entityDefnCorpse,
						// attributeGroups
						[
							// todo
						]
					),

					new DrawableDefn
					(
						visuals[agentName],
						sizeInPixels,
						1 // zIndex
					),
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
			var difficulty = (entityDefnForAgent.Mover == null ? null : entityDefnForAgent.Mover.difficulty);
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
	}

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
	}

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
	}

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
	}

	DemoData.prototype.buildSpellDefns = function()
	{
		var returnValues =
		[
			// todo
		];

		returnValues.addLookupsByName();

		return returnValues;
	}

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
	}

	DemoData.prototype.buildMapTerrainsMines = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	DemoData.prototype.buildMapTerrainsDungeon = function(visualsForTiles)
	{
		this.Floor 		= new MapTerrain("Floor", 		".", 1, 	false, "#00aa00", visualsForTiles["Floor"]);
		this.Stone 		= new MapTerrain("Stone", 		"x", 1000000, 	true, "#000000", visualsForTiles["Stone"]);
		this.WallCornerNorth 	= new MapTerrain("WallCornerNorth", 	"+", 1000000, 	true, "#0000aa", visualsForTiles["WallDungeonCornerNorth"]);
		this.WallCornerSouth	= new MapTerrain("WallCornerSouth", 	"*", 1000000, 	true, "#0000aa", visualsForTiles["WallDungeonCornerSouth"]);
		this.WallEastWest 	= new MapTerrain("WallEastWest", 	"-", 1000000, 	true, "#0000aa", visualsForTiles["WallDungeonEastWest"]);
		this.WallNorthSouth 	= new MapTerrain("WallNorthSouth", 	"|", 1000000, 	true, "#0000aa", visualsForTiles["WallDungeonNorthSouth"]);

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
	}

	DemoData.prototype.buildMapTerrainsHades = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	DemoData.prototype.buildMapTerrainsLabyrinth = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	DemoData.prototype.buildMapTerrainsPuzzle = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	DemoData.prototype.buildMapTerrainsThrowback = function(visualsForTiles)
	{
		return this.buildMapTerrainsDungeon(visualsForTiles);
	}

	DemoData.prototype.buildWorldDefn = function(visualsForTiles)
	{
		var visualsOpaque = this.buildVisualLookup(visualsForTiles);

		var actions = this.buildActions();

		var activityDefns = this.buildActivityDefns();

		var itemCategories = this.buildItemCategories();

		var entityDefnGroups = this.buildEntityDefnGroups(visualsOpaque, activityDefns, itemCategories);

		var venueDefns = this.buildVenueDefns(visualsOpaque, actions);

		var Branch = WorldDefnVenueStructureBranch;

		var branchesMain =
		[
			/*
			new Branch
			(
				"Tutorial",
				"Tutorial",
				false,
				new Range(0, 0),
				new Range(1, 1),
				[]
			),
			*/
			new Branch
			(
				"DungeonShallow",
				"Dungeon",
				true,
				new Range(0, 0),
				new Range(5, 6),
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

		var randomizer = this.randomizer;

		var returnValue = new WorldDefn
		(
			"WorldDefn0",
			actions,
			activityDefns,
			itemCategories,
			entityDefnGroups,
			venueDefns,
			venueStructure,
			function buildVenues()
			{
				var returnValues = this.venueStructure.branchRoot.buildVenuesAndAddToList
				(
					this, // worldDefn
					[], // venuesSoFar
					0, // venueDepth
					randomizer
				);

				return returnValues;
			}
		);

		return returnValue;
	}

	DemoData.prototype.buildVenueDefns = function(visuals, actions)
	{
		var mapTerrainsDungeon = this.buildMapTerrainsDungeon(visuals);

		// hack - Build this on the fly?
		var propertyNamesKnown =
		[
			"Actor",
			"Collidable",
			"Container",
			"Device",
			"Drawable",
			"Dynamic",
			"Emplacement",
			"Enemy",
			"Ephemeral",
			"Equippable",
			"Item",
			"Killable",
			"Mover",
			"Player",
			"Portal",
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
				"GameOver",
				propertyNamesKnown,
				mapTerrainsDungeon,
				this.venueGenerateGameOver
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
				this.venueGenerateLimbo
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
	}

	DemoData.prototype.venueGenerateDungeon = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		var entityDefnGroups = worldDefn.entityDefnGroups;
		var entityDefns = worldDefn.entityDefns;

		entityDefns.addLookupsByName();

		var mapSizeInCells = new Coords(64, 64);
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

		var numberOfRooms = 12;

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

			while (doesRoomOverlapAnother == true)
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

				doesRoomOverlapAnother = Bounds.doBoundsInSetsOverlap
				(
					[ Bounds.fromMinAndSize(roomPos, roomSizePlusOnes) ],
					roomBoundsSetSoFar
				);
			}

			var roomBounds = Bounds.fromMinAndSize(roomPos, roomSize);

			roomBoundsSetSoFar.push(roomBounds);
		}

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

		var roomsConnected = [ rooms[0] ];
		var roomsToConnect = [];

		for (var r = 1; r < numberOfRooms; r++)
		{
			roomsToConnect.push(rooms[r]);
		}

		var doorwayPositions = [];

		while (roomsToConnect.length > 0)
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
						Coords.Instances().TwoTwoZero
					)
				).floor()
			).add
			(
				Coords.Instances().OneOneZero
			);

			var toPos = roomToConnectBounds.min().clone().add
			(
				new Coords().randomize(randomizer).multiply
				(
					roomToConnectBounds.size.clone().subtract
					(
						Coords.Instances().TwoTwoZero
					)
				).floor()
			).add
			(
				Coords.Instances().OneOneZero
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

			while (displacementToRoomToConnect.equals(Coords.Instances().Zeroes) == false)
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

		var entities = [];

		if (venueIndex == 0)
		{
			var stairsExit = new Entity
			(
				"StairsExit",
				entityDefns["StairsExit"].name,
				rooms[0].bounds.center.clone().floor(),
				[
					new PortalData
					(
						"VenueGameOver", "Start"
					),
				] // propertyValues
			);

			entities.push(stairsExit);
		}
		else
		{
			var stairsUp = new Entity
			(
				"StairsUp",
				entityDefns["StairsUp"].name,
				rooms[0].bounds.center.clone().floor(),
				// propertyValues
				[
					new PortalData
					(
						"Venue" + (venueIndex - 1),
						"StairsDown"
					),
				]
			);

			entities.push(stairsUp);
		}

		entities.push
		(
			Entity.fromDefn
			(
				"Mover Generator",
				MoverGenerator.EntityDefn(),
				null // pos
			)
		);

		if (venueIndex < numberOfVenues - 1)
		{
			var stairsDown = new Entity
			(
				"StairsDown",
				entityDefns["StairsDown"].name,
				rooms[1].bounds.center.clone().floor(),
				// propertyValues
				[
					new PortalData
					(
						"Venue" + (venueIndex + 1),
						"StairsUp"
					),
				]
			);

			entities.push(stairsDown);
		}

		for (var i = 0; i < doorwayPositions.length; i++)
		{
			var entityForDoor = new Entity
			(
				"Door" + i,
				entityDefns["Door"].name,
				doorwayPositions[i]
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

		for (var r = 0; r < numberOfRooms; r++)
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

					var entityDefnForItem = entityDefns
					[
						entityDefnIndex
					];

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

					var entityForItem = new Entity
					(
						entityDefnForItem.name,
						entityDefnForItem.name,
						pos
					);

					entities.push(entityForItem);
				}
			}
		}

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

	DemoData.prototype.venueGenerateFortress = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		return this.venueGenerateDungeon(worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer);
	};

	DemoData.prototype.venueGenerateGameOver = function
	(
		worldDefn, venueDefn, venueIndex, numberOfVenues, venueDepth, randomizer
	)
	{
		var map = new Map
		(
			"Venue" + venueIndex + "Map",
			venueDefn.terrains,
			new Coords(16, 16, 1), // hack - cellSizeInPixels
			mapCellsAsStrings
		);

		var entityDefnName = "Start"; // todo

		var entityStart = new Entity
		(
			entityDefnName,
			entityDefnName,
			new Coords(0, 0), // pos
		);

		var entities =
		[
			entityStart
		];

		var returnValue = new VenueLevel
		(
			"VenueGameOver",
			-1, //venueDepth,
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

			new Entity
			(
				"StairsDown",
				entityDefns["StairsDown"].name,
				sizeInCells.clone().subtract(Coords.Instances().Ones),
				// propertyValues
				[
					new PortalData
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

		//var locationForMessages = new Location(returnValue.name, new Coords(0, 0));

		//Font.spawnMessageFixed(world, "Tutorial", locationForMessages);

		return returnValue;
	}

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

			[ "Blood", new Coords(3, 4) ],
			[ "Door", new Coords(4, 21) ],
			[ "Gravestone", new Coords(16, 21) ],
			[ "StairsUp", new Coords(11, 21) ],
			[ "StairsDown", new Coords(12, 21) ],

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
			[ "Engagement Ring", new Coords(36, 13) ],
			[ "Bronze Ring", new Coords(37, 13) ],
			[ "Sapphire Ring", new Coords(38, 13) ],
			[ "Ruby Ring", new Coords(39, 13) ],
			[ "Diamond Ring", new Coords(0, 14) ],
			[ "Pearl Ring", new Coords(1, 14) ],
			[ "Iron Ring", new Coords(2, 14) ],
			[ "Brass Ring", new Coords(3, 14) ],
			[ "Copper Ring", new Coords(4, 14) ],
			[ "Twisted Ring", new Coords(5, 14) ],
			[ "Steel Ring", new Coords(6, 14) ],
			[ "Agate Ring", new Coords(7, 14) ],
			[ "Silver Ring", new Coords(8, 14) ],
			[ "Gold Ring", new Coords(9, 14) ],
			[ "Topaz Ring", new Coords(10, 14) ],
			[ "Ivory Ring", new Coords(11, 14) ],
			[ "Wire Ring", new Coords(12, 14) ],
			[ "Jade Ring", new Coords(13, 14) ],
			[ "Coral Ring", new Coords(14, 14) ],

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

			[ "Arrow", new Coords(10, 10) ],
			[ "Silver Arrow", new Coords(10, 10) ],
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
		];

		for (var i = 0; i < reticlePixelSetsAsStringArrays.length; i++)
		{
			var imageName = "Reticle" + i;

			var pixelsAsStrings = reticlePixelSetsAsStringArrays[i];

			var imageForReticle = this.imageHelper.buildImageFromStrings
			(
				imageName,
				pixelsAsStrings
			);
			var visualForReticle = new VisualImageImmediate(imageForReticle);

			returnValue[imageName] = visualForReticle;
		}

		return returnValue;
	}

	DemoData.prototype.buildFont = function()
	{
		var characterImages = this.imageHelper.buildImagesFromStringArrays
		(
			"Font",
			[
			[
				".rrr..",
				"r...r.",
				"rrrrr.",
				"r...r.",
				"r...r.",
			],

			[
				"rrrr..",
				"r...r.",
				"rrrr..",
				"r...r.",
				"rrrr..",
			],
			[
				".rrrr.",
				"r.....",
				"r.....",
				"r.....",
				".rrrr.",
			],
			[
				"rrrr..",
				"r...r.",
				"r...r.",
				"r...r.",
				"rrrr..",
			],
			[
				"rrrrr.",
				"r.....",
				"rrrr..",
				"r.....",
				"rrrrr.",
			],
			[
				"rrrrr.",
				"r.....",
				"rrrr..",
				"r.....",
				"r.....",
			],
			[
				".rrrr.",
				"r.....",
				"r..rr.",
				"r...r.",
				".rrrr.",
			],
			[
				"r...r.",
				"r...r.",
				"rrrrr.",
				"r...r.",
				"r...r.",
			],
			[
				"rrrrr.",
				"..r...",
				"..r...",
				"..r...",
				"rrrrr.",
			],
			[
				".rrrrr.",
				"....r..",
				"....r..",
				".r..r..",
				"..rr...",
			],
			[
				"r...r.",
				"r..r..",
				"rrr...",
				"r..r..",
				"r...r.",
			],
			[
				"r.....",
				"r.....",
				"r.....",
				"r.....",
				"rrrrr.",
			],
			[
				"r...r.",
				"rr.rr.",
				"r.r.r.",
				"r...r.",
				"r...r.",
			],
			[
				"r...r.",
				"rr..r.",
				"r.r.r.",
				"r..rr.",
				"r...r.",
			],
			[
				".rrr..",
				"r...r.",
				"r...r.",
				"r...r.",
				".rrr..",
			],
			[
				"rrrr..",
				"r...r.",
				"rrrr..",
				"r.....",
				"r......",
			],
			[
				".rrr..",
				"r...r.",
				"r...r.",
				".rrr..",
				"..r...",
			],
			[
				"rrrr..",
				"r...r.",
				"rrrr..",
				"r..r..",
				"r...r.",
			],
			[
				".rrrr.",
				"r.....",
				".rrr..",
				"....r.",
				"rrrr..",
			],
			[
				"rrrrr.",
				"..r...",
				"..r...",
				"..r...",
				"..r...",
			],
			[
				"r...r.",
				"r...r.",
				"r...r.",
				"r...r.",
				".rrr..",
			],
			[
				"r...r.",
				"r...r.",
				".r.r..",
				".r.r..",
				"..r...",
			],
			[
				"r...r.",
				"r...r.",
				"r.r.r.",
				"rr.rr.",
				"r...r.",
			],
			[
				"r...r.",
				".r.r..",
				"..r...",
				".r.r..",
				"r...r.",
			],
			[
				"r...r.",
				".r.r..",
				"..r...",
				"..r...",
				"..r...",
			],
			[
				"rrrrr.",
				"...r..",
				"..r...",
				".r....",
				"rrrrr.",
			],

			// space

			[
				"......",
				"......",
				"......",
				"......",
				"......",
			],

			// numerals

			[
				".rrr..",
				"r...r.",
				"r.r.r.",
				"r...r.",
				".rrr..",
			],
			[
				"..r...",
				".rr...",
				"..r...",
				"..r...",
				"rrrrr.",
			],
			[
				"rrrr..",
				"....r.",
				".rrrr.",
				"r.....",
				"rrrrr.",
			],
			[
				"rrrr..",
				"....r.",
				"..rr..",
				"....r.",
				"rrrr..",
			],
			[
				"r...r.",
				"r...r.",
				"rrrrr.",
				"....r.",
				"....r.",
			],
			[
				"rrrrr.",
				"r.....",
				"rrrr..",
				"....r.",
				"rrrr..",
			],
			[
				".rrr..",
				"r.....",
				"rrrr..",
				"r...r.",
				".rrr..",
			],
			[
				"rrrrr.",
				"....r.",
				"....r.",
				"....r.",
				"....r.",
			],
			[
				".rrr..",
				"r...r.",
				".rrr..",
				"r...r.",
				".rrr..",
			],
			[
				".rrr..",
				"r...r.",
				".rrrr.",
				"....r.",
				"....r.",
			],

			// symbols

			[
				"......",
				"......",
				"......",
				"......",
				"r.....",
			],

			[
				"......",
				"......",
				"rrrrr.",
				"......",
				"......",
			],

			[
				"..g...",
				"..g...",
				"ggggg.",
				"..g...",
				"..g...",
			],

			]
		);

		var returnValue = new FontRoguelike
		(
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ "
			+ "0123456789"
			+ ".-+",
			new Coords(6, 5), // characterSize
			characterImages
		);

		return returnValue;
	}

}
