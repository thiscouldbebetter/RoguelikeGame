"use strict";
class DemoData_Actions {
    constructor(parent) {
        this.parent = parent;
        this.randomizer = this.parent.randomizer;
    }
    actionAttack_Melee_Perform(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var actor = uwpe.entity;
        var actorMover = actor.mover();
        var costToAttack = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn < costToAttack) {
            return;
        }
        var actorLoc = actor.locatable().loc;
        var directionFacing = actorLoc.orientation.forward.clone().directions();
        var posInCellsDestination = actorLoc.pos.clone().add(directionFacing);
        var map = place.map;
        var cellDestination = map.cellAtPos(posInCellsDestination);
        if (cellDestination == null) {
            return;
        }
        var actorPlayer = actor.player();
        var entitiesInCellDestination = cellDestination.entitiesPresent;
        for (var i = 0; i < entitiesInCellDestination.length; i++) {
            var entityInCell = entitiesInCellDestination[i];
            uwpe.entity2 = entityInCell;
            var killable = entityInCell.killable();
            if (killable != null) {
                actorMover.movesThisTurn -= costToAttack;
                actor.turnable().hasActedThisTurn = true;
                var equipmentUser = actor.equipmentUser();
                var entityWieldableEquipped = (equipmentUser == null
                    ? null
                    : equipmentUser.itemEntityInSocketWithName("Wielding"));
                var actorHasWieldableEquipped = (entityWieldableEquipped != null);
                var damagePossibleAsDiceRoll;
                if (actorHasWieldableEquipped) {
                    var weapon = entityWieldableEquipped.weapon2();
                    if (weapon != null) {
                        damagePossibleAsDiceRoll = weapon.damagePossibleAsDiceRoll;
                    }
                }
                else {
                    var agentData = actor.agentData();
                    if (agentData != null) {
                        var attack = agentData.attacks[0];
                        damagePossibleAsDiceRoll =
                            attack.damagePossibleAsDiceRoll;
                    }
                    else {
                        throw new Error("Invalid attack!");
                    }
                }
                var damageAmount = damagePossibleAsDiceRoll.roll(world.randomizer);
                var damageInflicted = (actorPlayer == null ? 0 : damageAmount);
                if (damageInflicted == 0) {
                    if (actorPlayer != null) {
                        var message = "You miss the " + entityInCell.namable().name + ".";
                        actorPlayer.messageLog.messageAdd(message);
                    }
                    else if (entityInCell.player() != null) {
                        var message = "The " + actor.namable().name + " misses you.";
                        entityInCell.player().messageLog.messageAdd(message);
                    }
                }
                else {
                    var damageInflictedAsDamage = Damage.fromAmount(damageInflicted);
                    killable.damageApply(uwpe, damageInflictedAsDamage);
                    if (actorPlayer != null) {
                        var message = "You hit the " + entityInCell.namable().name + ".";
                        actorPlayer.messageLog.messageAdd(message);
                        // todo - Weapon skill improvement.
                    }
                    else if (entityInCell.player() != null) {
                        var message = "The " + entityInCell.namable().name + " hits you.";
                        entityInCell.player().messageLog.messageAdd(message);
                    }
                    if (killable.isAlive() == false) {
                        killable.die(uwpe);
                        if (actorPlayer != null) {
                            var message = "You kill the " + entityInCell.namable().name + "!";
                            actorPlayer.messageLog.messageAdd(message);
                            var actorDemographics = actor.demographics();
                            var wasRankIncreased = actorDemographics.experienceAdd(entityInCell.demographics().experienceToKill);
                            if (wasRankIncreased) {
                                var message = "You have reached rank " + actorDemographics.rank + "!";
                                actorPlayer.messageLog.messageAdd(message);
                            }
                        }
                    }
                }
            } // end if (mover != null)
        } // end for entitiesInCellDestination
    }
    actionAttack_Projectile_Perform(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var actor = uwpe.entity;
        var actorMover = actor.mover();
        var costToAttack = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn < costToAttack) {
            return;
        }
        var actorLoc = actor.locatable().loc;
        var directionFacing = actorLoc.orientation.forward.clone().directions();
        var posInCellsInFront = actorLoc.pos.clone().add(directionFacing);
        var map = place.map;
        var cellInFront = map.cellAtPos(posInCellsInFront);
        if (cellInFront == null) {
            return;
        }
        var cellInFrontTerrain = cellInFront.terrain(map);
        var mover = actor.mover();
        var costToTraverse = mover.costToTraverseTerrain(cellInFrontTerrain);
        if (costToTraverse >= MapTerrain.AlmostInfinity) {
            return;
        }
        mover.movesThisTurn -= costToAttack;
        actor.turnable().hasActedThisTurn = true;
        var projectileLoc = actor.locatable().loc.clone();
        var projectilePos = projectileLoc.pos;
        //projectilePos.add(directionFacing);
        projectilePos.z++;
        var visual = world.defn2.entityDefnByName("Dagger").drawable().visual; // todo
        var projectileEntity = new Entity2("Projectile", [
            new ActorDefn("Fly Forward"),
            new Awaitable(),
            MappableDefn.Instances().Open,
            Drawable.fromVisual(visual),
            //new Ephemeral(8, null),
            new Locatable(projectileLoc),
            Mover.fromMovesPerTurn(3) // hack
        ]);
        place.entityToSpawnAdd(projectileEntity);
        var player = actor.player();
        if (player != null) {
            player.messageLog.messageAdd("You throw a dagger.");
        }
    }
    actionDoorOpenOrClose_Perform(uwpe, shouldOpenNotClose) {
        var actor = uwpe.entity;
        var actorMover = actor.mover();
        var costToPerform = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn >= costToPerform) {
            var actorData = actor.actorData();
            var entityBeingFaced = actorData.entityBeingFaced(uwpe);
            if (entityBeingFaced != null) {
                var searchable = entityBeingFaced.searchable();
                var openable = entityBeingFaced.openable();
                var isHidden = (searchable != null && searchable.isHidden);
                if (isHidden) {
                    // Do nothing.
                }
                else if (openable != null) {
                    var isAlreadyInDesiredState = (shouldOpenNotClose == openable.isOpen);
                    if (isAlreadyInDesiredState) {
                        if (actor.player() != null) {
                            var openOrClosed = (shouldOpenNotClose ? "open" : "closed");
                            var appearance = entityBeingFaced.emplacement().appearance; // hack
                            var message = "The " + appearance + " is already " + openOrClosed + ".";
                            actor.player().messageLog.messageAdd(message);
                        }
                    }
                    else {
                        var openOrClose = (shouldOpenNotClose ? "open" : "close");
                        if (actor.player() != null) {
                            var appearance = entityBeingFaced.emplacement().appearance; // hack
                            var message = "You " + openOrClose + " the " + appearance + ".";
                            actor.player().messageLog.messageAdd(message);
                        }
                        openable.isOpen = (openable.isOpen == false);
                        actorMover.movesThisTurn -= costToPerform;
                        actor.turnable().hasActedThisTurn = true;
                    }
                } // end if openable != null
            } // end if cellDestination != null
        } // end if enough moves
    }
    actionEmplacement_Use_Perform(uwpe) {
        var place = uwpe.place;
        var actor = uwpe.entity;
        var loc = actor.locatable().loc;
        var posInCells = loc.pos;
        var emplacementsInCell = place.entitiesWithPropertyNamePresentAtCellPos(Emplacement.name, posInCells // hack
        );
        if (emplacementsInCell.length == 0) {
            return;
        }
        var mover = actor.mover();
        var emplacementToUse = emplacementsInCell[0];
        uwpe.entity2 = emplacementToUse;
        var costToUse = mover.movesPerTurn; // hack
        if (mover.movesThisTurn >= costToUse) {
            mover.movesThisTurn -= costToUse;
            actor.turnable().hasActedThisTurn = true;
            emplacementToUse.emplacement().use(uwpe);
        }
    }
    actionItem_DropSelected_Perform(uwpe) {
        var world = uwpe.world;
        var actor = uwpe.entity;
        /*
        var loc = actor.locatable().loc;
        var posInCells = loc.pos;
        var itemsPresentInCell = place.entitiesWithPropertyNamePresentAtCellPos
        (
            Item.name, posInCells
        );
        */
        var mover = actor.mover();
        var itemHolder = actor.itemHolder();
        var itemToDrop = itemHolder.itemSelected;
        uwpe.entity2 = itemToDrop.toEntity(uwpe);
        var costToDrop = mover.movesPerTurn; // hack
        if (itemToDrop != null && mover.movesThisTurn >= costToDrop) {
            mover.movesThisTurn -= costToDrop;
            actor.turnable().hasActedThisTurn = true;
            var removeItem = (uwpeRemove) => {
                var itemsHeld = itemHolder.items;
                var actionSelectNext = world.defn2.actionsByName.get("Item_SelectNext");
                actionSelectNext.perform(uwpe);
                ArrayHelper.remove(itemsHeld, itemToDrop);
                if (itemsHeld.length == 0) {
                    itemHolder.itemSelected = null;
                }
            };
            var dropItem = (uwpeDrop) => {
                //var itemsHeld = itemHolder.itemEntities;
                removeItem(uwpeDrop);
                var itemToDropAsEntity = itemToDrop.toEntity(uwpe);
                var itemLoc = itemToDropAsEntity.locatable().loc;
                itemLoc.overwriteWith(actor.locatable().loc);
                uwpe.place.entitiesToSpawn.push(itemToDropAsEntity);
            };
            dropItem(uwpe);
        }
    }
    actionItem_PickUp_Perform(uwpe) {
        var place = uwpe.place;
        var actor = uwpe.entity;
        var loc = actor.locatable().loc;
        var posInCells = loc.pos;
        var cell = place.map.cellAtPos(posInCells);
        var entitiesPresentAtCellPos = cell.entitiesPresent;
        var mover = actor.mover();
        var costToPickUp = mover.movesPerTurn; // hack
        for (var i = 0; i < entitiesPresentAtCellPos.length; i++) {
            var entityPresent = entitiesPresentAtCellPos[i];
            if (entityPresent != actor) {
                var itemEntityToPickUp = entityPresent;
                if (itemEntityToPickUp != null) {
                    uwpe.entity2 = itemEntityToPickUp;
                    var itemToPickUp = itemEntityToPickUp.item();
                    if (mover.movesThisTurn >= costToPickUp) {
                        mover.movesThisTurn -= costToPickUp;
                        actor.turnable().hasActedThisTurn = true;
                        var pickUpItem = (uwpePickUp) => {
                            var itemHolder = uwpePickUp.entity.itemHolder();
                            var itemEntityToPickUp = uwpePickUp.entity2;
                            var itemToPickUp = itemEntityToPickUp.item();
                            itemHolder.itemAdd(itemToPickUp);
                            place.entityToRemoveAdd(itemEntityToPickUp);
                            if (itemHolder.itemSelected == null) {
                                itemHolder.itemSelected = itemToPickUp;
                            }
                        };
                        pickUpItem(uwpe);
                        var itemToPickUpDefn = itemToPickUp.defn(uwpe.world);
                        var message = "You pick up the " + itemToPickUpDefn.appearance + ".";
                        actor.player().messageLog.messageAdd(message);
                    }
                }
            }
        }
    }
    actionItem_SelectedUse_Perform(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var actor = uwpe.entity;
        var actorMover = actor.mover();
        var costToUse = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn < costToUse) {
            return;
        }
        var actorLoc = actor.locatable().loc;
        var directionFacing = actorLoc.orientation.forward.clone().directions();
        var posInCellsDestination = actorLoc.pos.clone().add(directionFacing);
        var map = place.map;
        var cellDestination = map.cellAtPos(posInCellsDestination);
        if (cellDestination == null) {
            return;
        }
        var equipmentUser = actor.equipmentUser();
        var entityItemToUse = equipmentUser.itemEntityInSocketWithName("Tool");
        var player = actor.player();
        if (entityItemToUse == null) {
            var message = "You have no tool equipped!";
            player.messageLog.messageAdd(message);
        }
        else {
            var entitiesInCellDestination = cellDestination.entitiesPresent;
            for (var i = 0; i < entitiesInCellDestination.length; i++) {
                var entityInCell = entitiesInCellDestination[i];
                actorMover.movesThisTurn -= costToUse;
                actor.turnable().hasActedThisTurn = true;
                if (player != null) {
                    var itemToUse = entityItemToUse.item();
                    var itemDefnName = itemToUse.defn(world).appearance;
                    var message = "You use the " + itemDefnName + " on the " + entityInCell.namable().name + ".";
                    player.messageLog.messageAdd(message);
                }
            } // end for entitiesInCellDestination
        }
    }
    actionMove_Perform(uwpe, directionToMove) {
        var place = uwpe.place;
        var actor = uwpe.entity;
        /*

        // This doesn't make sense, does it?

        var actorMover = actor.mover();
        if (actorMover.movesThisTurn < actorMover.movesPerTurn)
        {
            return;
        }

        */
        if (directionToMove.magnitude() == 0) {
            return;
        }
        var actorLoc = actor.locatable().loc;
        var actorOrientation = actorLoc.orientation;
        var isAlreadyFacingInDirection = actorOrientation.forward.clone().directions().equals(directionToMove);
        if (isAlreadyFacingInDirection == false) {
            actorOrientation.forwardSet(directionToMove);
            return;
        }
        var posInCellsDestination = actorLoc.pos.clone().add(directionToMove);
        var map = place.map;
        var cellDestination = map.cellAtPos(posInCellsDestination);
        if (cellDestination != null) {
            var isDestinationAccessible = this.actionMove_Perform_1_IsDestinationAccessible_Terrain(uwpe, directionToMove, cellDestination);
            isDestinationAccessible =
                this.actionMove_Perform_2_IsDestinationAccessible_Entities(uwpe, directionToMove, cellDestination, isDestinationAccessible);
            this.actionMove_Perform_3_Move(uwpe, directionToMove, cellDestination, isDestinationAccessible, posInCellsDestination);
        }
    }
    actionMove_Perform_1_IsDestinationAccessible_Terrain(uwpe, directionToMove, cellDestination) {
        var place = uwpe.place;
        var actor = uwpe.entity;
        var isDestinationAccessible = true;
        var map = place.map;
        var cellTerrain = cellDestination.terrain(map);
        var mover = actor.mover();
        var costToTraverse = mover.costToTraverseTerrain(cellTerrain);
        if (costToTraverse > mover.movesThisTurn) {
            isDestinationAccessible = false;
        }
        return isDestinationAccessible;
    }
    actionMove_Perform_2_IsDestinationAccessible_Entities(uwpe, directionToMove, cellDestination, isDestinationAccessible) {
        if (isDestinationAccessible) {
            var actor = uwpe.entity;
            var player = actor.player();
            var entitiesInCellDestination = cellDestination.entitiesPresent;
            for (var b = 0; b < entitiesInCellDestination.length; b++) {
                var entityInCell = entitiesInCellDestination[b];
                var mappable = entityInCell.mappable();
                var mappableDefn = mappable.defn; // todo - Something weird happening.
                if (mappableDefn.blocksMovement(entityInCell)) {
                    isDestinationAccessible = false;
                    var searchable = entityInCell.searchable();
                    if (searchable == null || searchable.isHidden == false) {
                        var entityDefnName;
                        if (entityInCell.emplacement() != null) {
                            if (player != null) {
                                entityDefnName = entityInCell.emplacement().appearance;
                            }
                        }
                        else if (entityInCell.mover() != null) {
                            if (player != null) {
                                entityDefnName = entityInCell.namable().name;
                            }
                            else {
                                this.actionAttack_Melee_Perform(uwpe);
                            }
                        }
                        else if (entityInCell.namable() != null) {
                            entityDefnName = entityInCell.namable().name;
                        }
                        else {
                            entityDefnName = "unknown force";
                        }
                        if (player != null) {
                            var message = "A " + entityDefnName + " blocks your path.";
                            player.messageLog.messageAdd(message);
                        }
                    }
                }
            }
        }
        return isDestinationAccessible;
    }
    actionMove_Perform_3_Move(uwpe, directionToMove, cellDestination, isDestinationAccessible, posInCellsDestination) {
        var actor = uwpe.entity;
        var player = actor.player();
        var mover = actor.mover();
        if (isDestinationAccessible == false) {
            if (player == null) {
                // hack - Otherwise monsters build up moves.
                // Should probably be handled elsewhere,
                // perhaps in the "Move Toward Player" activity.
                mover.movesThisTurn = 0;
            }
        }
        else {
            var world = uwpe.world;
            var place = uwpe.place;
            var map = place.map;
            var mover = actor.mover();
            var cellTerrain = cellDestination.terrain(map);
            var costToTraverse = mover.costToTraverseTerrain(cellTerrain);
            var entitiesInCellDestination = cellDestination.entitiesPresent;
            mover.movesThisTurn -= costToTraverse;
            actor.turnable().hasActedThisTurn = true;
            var cellDeparted = actor.mappable().mapCellOccupied;
            var entitiesInCellDeparted = cellDeparted.entitiesPresent;
            ArrayHelper.remove(entitiesInCellDeparted, actor);
            if (player != null) {
                for (var i = 0; i < entitiesInCellDestination.length; i++) {
                    var entity = entitiesInCellDestination[i];
                    var entityItem = entity.item();
                    var messageLog = player.messageLog;
                    if (entityItem != null) {
                        var itemDefn = entityItem.defn(world);
                        var message = "There is a " + itemDefn.appearance + " here.";
                        messageLog.messageAdd(message);
                    }
                    else if (entity.emplacement != null) {
                        var emplacement = entity.emplacement();
                        entity.drawable().isVisible = true;
                        var message = "There is a " + emplacement.appearance + " here.";
                        messageLog.messageAdd(message);
                    }
                }
            }
            entitiesInCellDestination.push(actor);
            actor.mappable().mapCellOccupied = cellDestination;
            actor.locatable().loc.pos.overwriteWith(posInCellsDestination);
        }
    }
    actionSearch_Perform(uwpe) {
        var world = uwpe.world;
        var place = uwpe.place;
        var actor = uwpe.entity;
        var mover = actor.mover();
        var costToSearch = mover.movesPerTurn; // todo
        if (mover.movesThisTurn < costToSearch) {
            return;
        }
        mover.movesThisTurn = 0;
        actor.turnable().hasActedThisTurn = true;
        var player = actor.player();
        var actorLoc = actor.locatable().loc;
        var map = place.map;
        var offsetsToNeighboringCells = [
            Coords.fromXY(1, 0), Coords.fromXY(1, 1), Coords.fromXY(0, 1),
            Coords.fromXY(-1, 1), Coords.fromXY(-1, 0), Coords.fromXY(-1, -1),
            Coords.fromXY(0, -1), Coords.fromXY(1, -1)
        ]; // hack
        for (var n = 0; n < offsetsToNeighboringCells.length; n++) {
            var direction = offsetsToNeighboringCells[n];
            var posInCellsToSearch = actorLoc.pos.clone().add(direction);
            var cellToSearch = map.cellAtPos(posInCellsToSearch);
            if (cellToSearch != null) {
                var entitiesInCellToSearch = cellToSearch.entitiesPresent;
                for (var i = 0; i < entitiesInCellToSearch.length; i++) {
                    var entityInCell = entitiesInCellToSearch[i];
                    uwpe.entity2 = entityInCell;
                    var searchable = entityInCell.searchable();
                    if (searchable != null && searchable.isHidden) {
                        var randomNumber = world.randomizer.getNextRandom();
                        if (randomNumber <= searchable.chanceOfDiscoveryPerSearch) {
                            searchable.isHidden = false;
                            entityInCell.drawable().isVisible = true;
                            var message = "You find a "
                                + entityInCell.emplacement().appearance + ".";
                            player.messageLog.messageAdd(message);
                            if (searchable.discover != null) {
                                searchable.discover(uwpe);
                            }
                        }
                    }
                } // end for each entity in cell
            } // end if cell at offset exists
        } // end for each neighboring cell
    }
    actionTalk_Perform(uwpe) {
        var actor = uwpe.entity;
        var actorMover = actor.mover();
        var costToPerform = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn >= costToPerform) {
            var actorData = actor.actorData();
            var entityBeingFaced = actorData.entityBeingFaced(uwpe);
            if (entityBeingFaced != null) {
                uwpe.entity2 = entityBeingFaced;
                var talker = entityBeingFaced.talker();
                if (talker != null) {
                    talker.talk(uwpe);
                }
            } // end if entityBeingFaced != null
        } // end if enough moves
    }
    actionWait_Perform(uwpe) {
        var actor = uwpe.entity;
        actor.mover().movesThisTurn = 0;
        actor.turnable().hasActedThisTurn = true;
    }
    actionsBuild() {
        // directions
        var directions = Direction.Instances()._ByHeading;
        var demoActions = this;
        var actionAttack_Melee = new Action("Attack with Melee Weapon", demoActions.actionAttack_Melee_Perform);
        var actionAttack_Projectile = new Action("Fire Projectile", demoActions.actionAttack_Projectile_Perform);
        var actionDoorClose = new Action("Close Door", (uwpe) => {
            var shouldOpenNotClose = false;
            demoActions.actionDoorOpenOrClose_Perform(uwpe, shouldOpenNotClose);
        });
        var actionDoorOpen = new Action("Open Door", (uwpe) => {
            var shouldOpenNotClose = true;
            demoActions.actionDoorOpenOrClose_Perform(uwpe, shouldOpenNotClose);
        });
        var actionEmplacement_Use = new Action("Use Emplacement", demoActions.actionEmplacement_Use_Perform);
        /*
        var actionItem_DropSelected = new Action
        (
            "Drop Selected Item",
            demoActions.actionItem_DropSelected_Perform
        );
        */
        var actionItem_PickUp = new Action("Pick Up Item", demoActions.actionItem_PickUp_Perform);
        var actionItem_SelectedUse = new Action("Use Selected Item", demoActions.actionItem_SelectedUse_Perform);
        var actionMoveE = new Action("Move East", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[0]);
        });
        var actionMoveSE = new Action("Move Southeast", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[1]);
        });
        var actionMoveS = new Action("Move South", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[2]);
        });
        var actionMoveSW = new Action("Move Southwest", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[3]);
        });
        var actionMoveW = new Action("Move West", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[4]);
        });
        var actionMoveNW = new Action("Move Northwest", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[5]);
        });
        var actionMoveN = new Action("Move North", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[6]);
        });
        var actionMoveNE = new Action("Move Northeast", (uwpe) => {
            demoActions.actionMove_Perform(uwpe, directions[7]);
        });
        var actionSearch = new Action("Search", demoActions.actionSearch_Perform);
        var actionTalk = new Action("Talk", demoActions.actionTalk_Perform);
        var actionWait = new Action("Wait", demoActions.actionWait_Perform);
        var actionInstances = Action.Instances();
        var actions = [
            actionAttack_Melee,
            actionAttack_Projectile,
            actionDoorClose,
            actionDoorOpen,
            actionEmplacement_Use,
            actionItem_PickUp,
            actionItem_SelectedUse,
            actionMoveE,
            actionMoveSE,
            actionMoveS,
            actionMoveSW,
            actionMoveW,
            actionMoveNW,
            actionMoveN,
            actionMoveNE,
            actionSearch,
            actionTalk,
            actionWait,
            actionInstances.ShowMenuPlayer,
        ];
        // hack
        var actionMovesByHeading = [
            actionMoveE,
            actionMoveSE,
            actionMoveS,
            actionMoveSW,
            actionMoveW,
            actionMoveNW,
            actionMoveN,
            actionMoveNE,
        ];
        var returnValues = [actions, actionMovesByHeading];
        return returnValues;
    }
}
