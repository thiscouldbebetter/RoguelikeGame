"use strict";
class DemoData_Actions {
    constructor(parent) {
        this.parent = parent;
        this.randomizer = this.parent.randomizer;
    }
    actionAttack_Melee_Perform(universe, worldAsWorld, placeAsPlace, actorAsEntity) {
        var world = worldAsWorld;
        var place = placeAsPlace;
        var actor = actorAsEntity;
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
            var killable = entityInCell.killable();
            if (killable != null) {
                actorMover.movesThisTurn -= costToAttack;
                actor.turnable().hasActedThisTurn = true;
                // todo - Calculate damage.
                // hack - Only the player can inflict damage for now.
                var damagePossibleAsDieRoll = "1d6";
                var damageAmount = DiceRoll.roll(damagePossibleAsDieRoll, world.randomizer);
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
                    var damageInflictedAsDamage = new Damage(damageInflicted, null, null);
                    killable.damageApply(universe, world, place, actor, entityInCell, damageInflictedAsDamage);
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
                        killable.die(universe, world, place, entityInCell);
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
    actionAttack_Projectile_Perform(universe, worldAsWorld, placeAsPlace, actorAsEntity) {
        var world = worldAsWorld;
        var place = placeAsPlace;
        var actor = actorAsEntity;
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
        if (cellInFront.terrain(map).costToTraverse >= MapTerrain.AlmostInfinity) {
            return;
        }
        actor.mover().movesThisTurn -= costToAttack;
        actor.turnable().hasActedThisTurn = true;
        var projectileLoc = actor.locatable().loc.clone();
        var projectilePos = projectileLoc.pos;
        //projectilePos.add(directionFacing);
        projectilePos.z++;
        var visual = world.defn2.entityDefnsByName().get("Dagger").drawable().visual; // todo
        var projectileEntity = new Entity2("Projectile" + IDHelper.Instance().idNext(), [
            new ActorDefn("Fly Forward"),
            new Awaitable(),
            MappableDefn.Instances().Open,
            new Drawable(visual, true),
            new Ephemeral(8, null),
            new Locatable(projectileLoc),
            new Mover(1) // hack
        ]);
        place.entitiesToSpawn.push(projectileEntity);
        if (actor.player() != null) {
            actor.player().messageLog.messageAdd("You throw a dagger.");
        }
    }
    actionDoorOpenOrClose_Perform(universe, world, placeAsPlace, actorAsEntity, shouldOpenNotClose) {
        var actor = actorAsEntity;
        var actorMover = actor.mover();
        var costToPerform = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn >= costToPerform) {
            var entityBeingFaced = actor.actorData().entityBeingFaced(universe, world, placeAsPlace, actor);
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
    actionEmplacement_Use_Perform(universe, world, placeAsPlace, actorAsEntity) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var loc = actor.locatable().loc;
        var posInCells = loc.pos;
        var emplacementsInCell = place.entitiesWithPropertyNamePresentAtCellPos(Emplacement.name, posInCells // hack
        );
        if (emplacementsInCell.length == 0) {
            return;
        }
        var mover = actor.mover();
        var emplacementToUse = emplacementsInCell[0];
        var costToUse = mover.movesPerTurn; // hack
        if (mover.movesThisTurn >= costToUse) {
            mover.movesThisTurn -= costToUse;
            actor.turnable().hasActedThisTurn = true;
            emplacementToUse.emplacement().use(universe, world, place, actor, emplacementToUse);
        }
    }
    actionItem_DropSelected_Perform(universe, worldAsWorld, place, actorAsEntity) {
        var world = worldAsWorld;
        var actor = actorAsEntity;
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
        var itemToDrop = itemHolder.itemEntitySelected;
        var costToDrop = mover.movesPerTurn; // hack
        if (itemToDrop != null && mover.movesThisTurn >= costToDrop) {
            mover.movesThisTurn -= costToDrop;
            actor.turnable().hasActedThisTurn = true;
            var removeItem = (itemHolder, world, actor, itemToDrop) => {
                var itemsHeld = itemHolder.itemEntities;
                var actionSelectNext = world.defn2.actionsByName.get("Item_SelectNext");
                actionSelectNext.perform(null, world, place, actor);
                ArrayHelper.remove(itemsHeld, itemToDrop);
                if (itemsHeld.length == 0) {
                    itemHolder.itemEntitySelected = null;
                }
            };
            var dropItem = (itemHolder, world, actor, itemToDrop) => {
                //var itemsHeld = itemHolder.itemEntities;
                removeItem(itemHolder, world, actor, itemToDrop);
                var itemLoc = itemToDrop.locatable().loc;
                itemLoc.overwriteWith(actor.locatable().loc);
                place.entitiesToSpawn.push(itemToDrop);
            };
            dropItem(actor.itemHolder(), world, actor, itemToDrop);
        }
    }
    actionItem_PickUp_Perform(universe, world, placeAsPlace, actorAsEntity) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var loc = actor.locatable().loc;
        var posInCells = loc.pos;
        var cell = place.map.cellAtPos(posInCells);
        var entitiesPresentAtCellPos = cell.entitiesPresent;
        var mover = actor.mover();
        var costToPickUp = mover.movesPerTurn; // hack
        for (var i = 0; i < entitiesPresentAtCellPos.length; i++) {
            var entityPresent = entitiesPresentAtCellPos[i];
            var itemToPickUp = entityPresent.item();
            if (itemToPickUp != null) {
                if (mover.movesThisTurn >= costToPickUp) {
                    mover.movesThisTurn -= costToPickUp;
                    actor.turnable().hasActedThisTurn = true;
                    var pickUpItem = (itemHolder, world, actor, itemToPickUp) => {
                        itemHolder.itemEntities.push(itemToPickUp);
                        place.entitiesToRemove.push(itemToPickUp);
                        if (itemHolder.itemEntitySelected == null) {
                            itemHolder.itemEntitySelected = itemToPickUp;
                        }
                    };
                    pickUpItem(actor.itemHolder(), world, actor, entityPresent);
                    var itemToPickUpDefn = itemToPickUp.defn(world);
                    var message = "You pick up the " + itemToPickUpDefn.appearance + ".";
                    actor.player().messageLog.messageAdd(message);
                }
            }
        }
    }
    actionMove_Perform(universe, world, placeAsPlace, actorAsEntity, action, directionToMove) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var actorMover = actor.mover();
        if (actorMover.movesThisTurn < actorMover.movesPerTurn) {
            return;
        }
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
        if (cellDestination == null) {
            return;
        }
        var isDestinationAccessible = this.actionMove_Perform_1(universe, world, place, actor, action, directionToMove, cellDestination);
        isDestinationAccessible = this.actionMove_Perform_2(universe, world, place, actor, action, directionToMove, cellDestination, isDestinationAccessible);
        this.actionMove_Perform_3(universe, world, place, actor, action, directionToMove, cellDestination, isDestinationAccessible, posInCellsDestination);
    }
    actionMove_Perform_1(universe, world, placeAsPlace, actorAsEntity, action, directionToMove, cellDestination) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var isDestinationAccessible = true;
        var map = place.map;
        var cellTerrain = cellDestination.terrain(map);
        var costToTraverse = cellTerrain.costToTraverse;
        var mover = actor.mover();
        if (costToTraverse > mover.movesThisTurn) {
            isDestinationAccessible = false;
        }
        return isDestinationAccessible;
    }
    actionMove_Perform_2(universe, world, place, actorAsEntity, action, directionToMove, cellDestination, isDestinationAccessible) {
        if (isDestinationAccessible) {
            var actor = actorAsEntity;
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
                                this.actionAttack_Melee_Perform(universe, world, place, actor);
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
    ;
    actionMove_Perform_3(universe, world, placeAsPlace, actorAsEntity, action, directionToMove, cellDestination, isDestinationAccessible, posInCellsDestination) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var player = actor.player();
        var mover = actor.mover();
        var map = place.map;
        var cellTerrain = cellDestination.terrain(map);
        var costToTraverse = cellTerrain.costToTraverse;
        var entitiesInCellDestination = cellDestination.entitiesPresent;
        if (isDestinationAccessible == false) {
            if (player == null) {
                // hack - Otherwise monsters build up moves.
                // Should probably be handled elsewhere,
                // perhaps in the "Move Toward Player" activity.
                mover.movesThisTurn = 0;
            }
        }
        else {
            var mover = actor.mover();
            mover.movesThisTurn -= costToTraverse;
            actor.turnable().hasActedThisTurn = true;
            var cellDeparted = actor.mappable().mapCellOccupied;
            var entitiesInCellDeparted = cellDeparted.entitiesPresent;
            ArrayHelper.remove(entitiesInCellDeparted, actor);
            if (player != null) {
                for (var i = 0; i < entitiesInCellDestination.length; i++) {
                    var entity = entitiesInCellDestination[i];
                    var entityItem = entity.item();
                    if (entityItem != null) {
                        var itemDefn = entityItem.defn(world);
                        var message = "There is a " + itemDefn.appearance + " here.";
                        player.messageLog.messageAdd(message);
                    }
                    else if (entity.emplacement != null) {
                        var emplacement = entity.emplacement();
                        entity.drawable().isVisible = true;
                        var message = "There is a " + emplacement.appearance + " here.";
                        player.messageLog.messageAdd(message);
                    }
                }
            }
            entitiesInCellDestination.push(actor);
            actor.mappable().mapCellOccupied = cellDestination;
            actor.locatable().loc.pos.overwriteWith(posInCellsDestination);
        } // end if (isDestinationAccessible)
    }
    actionSearch_Perform(universe, world, placeAsPlace, actorAsEntity) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
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
            new Coords(1, 0, 0), new Coords(1, 1, 0), new Coords(0, 1, 0),
            new Coords(-1, 1, 0), new Coords(-1, 0, 0), new Coords(-1, -1, 0),
            new Coords(0, -1, 0), new Coords(1, -1, 0)
        ]; // hack
        for (var n = 0; n < offsetsToNeighboringCells.length; n++) {
            var direction = offsetsToNeighboringCells[n];
            var posInCellsToSearch = actorLoc.pos.clone().add(direction);
            var cellToSearch = map.cellAtPos(posInCellsToSearch);
            if (cellToSearch != null) {
                var entitiesInCellToSearch = cellToSearch.entitiesPresent;
                for (var i = 0; i < entitiesInCellToSearch.length; i++) {
                    var entityInCell = entitiesInCellToSearch[i];
                    var searchable = entityInCell.searchable();
                    if (searchable != null && searchable.isHidden) {
                        var randomNumber = world.randomizer.getNextRandom();
                        if (randomNumber <= searchable.chanceOfDiscoveryPerSearch) {
                            searchable.isHidden = false;
                            entityInCell.drawable().isVisible = true;
                            var message = "You find a " + entityInCell.emplacement().appearance + ".";
                            player.messageLog.messageAdd(message);
                            if (searchable.discover != null) {
                                searchable.discover(universe, world, place, actor, entityInCell);
                            }
                        }
                    }
                } // end for each entity in cell
            } // end if cell at offset exists
        } // end for each neighboring cell
    }
    actionTalk_Perform(universe, world, placeAsPlace, actorAsEntity) {
        var place = placeAsPlace;
        var actor = actorAsEntity;
        var actorMover = actor.mover();
        var costToPerform = actorMover.movesPerTurn; // todo
        if (actorMover.movesThisTurn >= costToPerform) {
            var entityBeingFaced = actor.actorData().entityBeingFaced(universe, world, place, actor);
            if (entityBeingFaced != null) {
                var talker = entityBeingFaced.talker();
                if (talker != null) {
                    talker.talk(universe, world, place, entityBeingFaced, actor);
                }
            } // end if entityBeingFaced != null
        } // end if enough moves
    }
    actionWait_Perform(universe, world, place, actorAsEntity) {
        var actor = actorAsEntity;
        actor.mover().movesThisTurn = 0;
        actor.turnable().hasActedThisTurn = true;
    }
    actionsBuild() {
        // directions
        var directions = new Direction_Instances()._ByHeading;
        var demoActions = this;
        var actionAttack_Melee = new Action("Attack with Melee Weapon", demoActions.actionAttack_Melee_Perform);
        var actionAttack_Projectile = new Action("Fire Projectile", demoActions.actionAttack_Projectile_Perform);
        var actionDoorClose = new Action("Close Door", (universe, world, place, actor) => {
            var shouldOpenNotClose = false;
            demoActions.actionDoorOpenOrClose_Perform(universe, world, place, actor, shouldOpenNotClose);
        });
        var actionDoorOpen = new Action("Open Door", (universe, world, place, actor) => {
            var shouldOpenNotClose = true;
            demoActions.actionDoorOpenOrClose_Perform(universe, world, place, actor, shouldOpenNotClose);
        });
        var actionEmplacement_Use = new Action("Use Emplacement", demoActions.actionEmplacement_Use_Perform);
        var actionItem_DropSelected = new Action("Drop Selected Item", demoActions.actionItem_DropSelected_Perform);
        var actionItem_PickUp = new Action("Pick Up Item", demoActions.actionItem_PickUp_Perform);
        var actionMoveE = new Action("Move East", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[0]);
        });
        var actionMoveSE = new Action("Move Southeast", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[1]);
        });
        var actionMoveS = new Action("Move South", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[2]);
        });
        var actionMoveSW = new Action("Move Southwest", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[3]);
        });
        var actionMoveW = new Action("Move West", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[4]);
        });
        var actionMoveNW = new Action("Move Northwest", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[5]);
        });
        var actionMoveN = new Action("Move North", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[6]);
        });
        var actionMoveNE = new Action("Move Northeast", (universe, world, place, actor) => {
            demoActions.actionMove_Perform(universe, world, place, actor, null, directions[7]);
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
            actionItem_DropSelected,
            actionItem_PickUp,
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
            actionInstances.ShowMenu,
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
    buildActivityDefns() {
        var activityDefnDoNothing = new ActivityDefn2("Do Nothing", (universe, world, place, actor, activity) => {
            // Do nothing.
        }, (universe, world, place, actor, activity) => {
            // Do nothing.
        });
        var activityDefnFlyForward = new ActivityDefn2("Fly Forward", (universe, world, place, actor, activity) => {
            // Do nothing.
        }, (universe, worldAsWorld, place, entityActorAsEntity, activity) => {
            var world = worldAsWorld;
            var entityActor = entityActorAsEntity;
            var actorLoc = entityActor.locatable().loc;
            //var map = place.map;
            var directionsToMove = actorLoc.orientation.forward.clone().directions(); // hack
            var headingToMove = Heading.fromCoords(directionsToMove);
            // hack
            var actionsMoves = world.defn2.actionMovesByHeading;
            var actionMoveInDirection = actionsMoves[headingToMove];
            entityActor.actorData().actions.push(actionMoveInDirection);
        });
        var activityDefnGenerateMovers = new ActivityDefn2("Generate Movers", (universe, world, place, actor, activity) => {
            // Do nothing.
        }, (universe, world, place, actor, activity) => {
            var moverGenerator = actor.moverGenerator();
            moverGenerator.activityPerform(universe, world, place, actor, activity);
        });
        var activityDefnMoveRandomly = new ActivityDefn2("Move Randomly", 
        // initialize
        (universe, world, place, actor, activity) => {
            // do nothing
        }, 
        // perform
        (universe, world, place, actor, activity) => {
            // hack
            var actionsMoves = world.defn2.actionMovesByHeading;
            var numberOfDirectionsAvailable = actionsMoves.length;
            var directionIndexRandom = Math.floor(numberOfDirectionsAvailable
                * this.randomizer.getNextRandom());
            var actionMoveInRandomDirection = actionsMoves[directionIndexRandom];
            actor.actorData().actions.push(actionMoveInRandomDirection);
        });
        var activityDefnMoveTowardPlayer = new ActivityDefn2("Move Toward Player", (universe, world, place, entityActorAsEntity, activity) => {
            var entityActor = entityActorAsEntity;
            entityActor.actorData().target = entityActor.locatable().loc.pos.clone();
        }, (universe, worldAsWorld, placeAsPlace, entityActorAsEntity, activity) => {
            var world = worldAsWorld;
            var place = placeAsPlace;
            var entityActor = entityActorAsEntity;
            var awaitables = place.awaitables();
            if (awaitables.length > 0) {
                return;
            }
            var mover = entityActor.mover();
            var costToTraverse = mover.movesPerTurn; // hack
            if (mover.movesThisTurn < costToTraverse) {
                return;
            }
            // mover.movesThisTurn -= costToTraverse;
            var players = place.players();
            if (players != null && players.length > 0) {
                var player = players[0];
                var actorPos = entityActor.locatable().loc.pos;
                var playerPos = player.locatable().loc.pos;
                var map = place.map;
                /*
                var sightHelper = world.sightHelper;
                var canActorSeePlayer = sightHelper.lineOfSightBetweenPointsOnMap
                (
                    actorPos, playerPos, map
                );
                */
                // hack
                var distance = playerPos.clone().subtract(actorPos).magnitude();
                var canActorSeePlayer = (distance <= 8);
                var actor = entityActor.actorData();
                var target = actor.target;
                if (canActorSeePlayer) {
                    target.overwriteWith(playerPos);
                }
                else if (target.equals(actorPos)) {
                    var zone = ArrayHelper.random(place.zones, universe.randomizer);
                    target.overwriteWith(zone.bounds.center).floor();
                }
                var path = new Route2(map, actorPos, playerPos, 256 // hack - lengthMax
                );
                path.calculate();
                var pathNodes = path.nodes;
                if (pathNodes.length < 2) {
                    return;
                }
                var pathNode1 = pathNodes[1];
                var directionsToPathNode1 = pathNode1.cellPos.clone().subtract(actorPos).directions();
                var headingToMove = Heading.fromCoords(directionsToPathNode1);
                // hack
                var actionsMoves = world.defn2.actionMovesByHeading;
                var actionMoveInDirection = actionsMoves[headingToMove];
                actor.actions.push(actionMoveInDirection);
            }
        });
        var activityDefnUserInputAccept = new ActivityDefn2("Accept User Input", 
        // initialize
        (universe, world, place, entityActor, activity) => {
            var mappings = [
                new ActionToInputsMapping("Attack with Melee Weapon", ["a"], null),
                new ActionToInputsMapping("Close Door", ["c"], null),
                new ActionToInputsMapping("Open Door", ["d"], null),
                new ActionToInputsMapping("Fire Projectile", ["f"], null),
                new ActionToInputsMapping("Pick Up Item", ["g"], null),
                new ActionToInputsMapping("Drop Selected Item", ["r"], null),
                new ActionToInputsMapping("Search", ["s"], null),
                new ActionToInputsMapping("Talk", ["t"], null),
                new ActionToInputsMapping("Use Emplacement", ["u"], null),
                new ActionToInputsMapping("Use Selected Item", ["y"], null),
                new ActionToInputsMapping("Move Southwest", ["_1"], null),
                new ActionToInputsMapping("Move South", ["_2"], null),
                new ActionToInputsMapping("Move Southeast", ["_3"], null),
                new ActionToInputsMapping("Move West", ["_4"], null),
                new ActionToInputsMapping("Move East", ["_6"], null),
                new ActionToInputsMapping("Move Northwest", ["_7"], null),
                new ActionToInputsMapping("Move North", ["_8"], null),
                new ActionToInputsMapping("Move Northeast", ["_9"], null),
                //new ActionToInputsMapping("ShowEquipment", [ "`" ], null),
                //new ActionToInputsMapping("ShowItems", [ "Tab" ], null),
                new ActionToInputsMapping("Select Next Item", ["]"], null),
                new ActionToInputsMapping("Select Previous Item", ["["], null),
                new ActionToInputsMapping("Wait", ["."], null),
                new ActionToInputsMapping("ShowMenu", ["Escape"], null),
            ];
            var mappingsByInputName = ArrayHelper.addLookups(mappings, (element) => element.inputNames[0]);
            activity.target = mappingsByInputName;
        }, (universe, worldAsWorld, placeAsPlace, entityActor, activity) => {
            var world = worldAsWorld;
            var place = placeAsPlace;
            var actor = entityActor;
            var awaitables = place.awaitables();
            if (awaitables.length > 0) {
                return;
            }
            var inputHelper = universe.inputHelper;
            var inputToActionMappings = activity.target;
            var inputsActive = inputHelper.inputsPressed;
            var actionsFromActor = actor.actorData().actions;
            for (var i = 0; i < inputsActive.length; i++) {
                var input = inputsActive[i];
                var inputMapping = inputToActionMappings.get(input.name);
                if (inputMapping != null) {
                    var actionName = inputMapping.actionName;
                    var action = world.defn2.actionsByName.get(actionName);
                    /*
                    var ticksToHold = 1; // hack

                    if (action.ticksSoFar <= ticksToHold)
                    {
                        actionsFromActor.push(action);
                    }
                    */ // todo
                    actionsFromActor.push(action);
                }
            }
        });
        var activityDefnUserInputDemo = new ActivityDefn2("Demo User Input", (universe, world, place, entityActor, activity) => {
            // do nothing
        }, (universe, worldAsWorld, placeAsPlace, entityActorAsEntity, activity) => {
            var world = worldAsWorld;
            var actor = entityActorAsEntity;
            var place = placeAsPlace;
            var actorMover = actor.mover();
            if (actorMover.movesThisTurn <= actorMover.movesPerTurn) {
                return;
            }
            var actorLoc = actor.locatable().loc;
            var actorPos = actorLoc.pos;
            var target = actor.actorData().target;
            if (target == null) {
                var itemsHeld = actor.itemHolder().itemEntities;
                var hasItemGoal = itemsHeld.some((x) => x.name == "Amulet of Yendor");
                var itemsOnLevel = place.items();
                var itemsNearby = itemsOnLevel.filter((x) => x.locatable().loc.pos.clone().subtract(actorPos).magnitude() < 4);
                var target = null;
                if (hasItemGoal) {
                    var emplacements = place.emplacements();
                    var stairsUp = emplacements.filter((x) => x.name == "StairsUp");
                    if (stairsUp.length > 0) {
                        target = stairsUp[0];
                    }
                    else {
                        var altar = emplacements.filter(x => x.name == "Altar")[0];
                        target = altar;
                    }
                }
                else if (itemsNearby.length > 0) {
                    target = itemsNearby[0];
                    actor.actorData().target = target;
                }
                else {
                    var emplacements = place.emplacements();
                    var stairsDown = emplacements.filter((x) => x.name == "StairsDownToNextLevel");
                    if (stairsDown.length == 0) {
                        target = itemsOnLevel.filter(x => x.name == "Amulet of Yendor")[0];
                    }
                    else {
                        var stairDown = stairsDown[0];
                        target = stairDown;
                    }
                }
            }
            var targetPos = target.locatable().loc.pos;
            var pathToTarget = new Route2(place.map, actorPos, targetPos, null);
            pathToTarget.calculate();
            var pathNodes = pathToTarget.nodes;
            var actionNext = null;
            var actionsAllByName = world.defn2.actionsByName;
            var pathToTargetLength = pathNodes.length;
            if (pathToTargetLength <= 1) {
                actor.actorData().target = null;
                if (target.item() != null) {
                    actionNext = actionsAllByName.get("Pick Up Item");
                }
                else {
                    actionNext = actionsAllByName.get("Use Emplacement");
                }
            }
            else {
                var pathNode1 = pathNodes[1];
                var directionsToPathNode1 = pathNode1.cellPos.clone().subtract(actor.locatable().loc.pos).directions();
                var heading = Heading.fromCoords(directionsToPathNode1);
                // hack
                var actionsMoves = world.defn2.actionMovesByHeading;
                var actionMoveInDirection = actionsMoves[heading];
                actionNext = actionMoveInDirection;
            }
            if (actionNext != null) {
                actor.actorData().actions.push(actionNext);
            }
        });
        var returnValues = [
            activityDefnDoNothing,
            activityDefnFlyForward,
            activityDefnGenerateMovers,
            activityDefnMoveRandomly,
            activityDefnMoveTowardPlayer,
            activityDefnUserInputAccept,
            activityDefnUserInputDemo
        ];
        //var returnValuesByName = ArrayHelper.addLookupsByName(returnValues);
        return returnValues; //ByName;
    }
}
