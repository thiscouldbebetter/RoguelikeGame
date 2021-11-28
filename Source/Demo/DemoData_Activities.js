"use strict";
class DemoData_Activities {
    constructor(parent, randomizer) {
        this.parent = parent;
        this.randomizer = randomizer;
    }
    buildActivityDefns() {
        var activityDefnDoNothing = new ActivityDefn("Do Nothing", (uwpe) => {
            // Do nothing.
        });
        var activityDefnFlyForward = new ActivityDefn("Fly Forward", (uwpe) => // perform
         {
            var world = uwpe.world;
            var entityActor = uwpe.entity;
            var actorLoc = entityActor.locatable().loc;
            //var map = place.map;
            var directionsToMove = actorLoc.orientation.forward.clone().directions(); // hack
            var headingToMove = Heading.fromCoords(directionsToMove);
            // hack
            var actionsMoves = world.defn2.actionMovesByHeading;
            var actionMoveInDirection = actionsMoves[headingToMove];
            var actorData = entityActor.actorData();
            actorData.actionAdd(actionMoveInDirection);
        });
        var activityDefnGenerateMovers = new ActivityDefn("Generate Movers", (uwpe) => {
            var moverGenerator = uwpe.entity.moverGenerator();
            moverGenerator.activityPerform(uwpe);
        });
        var activityDefnMoveRandomly = new ActivityDefn("Move Randomly", 
        // perform
        (uwpe) => {
            // hack
            var actionsMoves = uwpe.world.defn2.actionMovesByHeading;
            var numberOfDirectionsAvailable = actionsMoves.length;
            var directionIndexRandom = Math.floor(numberOfDirectionsAvailable
                * this.randomizer.getNextRandom());
            var actionMoveInRandomDirection = actionsMoves[directionIndexRandom];
            uwpe.entity.actorData().actionAdd(actionMoveInRandomDirection);
        });
        var activityDefnMoveTowardPlayer = new ActivityDefn("Move Toward Player", (uwpe) => // perform
         {
            var world = uwpe.world;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var actorData = entityActor.actorData();
            var activity = actorData.activity();
            var isInitialized = activity.targetEntityByName("IsInitialized");
            if (isInitialized == null) {
                activity.targetEntitySetByName("IsInitialized", EntityPropertyFromValue.entityFromValue(true));
                var entityActor = uwpe.entity;
                entityActor.actorData().target =
                    entityActor.locatable().loc.pos.clone();
            }
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
                var target = actorData.target;
                if (canActorSeePlayer) {
                    target.overwriteWith(playerPos);
                }
                else if (target.equals(actorPos)) {
                    var zone = ArrayHelper.random(place.zones, uwpe.universe.randomizer);
                    target.overwriteWith(zone.bounds.center).floor();
                }
                var path = new Route2(map, actorPos, playerPos, 256, // hack - lengthMax
                mover);
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
                actorData.actionAdd(actionMoveInDirection);
            }
        });
        var activityDefnUserInputAccept = new ActivityDefn("Accept User Input", (uwpe) => {
            var world = uwpe.world;
            var place = uwpe.place;
            var entityActorAsEntity2 = uwpe.entity;
            var actorData = entityActorAsEntity2.actorData();
            var activity = actorData.activity();
            var isInitialized = activity.targetEntityByName("IsInitialized");
            if (isInitialized == null) {
                activity.targetEntitySetByName("IsInitialized", EntityPropertyFromValue.entityFromValue(true));
                var inactivate = true;
                var mappings = [
                    new ActionToInputsMapping("Attack with Melee Weapon", ["Enter"], inactivate),
                    new ActionToInputsMapping("Close Door", ["l"], inactivate),
                    new ActionToInputsMapping("Open Door", ["o"], inactivate),
                    new ActionToInputsMapping("Fire Projectile", ["'"], inactivate),
                    new ActionToInputsMapping("Pick Up Item", ["g"], inactivate),
                    new ActionToInputsMapping("Drop Selected Item", ["r"], inactivate),
                    new ActionToInputsMapping("Search", ["h"], inactivate),
                    new ActionToInputsMapping("Talk", ["t"], inactivate),
                    new ActionToInputsMapping("Use Emplacement", ["u"], inactivate),
                    new ActionToInputsMapping("Use Selected Item", ["y"], inactivate),
                    new ActionToInputsMapping("Move Southwest", ["z", "1"], false),
                    new ActionToInputsMapping("Move South", ["x", "2"], false),
                    new ActionToInputsMapping("Move Southeast", ["c", "3"], false),
                    new ActionToInputsMapping("Move West", ["a", "4"], false),
                    new ActionToInputsMapping("Move East", ["d", "6"], false),
                    new ActionToInputsMapping("Move Northwest", ["q", "7"], false),
                    new ActionToInputsMapping("Move North", ["w", "8"], false),
                    new ActionToInputsMapping("Move Northeast", ["e", "9"], false),
                    //new ActionToInputsMapping("ShowEquipment", [ "`" ], null),
                    //new ActionToInputsMapping("ShowItems", [ "Tab" ], null),
                    new ActionToInputsMapping("Select Next Item", ["]"], inactivate),
                    new ActionToInputsMapping("Select Previous Item", ["["], inactivate),
                    new ActionToInputsMapping("Wait", ["."], inactivate),
                    new ActionToInputsMapping("ShowMenuPlayer", ["Escape"], inactivate),
                ];
                var mappingsByInputName = ArrayHelper.addLookupsMultiple(mappings, (element) => element.inputNames);
                var propertyAsEntity = EntityPropertyFromValue.entityFromValue(mappingsByInputName);
                activity.targetEntitySet(propertyAsEntity);
            }
            var awaitables = place.awaitables();
            if (awaitables.length > 0) {
                return;
            }
            var universe = uwpe.universe;
            var inputHelper = universe.inputHelper;
            var activity = actorData.activity();
            var propertyMappings = activity.targetEntity().properties[0];
            var inputToActionMappings = propertyMappings.value;
            var inputsActive = inputHelper.inputsPressed;
            var actionsFromActor = actorData.actions;
            for (var i = 0; i < inputsActive.length; i++) {
                var input = inputsActive[i];
                var inputMapping = inputToActionMappings.get(input.name);
                if (inputMapping != null) {
                    var actionName = inputMapping.actionName;
                    var worldDefn = world.defn2;
                    var action = worldDefn.actionsByName.get(actionName);
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
        var activityDefnUserInputDemo = new ActivityDefn("Demo User Input", (uwpe) => {
            var world = uwpe.world;
            var actor = uwpe.entity;
            var place = uwpe.place;
            var actorMover = actor.mover();
            if (actorMover.movesThisTurn <= actorMover.movesPerTurn) {
                return;
            }
            var actorLoc = actor.locatable().loc;
            var actorPos = actorLoc.pos;
            var target = actor.actorData().target;
            if (target == null) {
                var itemsHeld = actor.itemHolder().items;
                var hasItemGoal = itemsHeld.some((x) => x.defnName == "Amulet of Yendor");
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
            var pathToTarget = new Route2(place.map, actorPos, targetPos, null, actorMover);
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
                actor.actorData().actionAdd(actionNext);
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
        return returnValues;
    }
}
