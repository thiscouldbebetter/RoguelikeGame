
function DemoData_Actions()
{
	// partial class DemoData
}

{
	DemoData.prototype.actionAttack_Perform = function(universe, world, place, actor, action)
	{
		if (actor.MoverData.movesThisTurn <= 0)
		{
			return;
		}

		var actorLoc = actor.Locatable.loc;
		var directionFacing = actorLoc.orientation.forward;
		var posInCellsDestination = actorLoc.pos.clone().add
		(
			directionFacing
		);

		var map = place.map;
		var cellDestination = map.cellAtPos(posInCellsDestination);

		if (cellDestination == null)
		{
			return;
		}

		var entitiesInCellDestination = cellDestination.entitiesPresent;
		var entityInCell = entitiesInCellDestination[0];

		if (entityInCell != null)
		{
			var moverDefn = entityInCell.MoverDefn;
			if (moverDefn != null)
			{
				var costToAttack = 1; // todo
				actor.MoverData.movesThisTurn -= costToAttack;

				// todo - Calculate damage.
				// hack - Only the player can inflict damage for now.
				var damageInflicted = ( actor.Player == null ? 0 : DiceRoll.roll(world.randomizer, "1d6") );

				var entityDefns = world.defn.entityDefns;
				var defnsOfEntitiesToSpawn = [];

				if (damageInflicted == 0)
				{
					if (actor.Player != null)
					{
						var message = "You miss the " + moverDefn.name + ".";
						actor.Player.messageLog.messageAdd(message);
					}
					else if (entityInCell.Player != null)
					{
						var message = "The " + actor.MoverDefn.name + " misses you.";
						entityInCell.Player.messageLog.messageAdd(message);
					}

				}
				else
				{
					var killable = entityInCell.Killable;
					killable.damageApply
					(
						universe, world, place, actor, entityInCell, damageInflicted
					);

					if (actor.Player != null)
					{
						var message = "You hit the " + moverDefn.name + ".";
						actor.Player.messageLog.messageAdd(message);
					}
					else if (entityInCell.Player != null)
					{
						var message = "The " + moverDefn.name + " hits you.";
						actor.Player.messageLog.messageAdd(message);
					}

					if (killable.integrity <= 0)
					{
						var entityDefnCorpse = moverDefn.entityDefnCorpse;
						var entityCorpse = EntityHelper.new
						(
							entityDefnCorpse.name + universe.idHelper.idNext(),
							entityDefnCorpse,
							[
								entityInCell.Locatable,
								new Item(entityDefnCorpse.ItemDefn.name, 1)
							]
						);

						defnsOfEntitiesToSpawn.push(entityCorpse);

						if (actor.Player != null)
						{
							var message = "You kill the " + moverDefn.name + "!";
							actor.Player.messageLog.messageAdd(message);
						}

					}
				}

				for (var i = 0; i < defnsOfEntitiesToSpawn.length; i++)
				{
					var defnOfEntityToSpawn = defnsOfEntitiesToSpawn[i];

					var entityToSpawn = EntityHelper.new
					(
						defnOfEntityToSpawn.name + "_Spawned",
						defnOfEntityToSpawn,
						[ new Locatable(new Location(posInCellsDestination)) ]
					);

					place.entitiesToSpawn.push(entityToSpawn);
				}

			} // end if (moverDefn != null)

		} // end if (entityInCell != null)
	};

	DemoData.prototype.actionEmplacement_Use_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var posInCells = loc.pos;
		var emplacementsInCell = place.entitiesWithPropertyNamePresentAtCellPos
		(
			Emplacement.name, posInCells // hack
		);

		if (emplacementsInCell.length == 0)
		{
			return;
		}

		var emplacementToUse = emplacementsInCell[0];
		var costToUse = 1;

		var moverData = actor.MoverData;
		if (moverData.movesThisTurn < costToUse)
		{
			return;
		}

		moverData.movesThisTurn -= costToUse;

		emplacementToUse.Emplacement.use
		(
			universe, world, place, actor, emplacementToUse
		);
	};

	DemoData.prototype.actionItem_DropSelected_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var posInCells = loc.pos;
		var itemsPresentInCell = place.entitiesWithPropertyPresentAtCellPos
		(
			"Item", posInCells
		);

		var itemHolder = actor.ItemHolder;
		var itemToDrop = itemHolder.itemSelected;
		var costToDrop = 1;

		var moverData = actor.MoverData;
		if (itemToDrop != null && moverData.movesThisTurn >= costToDrop)
		{
			moverData.movesThisTurn -= costToDrop;

			function removeItem(itemHolder, world, actor, itemToDrop)
			{
				var itemsHeld = itemHolder.itemEntities;

				var actionSelectNext = world.defn.actions["Item_SelectNext"];
				actionSelectNext.perform(null, world, "[place]", actor);

				itemsHeld.remove(itemToDrop);

				if (itemsHeld.length == 0)
				{
					itemHolder.itemSelected = null;
				}
			}

			function dropItem(itemHolder, world, actor, itemToDrop)
			{
				var itemsHeld = itemHolder.itemEntities;

				removeItem(itemHolder, world, actor, itemToDrop);

				var itemLoc = itemToDrop.Locatable.loc;
				itemLoc.overwriteWith(actor.Locatable.loc);
				place.entitiesToSpawn.push(itemToDrop);
			}

			dropItem(actor.ItemHolder, world, actor, itemToDrop);
		}
	};

	DemoData.prototype.actionItem_PickUp_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var posInCells = loc.pos;

		var cell = place.map.cellAtPos(posInCells);
		var entitiesPresentAtCellPos = cell.entitiesPresent;

		for (var i = 0; i < entitiesPresentAtCellPos.length; i++)
		{
			var entityPresent = entitiesPresentAtCellPos[i];
			var itemToPickUp = entityPresent.Item;
			if (itemToPickUp != null)
			{
				var costToPickUp = 1;

				var moverData = actor.MoverData;
				if (moverData.movesThisTurn >= costToPickUp)
				{
					moverData.movesThisTurn -= costToPickUp;

					function pickUpItem(itemHolder, world, actor, itemToPickUp)
					{
						itemHolder.itemEntities.push(itemToPickUp);
						place.entitiesToRemove.push(itemToPickUp);

						if (itemHolder.itemSelected == null)
						{
							itemHolder.itemSelected = itemToPickUp;
						}
					}

					pickUpItem(actor.ItemHolder, world, actor, entityPresent);
					var itemToPickUpDefn = itemToPickUp.defn(world);
					var message = "You pick up the " + itemToPickUpDefn.appearance + ".";
					actor.Player.messageLog.messageAdd(message);
				}
			}
		}
	}

	DemoData.prototype.actionItem_SelectAtOffset_Perform = function(universe, world, place, actor, action, indexOffset)
	{
		var itemHolder = actor.ItemHolder;
		var itemsHeld = itemHolder.items;

		if (itemsHeld.length == 0)
		{
			return;
		}

		var itemSelected = itemHolder.itemSelected;

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

			indexOfItemSelected += indexOffset;

			indexOfItemSelected = indexOfItemSelected.wrapToRangeMinMax
			(
				0, itemsHeld.length
			);
		}

		itemHolder.itemSelected = itemsHeld[indexOfItemSelected];

		actor.MoverData.controlUpdate(world, actor);
	};

	DemoData.prototype.actionItem_TargetSelected_Perform = function(universe, world, place, actor, action)
	{
		var itemHolder = actor.ItemHolder;
		itemHolder.itemTargeted = itemHolder.itemSelected;
		actor.MoverData.controlUpdate(world, actor);
	};

	DemoData.prototype.actionItem_UseSelected_Perform = function(universe, world, place, actor, action)
	{
		var itemToUse = actor.ItemHolder.itemSelected;

		if (itemToUse != null)
		{
			var movesToUse = 1; // todo

			var moverData = actor.MoverData;
			if (moverData.movesThisTurn >= movesToUse)
			{
				moverData.movesThisTurn -= movesToUse;

				itemToUse.defn.itemDefn.use(world, actor, itemToUse, actor);
			}
		}
	};

	DemoData.prototype.actionMove_Perform = function(universe, world, place, actor, action, directionToMove)
	{
		if (actor.MoverData.movesThisTurn <= 0)
		{
			return;
		}

		if (directionToMove.magnitude() == 0)
		{
			return;
		}

		var actorLoc = actor.Locatable.loc;
		actorLoc.orientation.forwardSet(directionToMove);

		var posInCellsDestination = actorLoc.pos.clone().add
		(
			directionToMove
		);

		var map = place.map;
		var cellDestination = map.cellAtPos(posInCellsDestination);

		if (cellDestination == null)
		{
			return;
		}

		var entitiesInCellDestination = cellDestination.entitiesPresent;

		var isDestinationAccessible = true;

		for (var b = 0; b < entitiesInCellDestination.length; b++)
		{
			var entityInCell = entitiesInCellDestination[b];

			if (entityInCell.Collidable.defn.blocksMovement)
			{
				isDestinationAccessible = false;

				var moverDefn = entityInCell.MoverDefn;
				if (moverDefn != null)
				{
					if (actor.Player != null)
					{
						var message = "A " + moverDefn.name + " blocks your path.";
						actor.Player.messageLog.messageAdd(message);
					}
					else
					{
						this.actionAttack_Perform(universe, world, place, actor, action);
					}
				}
			}
		}

		if (isDestinationAccessible)
		{
			var cellTerrain = cellDestination.terrain(map);
			var costToTraverse = cellTerrain.costToTraverse;
			var moverData = actor.MoverData;
			if (costToTraverse <= moverData.movesThisTurn)
			{
				moverData.movesThisTurn -= costToTraverse;

				var cellDeparted = actor.Collidable.mapCellOccupied;
				var entitiesInCellDeparted = cellDeparted.entitiesPresent;
				entitiesInCellDeparted.remove(actor);

				if (actor.Player != null)
				{
					for (var i = 0; i < entitiesInCellDestination.length; i++)
					{
						var entity = entitiesInCellDestination[i];
						if (entity.Item != null)
						{
							var item = entity.Item;
							var itemDefn = item.defn(world);
							var message = "There is a " + itemDefn.appearance + " here.";
							actor.Player.messageLog.messageAdd(message);
						}
						else if (entity.Emplacement != null)
						{
							var emplacement = entity.Emplacement;
							var message = "There is a " + emplacement.appearance + " here.";
							actor.Player.messageLog.messageAdd(message);
						}
					}
				}

				entitiesInCellDestination.push(actor);
				actor.Collidable.mapCellOccupied = cellDestination;

				actorLoc.pos.overwriteWith
				(
					posInCellsDestination
				);
			}
		}
	};

	DemoData.prototype.actionWait_Perform = function(universe, world, place, actor, action)
	{
		actor.MoverData.movesThisTurn = 0;
	};

	DemoData.prototype.actionsBuild = function()
	{
		// directions

		var directions = new Direction_Instances()._ByHeading;

		var actions = this;

		var actionAttack = new Action
		(
			"Attack",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Attack(universe, world, place, actor, action);
			}
		);

		var actionEmplacement_Use = new Action
		(
			"Use Emplacement",
			actions.actionEmplacement_Use_Perform
		);

		var actionItem_DropSelected = new Action
		(
			"Drop Selected Item",
			actions.actionItem_DropSelected_Perform
		);

		var actionItem_PickUp = new Action
		(
			"Pick Up Item",
			actions.actionItem_PickUp_Perform
		);

		var actionItem_SelectNext = new Action
		(
			"Select Next Item",
			function perform(universe, world, actor, action)
			{
				actions.actionItem_SelectAtOffset_Perform(universe, world, actor, action, 1);
			}
		);

		var actionItem_SelectPrev = new Action
		(
			"Select Previous Item",
			function perform(universe, world, place, actor, action)
			{
				actions.actionItem_SelectAtOffset_Perform(universe, world, actor, action, -1);
			}
		);

		var actionItem_TargetSelected= new Action
		(
			"Target Selected Item", actions.actionItem_TargetSelected_Perform
		);

		var actionItem_UseSelected 	= new Action
		(
			"Use Selected Item", actions.actionItem_UseSelected_Perform
		);

		var actionMoveE = new Action
		(
			"Move East",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[0]);
			}
		);

		var actionMoveSE = new Action
		(
			"Move Southeast",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[1]);
			}
		);

		var actionMoveS = new Action
		(
			"Move South",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[2]);
			}
		);

		var actionMoveSW = new Action
		(
			"Move Southwest",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[3]);
			}
		);

		var actionMoveW = new Action
		(
			"Move West",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[4]);
			}
		);

		var actionMoveNW = new Action
		(
			"Move Northwest",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[5]);
			}
		);

		var actionMoveN = new Action
		(
			"Move North",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[6]);
			}
		);

		var actionMoveNE = new Action
		(
			"Move Northeast",
			function perform(universe, world, place, actor, action)
			{
				actions.actionMove_Perform(universe, world, place, actor, action, directions[7]);
			}
		);

		var actionWait = new Action("Wait", actions.actionWait_Perform);

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
			Action.Instances().ShowMenu,
			Action.Instances().ShowItems,
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
	};

	DemoData.prototype.buildActivityDefns = function()
	{
		var activityDefnDoNothing = new ActivityDefn
		(
			"Do Nothing",

			function initialize(universe, world, place, actor, activity)
			{
				// do nothing
			},

			function perform(universe, world, place, actor, activity)
			{
				// do nothing
			}
		);

		var activityDefnGenerateMovers = new ActivityDefn
		(
			"Generate Movers",

			function initialize(universe, world, place, actor, activity)
			{
				// do nothing
			},

			function perform(universe, world, place, actor, activity)
			{
				var moverGenerator = actor.MoverGenerator;
				moverGenerator.activityPerform(universe, world, place, actor, activity);
			}
		);

		var activityDefnMoveRandomly = new ActivityDefn
		(
			"Move Randomly",

			// initialize
			function(universe, world, place, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, place, actor, activity)
			{
				// hack
				var actionsMoves = world.defn.actions._MovesByHeading;

				var numberOfDirectionsAvailable = actionsMoves.length;
				var directionIndexRandom = Math.floor
				(
					numberOfDirectionsAvailable
					* this.randomizer.getNextRandom()
				);

				var actionMoveInRandomDirection = actionsMoves[directionIndexRandom];

				actor.ActorData.actions.push(actionMoveInRandomDirection);
			}
		);

		var activityDefnMoveTowardPlayer = new ActivityDefn
		(
			"Move Toward Player",

			// initialize
			function(universe, world, place, actor, activity)
			{
				// do nothing
			},

			// perform
			function(universe, world, place, actor, activity)
			{
				if (actor.MoverData.movesThisTurn <= 0)
				{
					return;
				}

				var actorLoc = actor.Locatable.loc;
				var players = place.entitiesByPropertyName[Player.name];

				if (players != null && players.length > 0)
				{
					var player = players[0];

					var path = new Path
					(
						place.map,
						actorLoc.pos,
						player.Locatable.loc.pos
					);

					path.calculate();

					if (path.nodes.length < 2)
					{
						return;
					}

					var pathNode1 = path.nodes[1];

					var directionsToPathNode1 = pathNode1.cellPos.clone().subtract
					(
						actor.Locatable.loc.pos
					).directions();

					var heading = Heading.fromCoords(directionsToPathNode1);

					// hack
					var actionsMoves = world.defn.actions._MovesByHeading;
					var actionMoveInDirection = actionsMoves[heading];

					actor.ActorData.actions.push
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
			function(universe, world, place, actor, activity)
			{
				activity.target =
				[
					new ActionToInputsMapping("Use Selected Item", [ "f" ]),
					new ActionToInputsMapping("Pick Up Item", [ "g" ]),
					new ActionToInputsMapping("Drop Selected Item", [ "r" ]),
					new ActionToInputsMapping("Target Selected Item", [ "t" ], ),
					new ActionToInputsMapping("Use Emplacement", [ "u" ] ),

					new ActionToInputsMapping("Move Southwest", [ "_1" ]),
					new ActionToInputsMapping("Move South", [ "_2" ]),
					new ActionToInputsMapping("Move Southeast", [ "_3" ]),
					new ActionToInputsMapping("Move West", [ "_4" ]),
					new ActionToInputsMapping("Move East", [ "_6" ]),
					new ActionToInputsMapping("Move Northwest", [ "_7" ]),
					new ActionToInputsMapping("Move North", [ "_8" ]),
					new ActionToInputsMapping("Move Northeast", [ "_9" ]),

					new ActionToInputsMapping("ShowItems", [ "Tab" ]),
					new ActionToInputsMapping("Select Next Item", [ "]" ]),
					new ActionToInputsMapping("Select Previous Item", [ "[" ]),

					new ActionToInputsMapping("Wait", [ "." ]),

					new ActionToInputsMapping("ShowMenu", [ "Escape" ]),

				].addLookups( function(element) { return element.inputNames[0]; } );
			},

			function perform(universe, world, place, actor, activity)
			{
				var inputHelper = universe.inputHelper;
				var inputToActionMappings = activity.target;
				var inputsActive = inputHelper.inputsPressed;
				var actionsFromActor = actor.ActorData.actions;

				for (var i = 0; i < inputsActive.length; i++)
				{
					var input = inputsActive[i];
					var inputMapping = inputToActionMappings[input.name];
					if (inputMapping != null)
					{
						var actionName = inputMapping.actionName;
						var action = world.defn.actions[actionName];

						var ticksToHold = 1; // hack

						if (action.ticksSoFar <= ticksToHold)
						{
							actionsFromActor.push(action);
						}

						actionsFromActor.push(action);
					}
				}
			}
		);

		var activityDefnUserInputDemo = new ActivityDefn
		(
			"Demo User Input",

			function initialize(universe, world, place, actor, activity)
			{
				// do nothing
			},

			function perform(universe, world, place, actor, activity)
			{
				if (actor.MoverData.movesThisTurn <= 0)
				{
					return;
				}

				var actorLoc = actor.Locatable.loc;
				var actorPos = actorLoc.pos;

				var target = actor.ActorData.target;
				if (target == null)
				{
					var itemsHeld = actor.ItemHolder.itemEntities;
					var hasItemGoal = itemsHeld.some(x => x.name == "Amulet of Yendor");

					var itemsOnLevel = place.entitiesByPropertyName[Item.name];
					var itemsNearby = itemsOnLevel.filter
					(
						x => x.Locatable.loc.pos.clone().subtract(actorPos).magnitude() < 4
					);

					var target = null;
					if (hasItemGoal)
					{
						var emplacements = place.entitiesByPropertyName[Emplacement.name];
						var stairsUp = emplacements.filter
						(
							x => x.name == "StairsUp"
						);

						if (stairsUp.length > 0)
						{
							target = stairsUp[0];
						}
						else
						{
							var altar = emplacements.filter(x => x.name == "Altar")[0];
							target = altar;
						}
					}
					else if (itemsNearby.length > 0)
					{
						target = itemsNearby[0];
						actor.ActorData.target = target;
					}
					else
					{
						var emplacements = place.entitiesByPropertyName[Emplacement.name];
						var stairsDown = emplacements.filter
						(
							x => x.name == "StairsDownToNextLevel"
						);

						if (stairsDown.length == 0)
						{
							target = itemsOnLevel.filter(x => x.name == "Amulet of Yendor")[0];
						}
						else
						{
							var stairDown = stairsDown[0];
							target = stairDown;
						}
					}
				}

				var targetPos = target.Locatable.loc.pos;
				var pathToTarget = new Path
				(
					place.map,
					actorPos,
					targetPos
				);
				pathToTarget.calculate();
				var pathNodes = pathToTarget.nodes;

				var actionNext = null;
				var actionsAll = world.defn.actions;
				var pathToTargetLength = pathNodes.length;
				if (pathToTargetLength <= 1)
				{
					actor.ActorData.target = null;
					if (target.Item != null)
					{
						actionNext = actionsAll["Pick Up Item"];
					}
					else
					{
						actionNext = actionsAll["Use Emplacement"];
					}
				}
				else
				{
					var pathNode1 = pathNodes[1];

					var directionsToPathNode1 = pathNode1.cellPos.clone().subtract
					(
						actor.Locatable.loc.pos
					).directions();

					var heading = Heading.fromCoords(directionsToPathNode1);

					// hack
					var actionsMoves = actionsAll._MovesByHeading;
					var actionMoveInDirection = actionsMoves[heading];
					actionNext = actionMoveInDirection;
				}

				if (actionNext != null)
				{
					actor.ActorData.actions.push(actionNext);
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
			activityDefnUserInputDemo
		];

		returnValues.addLookupsByName();

		return returnValues;
	};
}
