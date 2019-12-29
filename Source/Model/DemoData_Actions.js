function DemoData_Actions()
{
	// Do nothing.
}
{
	DemoData_Actions.prototype.actionEmplacement_Use_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var venue = loc.place(world);
		var posInCells = loc.pos;
		var emplacementsInCell = venue.entitiesWithPropertyNamePresentAtCellPos
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

	DemoData_Actions.prototype.actionItem_DropSelected_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var venue = loc.place(world);
		var posInCells = loc.pos;
		var itemsPresentInCell = venue.entitiesWithPropertyPresentAtCellPos
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

				var indexOfItemToDrop = itemsHeld.indexOf(itemToDrop);
				itemsHeld.splice(indexOfItemToDrop, 1);

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
				itemLoc.place(world).entitiesToSpawn.push(itemToDrop);
			}

			dropItem(actor.ItemHolder, world, actor, itemToDrop);
		}
	};

	DemoData_Actions.prototype.actionItem_PickUp_Perform = function(universe, world, place, actor, action)
	{
		var loc = actor.Locatable.loc;
		var venue = loc.place(world);
		var posInCells = loc.pos;

		var cell = venue.map.cellAtPos(posInCells);
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
						var venue = place;
						venue.entitiesToRemove.push(itemToPickUp);

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

	DemoData_Actions.prototype.actionItem_SelectAtOffset_Perform = function(universe, world, place, actor, action, indexOffset)
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

	DemoData_Actions.prototype.actionItem_TargetSelected_Perform = function(universe, world, place, actor, action)
	{
		var itemHolder = actor.ItemHolder;
		itemHolder.itemTargeted = itemHolder.itemSelected;
		actor.MoverData.controlUpdate(world, actor);
	};

	DemoData_Actions.prototype.actionItem_UseSelected_Perform = function(universe, world, place, actor, action)
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

	DemoData_Actions.prototype.actionMove_Perform = function(universe, world, place, actor, action, directionToMove)
	{
		if (directionToMove.magnitude() == 0)
		{
			return;
		}

		var actorLoc = actor.Locatable.loc;
		var venue = actorLoc.place(world);

		var posInCellsDestination = actorLoc.pos.clone().add
		(
			directionToMove
		);

		var map = venue.map;
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

			if (entityInCell.Collidable.defn.blocksMovement == true)
			{
				isDestinationAccessible = false;
			}

			if (entityInCell.MoverDefn != null)
			{
				isDestinationAccessible = false;

				var costToAttack = 1; // todo
				actor.MoverData.movesThisTurn -= costToAttack;

				// todo - Calculate damage.
				var damageInflicted = DiceRoll.roll(world.randomizer, "1d6");

				var entityDefns = world.defn.entityDefns;
				var defnsOfEntitiesToSpawn = [];

				if (damageInflicted > 0)
				{
					var killable = entityInCell.Killable;
					killable.damageApply
					(
						universe, world, place, actor, entityInCell, damageInflicted
					);

					if (killable.integrity <= 0)
					{
						defnsOfEntitiesToSpawn.push
						(
							entityInCell.MoverDefn.entityDefnCorpse
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

					var entityToSpawn = EntityHelper.new
					(
						defnOfEntityToSpawn.name + "_Spawned",
						defnOfEntityToSpawn,
						[ new Locatable(new Location(posInCellsDestination)) ]
					);

					venue.entitiesToSpawn.push
					(
						entityToSpawn
					);
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

				entitiesInCellDestination.push(actor);
				actor.Collidable.mapCellOccupied = cellDestination;

				var actorLoc = actor.Locatable.loc;
				actorLoc.pos.overwriteWith
				(
					posInCellsDestination
				);
				actorLoc.orientation.forwardSet(directionToMove);
			}
		}
	};

	DemoData_Actions.prototype.actionWait_Perform = function(universe, world, place, actor, action)
	{
		actor.MoverData.movesThisTurn = 0;
	};

	DemoData_Actions.prototype.actionsBuild = function()
	{
		// directions

		var directions = new Direction_Instances()._ByHeading;

		var actions = this;

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
}
