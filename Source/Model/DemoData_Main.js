"use strict";
class DemoData_Main {
    constructor(randomizer) {
        this.randomizer = randomizer;
        this.imageBuilder = new ImageBuilder(Color.Instances()._All);
        this.demoDataActions = new DemoData_Actions(this);
        this.demoDataItems = new DemoData_Items(this);
        this.demoDataMovers = new DemoData_Movers(this);
        this.demoDataPlaces = new DemoData_Places(this);
        this.demoDataVisuals = new DemoData_Visuals(this);
    }
    buildEntityDefnGroups(universe, visualsByName, activityDefns, itemCategories) {
        // entityDefns
        var emplacements = this.buildEntityDefnGroups_Emplacements(visualsByName);
        var talkers = this.buildEntityDefnGroups_Talkers(visualsByName);
        var itemGroups = this.demoDataItems.buildEntityDefnGroups_Items(universe, visualsByName, itemCategories);
        var moverAndCorpseGroups = this.demoDataMovers.buildEntityDefnGroups_MoversAndCorpses(visualsByName, activityDefns, itemCategories);
        var moverGroups = moverAndCorpseGroups[0];
        var corpseGroup = moverAndCorpseGroups[1];
        //var moverEntities = moverGroups[0].entityDefns;
        itemGroups.push(corpseGroup);
        var returnValues = ArrayHelper.concatenateAll([
            [emplacements],
            [talkers],
            itemGroups,
            moverGroups
        ]);
        return returnValues;
    }
    buildEntityDefnGroups_Emplacements(visuals) {
        var useEmplacementAltar = (universe, world, place, entityUsingAsEntity, entityUsed) => {
            var entityUsing = entityUsingAsEntity;
            var itemsHeld = entityUsing.itemHolder().items;
            var isItemGoalHeld = itemsHeld.some((x) => x.defnName == "Amulet of Yendor");
            var messageLog = entityUsing.player().messageLog;
            if (isItemGoalHeld == false) {
                var message = "You do not have the Amulet of Yendor!";
                messageLog.messageAdd(message);
                var message = "You are punished with death.";
                messageLog.messageAdd(message);
                var venueMessage = new VenueMessage(DataBinding.fromContext("You lose!"), (universe) => // acknowledge
                 {
                    universe.venueNext = new VenueFader(new VenueControls(universe.controlBuilder.title(universe, null), null // ignoreInputs
                    ), null, null, null);
                }, universe.venueCurrent, // venuePrev
                universe.display.sizeDefault().clone().half(), null // showMessageOnly
                );
                universe.venueNext = venueMessage;
            }
            else {
                var message = "You sacrifice the Amulet of Yendor,";
                messageLog.messageAdd(message);
                message = "and are rewarded with eternal life.";
                messageLog.messageAdd(message);
                var venueMessage = new VenueMessage(DataBinding.fromContext("You win!"), (universe) => // acknowledge
                 {
                    universe.venueNext = new VenueFader(new VenueControls(universe.controlBuilder.title(universe, null), null // ignoreInputs
                    ), null, null, null);
                }, universe.venueCurrent, // venuePrev
                universe.display.sizeDefault().clone().half(), null // showMessageOnly
                );
                universe.venueNext = venueMessage;
            }
        };
        var useEmplacementPortal = (universe, world, place, entityUsingAsEntity, entityUsedAsEntity) => {
            var entityUsing = entityUsingAsEntity;
            var entityUsed = entityUsedAsEntity;
            var message = "You use the " + entityUsed.emplacement().appearance + ".";
            entityUsing.player().messageLog.messageAdd(message);
            var portal = entityUsed.portal2();
            portal.use(universe, world, place, entityUsing, entityUsed);
        };
        var mappableDefns = MappableDefn.Instances();
        var mappableOpen = mappableDefns.Open;
        var generatable0 = new Generatable(0);
        var generatable1 = new Generatable(1);
        var searchableTrap = new Searchable(.25, null, null);
        var isVisibleTrue = true;
        var entityDefns = [
            new Entity2("Altar", [
                mappableOpen,
                new Drawable(visuals.get("Altar"), true),
                new Emplacement("altar", useEmplacementAltar),
                generatable1
            ]),
            new Entity2("Door", [
                new MappableDefn((entity) => // blocksMovement
                 (entity.openable().isOpen == false), (entity) => // blocksVision
                 (entity.openable().isOpen == false)),
                new Drawable(new VisualSelect(new Map([
                    [
                        "Hidden",
                        new VisualDirectional(null, [
                            visuals.get("WallDungeonNorthSouth"),
                            visuals.get("WallDungeonEastWest")
                        ], null)
                    ],
                    ["Closed", visuals.get("DoorClosed")],
                    ["Open", visuals.get("DoorOpenLeft")]
                ]), (universe, world, place, entityAsEntity, display) => {
                    var entity = entityAsEntity;
                    return [(entity.searchable().isHidden ? "Hidden" : (entity.openable().isOpen ? "Open" : "Closed"))];
                }), true // isVisible
                ),
                new Emplacement("door", null),
                new Openable(false, false),
                new Searchable(.25, // chance
                false, // isHidden
                null),
                generatable0
            ]),
            new Entity2("Gravestone", [
                mappableOpen,
                new Drawable(visuals.get("Gravestone"), null),
                new Emplacement("gravestone", null),
                generatable1
            ]),
            new Entity2("Hole", [mappableOpen, generatable1, new Drawable(visuals.get("Hole"), isVisibleTrue), new Emplacement("hole", null)]),
            new Entity2("Sink", [mappableOpen, generatable1, new Drawable(visuals.get("Sink"), isVisibleTrue), new Emplacement("sink", null)]),
            new Entity2("StairsDown", [
                mappableDefns.Open,
                new Drawable(visuals.get("StairsDown"), null),
                new Emplacement("stairway down", useEmplacementPortal),
                generatable0
            ]),
            new Entity2("StairsExit", [
                mappableDefns.Open,
                new Drawable(visuals.get("StairsUp"), null),
                new Emplacement("stairway up", useEmplacementPortal),
                generatable0
            ]),
            new Entity2("StairsUp", [
                mappableDefns.Open,
                new Drawable(visuals.get("StairsUp"), null),
                new Emplacement("stairway up", useEmplacementPortal),
                generatable0
            ]),
            // Hidden until discovered.
            new Entity2("MagicPortal", [mappableOpen, generatable1, new Drawable(visuals.get("MagicPortal"), false), searchableTrap, new Emplacement("magic portal", null),]),
            new Entity2("Pit", [mappableOpen, generatable1, new Drawable(visuals.get("Pit"), false), searchableTrap, new Emplacement("pit", null),]),
            new Entity2("PitSpiked", [mappableOpen, generatable1, new Drawable(visuals.get("PitSpiked"), false), searchableTrap, new Emplacement("spiked pit", null),]),
            new Entity2("TeleporterShort", [mappableOpen, generatable1, new Drawable(visuals.get("TeleporterShort"), false), searchableTrap, new Emplacement("short-range teleporter", null),]),
            new Entity2("TeleporterLong", [mappableOpen, generatable1, new Drawable(visuals.get("TeleporterLong"), false), searchableTrap, new Emplacement("long-range teleporter", null),]),
            new Entity2("TrapAlarm", [mappableOpen, generatable1, new Drawable(visuals.get("TrapAlarm"), false), searchableTrap, new Emplacement("alarm trap", null),]),
            new Entity2("TrapArrow", [mappableOpen, generatable1, new Drawable(visuals.get("TrapArrow"), false), searchableTrap, new Emplacement("arrow trap", null),]),
            new Entity2("TrapBoulder", [mappableOpen, generatable1, new Drawable(visuals.get("TrapBoulder"), false), searchableTrap, new Emplacement("boulder trap", null),]),
            new Entity2("TrapDart", [mappableOpen, generatable1, new Drawable(visuals.get("TrapDart"), false), searchableTrap, new Emplacement("dart trap", null),]),
            new Entity2("TrapDeadfall", [mappableOpen, generatable1, new Drawable(visuals.get("TrapDeadfall"), false), searchableTrap, new Emplacement("deadfall", null),]),
            new Entity2("TrapDoor", [mappableOpen, generatable1, new Drawable(visuals.get("TrapDoor"), false), searchableTrap, new Emplacement("trap door", null),]),
            new Entity2("TrapDrain", [mappableOpen, generatable1, new Drawable(visuals.get("TrapDrain"), false), searchableTrap, new Emplacement("drain trap", null),]),
            new Entity2("TrapHex", [mappableOpen, generatable1, new Drawable(visuals.get("TrapHex"), false), searchableTrap, new Emplacement("hex trap", null),]),
            new Entity2("TrapJaws", [mappableOpen, generatable1, new Drawable(visuals.get("TrapJaws"), false), searchableTrap, new Emplacement("bear trap", null),]),
            new Entity2("TrapMine", [mappableOpen, generatable1, new Drawable(visuals.get("TrapMine"), false), searchableTrap, new Emplacement("landmine", null),]),
            new Entity2("TrapPolymorph", [mappableOpen, generatable1, new Drawable(visuals.get("TrapPolymorph"), false), searchableTrap, new Emplacement("polymorph trap", null),]),
            new Entity2("TrapSleep", [mappableOpen, generatable1, new Drawable(visuals.get("TrapSleep"), false), searchableTrap, new Emplacement("sleeping gas trap", null),]),
            new Entity2("TrapWater", [mappableOpen, generatable1, new Drawable(visuals.get("TrapWater"), false), searchableTrap, new Emplacement("flood trap", null),]),
            new Entity2("TrapFire", [mappableOpen, generatable1, new Drawable(visuals.get("TrapFire"), false), searchableTrap, new Emplacement("fire trap", null),]),
            new Entity2("Web", [mappableOpen, generatable1, new Drawable(visuals.get("Web"), isVisibleTrue), new Emplacement("web", null),]),
        ];
        var returnValue = new EntityDefnGroup("Emplacements", 1, // relativeFrequency
        entityDefns);
        return returnValue;
    }
    buildEntityDefnGroups_Talkers(visuals) {
        var mappableDefns = MappableDefn.Instances();
        var mappableBlocking = mappableDefns.Blocking;
        var isVisibleTrue = true;
        var entityDefns = [
            new Entity2("Mentor", [
                mappableBlocking,
                new Drawable(visuals.get("Aligned Priest"), isVisibleTrue),
                new ItemHolder([
                    new Item("Coins", 5)
                ], // itemEntities
                100, // massMax
                0 // reachRadius
                ),
                new Talker("Talk_Mentor"),
                new Generatable(0)
            ])
        ];
        var returnValue = new EntityDefnGroup("Talkers", 0, // relativeFrequency
        entityDefns);
        return returnValue;
    }
    buildWorldDefn(universe, visualsForTiles) {
        var visualsOpaque = this.demoDataVisuals.buildVisualLookup(visualsForTiles);
        var actionsAndActionMovesByHeading = this.demoDataActions.actionsBuild();
        var actions = actionsAndActionMovesByHeading[0];
        var actionMovesByHeading = actionsAndActionMovesByHeading[1];
        var activityDefns = this.demoDataActions.buildActivityDefns();
        var activityDefnsByName = ArrayHelper.addLookupsByName(activityDefns);
        var itemCategories = this.demoDataItems.buildItemCategories();
        var entityDefnGroups = this.buildEntityDefnGroups(universe, visualsOpaque, activityDefnsByName, itemCategories);
        var spells = Spell.Instances()._All;
        var placeDefns = this.demoDataPlaces.buildPlaceDefns(visualsOpaque, actions);
        var placeTree = this.demoDataPlaces.buildPlaceTree();
        var randomizer = this.randomizer;
        var returnValue = new WorldDefn2("WorldDefn0", actions, actionMovesByHeading, activityDefns, itemCategories, entityDefnGroups, spells, placeDefns, placeTree, (worldDefn) => // buildPlaces
         {
            var returnValues = placeTree.buildPlaces(worldDefn, randomizer, 0 // depthFirst
            );
            return returnValues;
        });
        return returnValue;
    }
}
