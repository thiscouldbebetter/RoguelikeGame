
function DemoData_Actions()
{
	// partial class DemoData
}

{
	DemoData.prototype.actionAttack_Melee_Perform = function(universe, world, place, actor, action)
	{
		var costToAttack = actor.mover.movesPerTurn; // todo

		if (actor.mover.movesThisTurn < costToAttack)
		{
			return;
		}

		var actorLoc = actor.locatable.loc;
		var directionFacing = actorLoc.orientation.forward.clone().directions();
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

		var actorPlayer = actor.player;

		var entitiesInCellDestination = cellDestination.entitiesPresent;
		for (var i = 0; i < entitiesInCellDestination.length; i++)
		{
			var entityInCell = entitiesInCellDestination[i];

			var killable = entityInCell.killable;
			var mover = entityInCell.mover;

			if (killable != null)
			{
				actor.mover.movesThisTurn -= costToAttack;
				actor.turnable.hasActedThisTurn = true;

				// todo - Calculate damage.
				// hack - Only the player can inflict damage for now.
				var damagePossibleAsDieRoll = "1d6";
				var damageAmount = DiceRoll.roll(world.randomizer, damagePossibleAsDieRoll);
				var damageInflicted = ( actorPlayer == null ? 0 : damageAmount);

				if (damageInflicted == 0)
				{
					if (actorPlayer != null)
					{
						var message = "You miss the " + entityInCell.namable.name + ".";
						actorPlayer.messageLog.messageAdd(message);
					}
					else if (entityInCell.player != null)
					{
						var message = "The " + actor.namable.name + " misses you.";
						entityInCell.player.messageLog.messageAdd(message);
					}
				}
				else
				{
					killable.damageApply
					(
						universe, world, place, actor, entityInCell, damageInflicted
					);

					if (actorPlayer != null)
					{
						var message = "You hit the " + entityInCell.namable.name + ".";
						actorPlayer.messageLog.messageAdd(message);
						// todo - Weapon skill improvement.
					}
					else if (entityInCell.player != null)
					{
						var message = "The " + entityInCell.namable.name + " hits you.";
						entityInCell.player.messageLog.messageAdd(message);
					}

					if (killable.isAlive() == false)
					{
						killable.die(universe, world, place, entityInCell);

						if (actorPlayer != null)
						{
							var message = "You kill the " + entityInCell.namable.name + "!";
							actorPlayer.messageLog.messageAdd(message);

							var actorDemographics = actor.demographics;
							var wasRankIncreased = actorDemographics.experienceAdd
							(
								entityInCell.demographics.experienceToKill
							);

							if (wasRankIncreased)
							{
								var message = "You have reached rank " + actorDemographics.rank + "!";
								actorPlayer.messageLog.messageAdd(message);
							}
						}
					}
				}

			} // end if (mover != null)

		} // end for entitiesInCellDestination
	};

	DemoData.prototype.actionAttack_Projectile_Perform = function
	(
		universe, world, place, actor, action
	)
	{
		var costToAttack = actor.mover.movesPerTurn; // todo

		if (actor.mover.movesThisTurn < costToAttack)
		{
			return;
		}

		var actorLoc = actor.locatable.loc;
		var directionFacing = actorLoc.orientation.forward.clone().directions();
		var posInCellsInFront = actorLoc.pos.clone().add
		(
			directionFacing
		);

		var map = place.map;
		var cellInFront = map.cellAtPos(posInCellsInFront);

		if (cellInFront == null)
		{
			return;
		}

		if (cellInFront.terrain(map).costToTraverse >= MapTerrain.AlmostInfinity)
		{
			return;
		}

		var actorPlayer = actor.player;

		actor.mover.movesThisTurn -= costToAttack;
		actor.turnable.hasActedThisTurn = true;

		var projectileLoc = actor.locatable.loc.clone();
		var projectilePos = projectileLoc.pos;
		//projectilePos.add(directionFacing);
		projectilePos.z++;
		var visual =
			world.defn.entityDefns["Dagger"].drawable.visual; // todo
		var projectileEntity = new Entity
		(
			"Projectile" + IDHelper.Instance().idNext(),
			[
				new ActorDefn("Fly Forward"),
				new Awaitable(),
				MappableDefn.Instances().Open,
				new Drawable(visual),
				new Ephemeral(8),
				new Locatable(projectileLoc),
				new Mover(1) // hack
			]
		);

		place.entitiesToSpawn.push(projectileEntity);

		if (actor.player != null)
		{
			actor.player.messageLog.messageAdd("You throw a dagger.");
		}
	};

	DemoData.prototype.actionDoorOpenOrClose_Perform = function(universe, world, place, actor, action, shouldOpenNotClose)
	{
		var costToPerform = actor.mover.movesPerTurn; // todo

		var actorMover = actor.mover;
		if (actorMover.movesThisTurn >= costToPerform)
		{
			var actorLoc = actor.locatable.loc;
			var directionFacing = actorLoc.orientation.forward.clone().directions();
			var posInCellsDestination = actorLoc.pos.clone().add
			(
				directionFacing
			);

			var map = place.map;
			var cellDestination = map.cellAtPos(posInCellsDestination);

			if (cellDestination != null)
			{
				var entitiesInCellDestination = cellDestination.entitiesPresent;
				if (entitiesInCellDestination.length == 1)
				{
					var entityInCell = entitiesInCellDestination[0];

					var openable = entityInCell.openable;
					if (openable != null)
					{
						var isAlreadyInDesiredState = (shouldOpenNotClose == openable.isOpen);
						if (isAlreadyInDesiredState)
						{
							if (actor.player != null)
							{
								var openOrClosed = (shouldOpenNotClose ? "open" : "closed");
								var appearance = entityInCell.emplacement.appearance; // hack
								var message = "The " + appearance + " is already " + openOrClosed + ".";
								actor.player.messageLog.messageAdd(message);
							}
						}
						else
						{
							var openOrClose = (shouldOpenNotClose ? "open" : "close");
							if (actor.player != null)
							{
								var appearance = entityInCell.emplacement.appearance; // hack
								var message = "You " + openOrClose + " the " + appearance + ".";
								actor.player.messageLog.messageAdd(message);
							}
							openable.isOpen = (openable.isOpen == false);

							actorMover.movesThisTurn -= costToPerform;
							actor.turnable.hasActedThisTurn = true;
						}

					} // end if (openable != null)

				} // end for entitiesInCellDestination

			} // end if cellDestination != null

		} // end if enough moves
	};

	DemoData.prototype.actionEmplacement_Use_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.locatable.loc;
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
		var costToUse = actor.mover.movesPerTurn; // hack

		var mover = actor.mover;
		if (mover.movesThisTurn >= costToUse)
		{
			mover.movesThisTurn -= costToUse;
			actor.turnable.hasActedThisTurn = true;

			emplacementToUse.emplacement.use
			(
				universe, world, place, actor, emplacementToUse
			);
		}

	};

	DemoData.prototype.actionItem_DropSelected_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.locatable.loc;
		var posInCells = loc.pos;
		var itemsPresentInCell = place.entitiesWithPropertyPresentAtCellPos
		(
			"Item", posInCells
		);

		var itemHolder = actor.itemHolder;
		var itemToDrop = itemHolder.itemSelected;
		var costToDrop = actor.mover.movesPerTurn; // hack

		var mover = actor.mover;
		if (itemToDrop != null && mover.movesThisTurn >= costToDrop)
		{
			mover.movesThisTurn -= costToDrop;
			actor.turnable.hasActedThisTurn = true;

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

				var itemLoc = itemToDrop.locatable.loc;
				itemLoc.overwriteWith(actor.locatable.loc);
				place.entitiesToSpawn.push(itemToDrop);
			}

			dropItem(actor.itemHolder, world, actor, itemToDrop);
		}
	};

	DemoData.prototype.actionItem_PickUp_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.locatable.loc;
		var posInCells = loc.pos;

		var cell = place.map.cellAtPos(posInCells);
		var entitiesPresentAtCellPos = cell.entitiesPresent;

		for (var i = 0; i < entitiesPresentAtCellPos.length; i++)
		{
			var entityPresent = entitiesPresentAtCellPos[i];
			var itemToPickUp = entityPresent.item;
			if (itemToPickUp != null)
			{
				var costToPickUp = actor.mover.movesPerTurn; // hack

				var mover = actor.mover;
				if (mover.movesThisTurn >= costToPickUp)
				{
					mover.movesThisTurn -= costToPickUp;
					actor.turnable.hasActedThisTurn = true;

					function pickUpItem(itemHolder, world, actor, itemToPickUp)
					{
						itemHolder.itemEntities.push(itemToPickUp);
						place.entitiesToRemove.push(itemToPickUp);

						if (itemHolder.itemSelected == null)
						{
							itemHolder.itemSelected = itemToPickUp;
						}
					}

					pickUpItem(actor.itemHolder, world, actor, entityPresent);
					var itemToPickUpDefn = itemToPickUp.defn(world);
					var message = "You pick up the " + itemToPickUpDefn.appearance + ".";
					actor.player.messageLog.messageAdd(message);
				}
			}
		}
	}

	DemoData.prototype.actionItem_SelectAtOffset_Perform = function(universe, world, place, actor, action, indexOffset)
	{
		var itemHolder = actor.itemHolder;
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

		actor.player.controlUpdate(world, actor);
	};

	DemoData.prototype.actionItem_TargetSelected_Perform = function(universe, world, place, actor, action)
	{
		var itemHolder = actor.itemHolder;
		itemHolder.itemTargeted = itemHolder.itemSelected;
		actor.player.controlUpdate(world, actor);
	};

	DemoData.prototype.actionItem_UseSelected_Perform = function(universe, world, place, actor, action)
	{
		var itemToUse = actor.itemHolder.itemSelected;

		if (itemToUse != null)
		{
			var movesToUse = 1; // todo

			var mover = actor.mover;
			if (mover.movesThisTurn >= movesToUse)
			{
				mover.movesThisTurn -= movesToUse;
				actor.turnable.hasActedThisTurn = true;

				itemToUse.defn.itemDefn.use(world, actor, itemToUse, actor);
			}
		}
	};

	DemoData.prototype.actionMove_Perform = function(universe, world, place, actor, action, directionToMove)
	{
		if (actor.mover.movesThisTurn < actor.mover.movesPerTurn)
		{
			return;
		}

		if (directionToMove.magnitude() == 0)
		{
			return;
		}

		var actorLoc = actor.locatable.loc;
		var actorOrientation = actorLoc.orientation;
		var isAlreadyFacingInDirection = actorOrientation.forward.clone().directions().equals(directionToMove);
		if (isAlreadyFacingInDirection == false)
		{
			actorOrientation.forwardSet(directionToMove);
			return;
		}

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

		var isDestinationAccessible = this.actionMove_Perform_1
		(
			universe, world, place, actor, action, directionToMove,
			cellDestination
		);

		isDestinationAccessible = this.actionMove_Perform_2
		(
			universe, world, place, actor, action, directionToMove,
			cellDestination, isDestinationAccessible
		);

		this.actionMove_Perform_3
		(
			universe, world, place, actor, action, directionToMove,
			cellDestination, isDestinationAccessible, posInCellsDestination
		);

	};

	DemoData.prototype.actionMove_Perform_1 = function
	(
		universe, world, place, actor, action, directionToMove, cellDestination
	)
	{
		var isDestinationAccessible = true;

		var map = place.map;
		var cellTerrain = cellDestination.terrain(map);
		var costToTraverse = cellTerrain.costToTraverse;
		var mover = actor.mover;
		if (costToTraverse > mover.movesThisTurn)
		{
			isDestinationAccessible = false;
		}

		return isDestinationAccessible;
	}

	DemoData.prototype.actionMove_Perform_2 = function
	(
		universe, world, place, actor, action, directionToMove, cellDestination, isDestinationAccessible
	)
	{
		var player = actor.player;

		if (isDestinationAccessible)
		{
			var entitiesInCellDestination = cellDestination.entitiesPresent;

			for (var b = 0; b < entitiesInCellDestination.length; b++)
			{
				var entityInCell = entitiesInCellDestination[b];

				if (entityInCell.mappable.defn.blocksMovement(entityInCell))
				{
					isDestinationAccessible = false;

					var entityDefnName;

					if (entityInCell.emplacement != null)
					{
						if (player != null)
						{
							entityDefnName = entityInCell.emplacement.appearance;
						}
					}
					else if (entityInCell.mover != null)
					{
						if (player != null)
						{
							entityDefnName = entityInCell.namable.name;
						}
						else
						{
							this.actionAttack_Melee_Perform(universe, world, place, actor, action);
						}
					}

					if (player != null)
					{
						var message = "A " + entityDefnName + " blocks your path.";
						player.messageLog.messageAdd(message);
					}
				}
			}
		}

		return isDestinationAccessible;
	};

	DemoData.prototype.actionMove_Perform_3 = function
	(
		universe, world, place, actor, action, directionToMove,
		cellDestination, isDestinationAccessible, posInCellsDestination
	)
	{
		var player = actor.player;
		var mover = actor.mover;
		var map = place.map;
		var cellTerrain = cellDestination.terrain(map);
		var costToTraverse = cellTerrain.costToTraverse;
		var entitiesInCellDestination = cellDestination.entitiesPresent;

		if (isDestinationAccessible == false)
		{
			if (player == null)
			{
				// hack - Otherwise monsters build up moves.
				// Should probably be handled elsewhere,
				// perhaps in the "Move Toward Player" activity.
				mover.movesThisTurn = 0;
			}
		}
		else
		{
			var mover = actor.mover;
			mover.movesThisTurn -= costToTraverse;
			actor.turnable.hasActedThisTurn = true;

			var cellDeparted = actor.mappable.mapCellOccupied;
			var entitiesInCellDeparted = cellDeparted.entitiesPresent;
			entitiesInCellDeparted.remove(actor);

			if (player != null)
			{
				for (var i = 0; i < entitiesInCellDestination.length; i++)
				{
					var entity = entitiesInCellDestination[i];
					if (entity.item != null)
					{
						var item = entity.item;
						var itemDefn = item.defn(world);
						var message = "There is a " + itemDefn.appearance + " here.";
						player.messageLog.messageAdd(message);
					}
					else if (entity.emplacement != null)
					{
						var emplacement = entity.emplacement;
						entity.drawable.isVisible = true;
						var message = "There is a " + emplacement.appearance + " here.";
						player.messageLog.messageAdd(message);
					}
				}
			}

			entitiesInCellDestination.push(actor);
			actor.mappable.mapCellOccupied = cellDestination;
			actor.locatable.loc.pos.overwriteWith(posInCellsDestination);
		} // end if (isDestinationAccessible)
	};

	DemoData.prototype.actionSearch_Perform = function(universe, world, place, actor, action)
	{
		var costToSearch = actor.mover.movesPerTurn; // todo

		if (actor.mover.movesThisTurn < costToSearch)
		{
			return;
		}

		var player = actor.player;
		var actorLoc = actor.locatable.loc;
		var map = place.map;
		var offsetsToNeighboringCells =
		[
			new Coords(1, 0), new Coords(1, 1), new Coords(0, 1),
			new Coords(-1, 1), new Coords(-1, 0), new Coords(-1, -1),
			new Coords(0, -1), new Coords(1, -1)
		]; // hack
		
		for (var n = 0; n < offsetsToNeighboringCells.length; n++)
		{
			var direction = offsetsToNeighboringCells[n];
			var posInCellsToSearch = actorLoc.pos.clone().add(direction);

			var cellToSearch = map.cellAtPos(posInCellsToSearch);

			if (cellToSearch != null)
			{
				var entitiesInCellToSearch = cellToSearch.entitiesPresent;

				for (var i = 0; i < entitiesInCellToSearch.length; i++)
				{
					var entityInCell = entitiesInCellToSearch[i];

					var searchable = entityInCell.searchable;
					if (searchable != null)
					{
						var randomNumber = world.randomizer.getNextRandom();
						if (randomNumber <= searchable.chanceOfDiscoveryPerSearch)
						{
							searchable.isDiscovered = true;
							entityInCell.drawable.isVisible = true;
							var message = "You find a " + entityInCell.emplacement.appearance + ".";
							player.messageLog.messageAdd(message);
						}
					}

				} // end for each entity in cell

			} // end if cell at offset exists

		} // end for each neighboring cell
	};

	DemoData.prototype.actionWait_Perform = function(universe, world, place, actor, action)
	{
		actor.mover.movesThisTurn = 0;
		actor.turnable.hasActedThisTurn = true;
	};

	DemoData.prototype.actionsBuild = function()
	{
		// directions

		var directions = new Direction_Instances()._ByHeading;

		var actions = this;

		var actionAttack_Melee = new Action
		(
			"Attack with Melee Weapon",
			actions.actionAttack_Melee_Perform
		);

		var actionAttack_Projectile = new Action
		(
			"Fire Projectile",
			actions.actionAttack_Projectile_Perform
		);

		var actionDoorClose = new Action
		(
			"Close Door",
			function perform(universe, world, place, actor, action)
			{
				var shouldOpenNotClose = false;
				actions.actionDoorOpenOrClose_Perform(universe, world, place, actor, action, shouldOpenNotClose);
			}
		);

		var actionDoorOpen = new Action
		(
			"Open Door",
			function perform(universe, world, place, actor, action)
			{
				var shouldOpenNotClose = true;
				actions.actionDoorOpenOrClose_Perform(universe, world, place, actor, action, shouldOpenNotClose);
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

		var actionSearch = new Action("Search", actions.actionSearch_Perform);

		var actionWait = new Action("Wait", actions.actionWait_Perform);

		var actionInstances = Action.Instances();
		var returnValues =
		[
			actionAttack_Melee,
			actionAttack_Projectile,
			actionDoorClose,
			actionDoorOpen,
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
			actionSearch,
			actionWait,
			actionInstances.ShowEquipment,
			actionInstances.ShowItems,
			actionInstances.ShowMenu,
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
				// Do nothing.
			},

			function perform(universe, world, place, actor, activity)
			{
				// Do nothing.
			}
		);

		var activityDefnFlyForward = new ActivityDefn
		(
			"Fly Forward",

			function initialize(universe, world, place, entityActor, activity)
			{
				// Do nothing.
			},

			function perform(universe, world, place, entityActor, activity)
			{
				var actorLoc = entityActor.locatable.loc;
				var actorPos = actorLoc.pos;
				var map = place.map;

				var directionsToMove = actorLoc.orientation.forward.clone().directions(); // hack
				var headingToMove = Heading.fromCoords(directionsToMove);

				// hack
				var actionsMoves = world.defn.actions._MovesByHeading;
				var actionMoveInDirection = actionsMoves[headingToMove];

				entityActor.actorData.actions.push
				(
					actionMoveInDirection
				);
			}
		);

		var activityDefnGenerateMovers = new ActivityDefn
		(
			"Generate Movers",

			function initialize(universe, world, place, actor, activity)
			{
				// Do nothing.
			},

			function perform(universe, world, place, actor, activity)
			{
				var moverGenerator = actor.moverGenerator;
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

				actor.actorData.actions.push(actionMoveInRandomDirection);
			}
		);

		var activityDefnMoveTowardPlayer = new ActivityDefn
		(
			"Move Toward Player",

			function initialize(universe, world, place, entityActor, activity)
			{
				entityActor.actorData.target = entityActor.locatable.loc.pos.clone();
			},

			function perform(universe, world, place, entityActor, activity)
			{
				var awaitables = place.awaitables();
				if (awaitables.length > 0)
				{
					return;
				}

				var mover = entityActor.mover;
				var costToTraverse = mover.movesPerTurn; // hack
				if (mover.movesThisTurn < costToTraverse)
				{
					return;
				}

				// mover.movesThisTurn -= costToTraverse;

				var players = place.entitiesByPropertyName[Player.name];

				if (players != null && players.length > 0)
				{
					var player = players[0];

					var actorPos = entityActor.locatable.loc.pos;
					var playerPos = player.locatable.loc.pos;
					var map = place.map;
					/*
					var fieldOfView = world.sightHelper.fieldOfView;
					var canActorSeePlayer = fieldOfView.lineOfSightBetweenPointsOnMap
					(
						actorPos, playerPos, map
					);
					*/

					// hack
					var distance = playerPos.clone().subtract(actorPos).magnitude();
					var canActorSeePlayer = (distance <= 8);

					var actor = entityActor.actorData;
					var target = actor.target;
					if (canActorSeePlayer)
					{
						target.overwriteWith(playerPos);
					}
					else if (target.equals(actorPos))
					{
						var zone = place.zones.random(universe.randomizer);
						target.overwriteWith(zone.bounds.center).floor();
					}

					var path = new Path
					(
						map,
						actorPos,
						playerPos,
						256 // hack - lengthMax
					);

					path.calculate();

					var pathNodes = path.nodes;
					if (pathNodes.length < 2)
					{
						return;
					}

					var pathNode1 = pathNodes[1];

					var directionsToPathNode1 = pathNode1.cellPos.clone().subtract
					(
						actorPos
					).directions();

					var headingToMove = Heading.fromCoords(directionsToPathNode1);

					// hack
					var actionsMoves = world.defn.actions._MovesByHeading;
					var actionMoveInDirection = actionsMoves[headingToMove];

					actor.actions.push
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
					new ActionToInputsMapping("Attack with Melee Weapon", [ "a" ]),
					new ActionToInputsMapping("Close Door", [ "c" ] ),
					new ActionToInputsMapping("Open Door", [ "d" ] ),
					new ActionToInputsMapping("Fire Projectile", [ "f" ]),
					new ActionToInputsMapping("Pick Up Item", [ "g" ]),
					new ActionToInputsMapping("Drop Selected Item", [ "r" ]),
					new ActionToInputsMapping("Search", [ "s" ] ),
					new ActionToInputsMapping("Target Selected Item", [ "t" ], ),
					new ActionToInputsMapping("Use Emplacement", [ "u" ] ),
					new ActionToInputsMapping("Use Selected Item", [ "y" ]),

					new ActionToInputsMapping("Move Southwest", [ "_1" ]),
					new ActionToInputsMapping("Move South", [ "_2" ]),
					new ActionToInputsMapping("Move Southeast", [ "_3" ]),
					new ActionToInputsMapping("Move West", [ "_4" ]),
					new ActionToInputsMapping("Move East", [ "_6" ]),
					new ActionToInputsMapping("Move Northwest", [ "_7" ]),
					new ActionToInputsMapping("Move North", [ "_8" ]),
					new ActionToInputsMapping("Move Northeast", [ "_9" ]),

					new ActionToInputsMapping("ShowEquipment", [ "`" ]),
					new ActionToInputsMapping("ShowItems", [ "Tab" ]),
					new ActionToInputsMapping("Select Next Item", [ "]" ]),
					new ActionToInputsMapping("Select Previous Item", [ "[" ]),

					new ActionToInputsMapping("Wait", [ "." ]),

					new ActionToInputsMapping("ShowMenu", [ "Escape" ]),

				].addLookups( function(element) { return element.inputNames[0]; } );
			},

			function perform(universe, world, place, actor, activity)
			{
				var awaitables = place.awaitables();
				if (awaitables.length > 0)
				{
					return;
				}

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
				if (actor.mover.movesThisTurn <= actor.mover.movesPerTurn)
				{
					return;
				}

				var actorLoc = actor.locatable.loc;
				var actorPos = actorLoc.pos;

				var target = actor.actorData.target;
				if (target == null)
				{
					var itemsHeld = actor.itemHolder.itemEntities;
					var hasItemGoal = itemsHeld.some(x => x.name == "Amulet of Yendor");

					var itemsOnLevel = place.entitiesByPropertyName[Item.name];
					var itemsNearby = itemsOnLevel.filter
					(
						x => x.locatable.loc.pos.clone().subtract(actorPos).magnitude() < 4
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
						actor.actorData.target = target;
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

				var targetPos = target.locatable.loc.pos;
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
					actor.actorData.target = null;
					if (target.item != null)
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
						actor.locatable.loc.pos
					).directions();

					var heading = Heading.fromCoords(directionsToPathNode1);

					// hack
					var actionsMoves = actionsAll._MovesByHeading;
					var actionMoveInDirection = actionsMoves[heading];
					actionNext = actionMoveInDirection;
				}

				if (actionNext != null)
				{
					actor.actorData.actions.push(actionNext);
				}
			}
		);

		var returnValues =
		[
			activityDefnDoNothing,
			activityDefnFlyForward,
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
