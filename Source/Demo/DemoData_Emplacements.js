"use strict";
class DemoData_Emplacements {
    constructor(parent) {
        this.parent = parent;
    }
    buildEntityDefnGroup(visualGetByName) {
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
        var drawableFromVisualName = (visualName) => Drawable.fromVisual(visualGetByName(visualName));
        var drawableInvisibleFromVisualName = (visualName) => new Drawable(visualGetByName(visualName), false);
        var trapProjectileCollide = (u, w, p, eColliding, eCollidedWith, itemProjectileDefnName) => {
            var placeLevel = p;
            var itemProjectile = new Item(itemProjectileDefnName, 1);
            var entityProjectile = itemProjectile.toEntity(u, w, p, eColliding);
            placeLevel.entitySpawn(u, w, entityProjectile);
            var chanceOfHitAsDiceRoll = DiceRoll.fromExpression("1d2");
            var randomizer = u.randomizer;
            var doesProjectileHit = (chanceOfHitAsDiceRoll.roll(randomizer) >= 2);
            var message = "";
            if (doesProjectileHit) {
                var killable = eColliding.killable();
                var damager = entityProjectile.damager();
                killable.damageApply(u, w, p, eCollidedWith, eColliding, damager.damagePerHit);
                if (player != null) {
                    message = "and hits";
                }
            }
            else {
                if (player != null) {
                    message = "but misses";
                }
            }
            var player = eColliding.player();
            if (player != null) {
                var messageLog = player.messageLog;
                message =
                    "An " + itemProjectileDefnName.toLowerCase()
                        + " shoots out " + message + " you!";
                messageLog.messageAdd(message);
            }
        };
        var entityDefns = [
            new Entity2("Altar", [
                mappableOpen,
                drawableFromVisualName("Altar"),
                Emplacement.fromAppearanceAndUse("altar", useEmplacementAltar),
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
                            visualGetByName("WallDungeonNorthSouth"),
                            visualGetByName("WallDungeonEastWest")
                        ], null)
                    ],
                    ["Closed", visualGetByName("DoorClosed")],
                    ["Open", visualGetByName("DoorOpenLeft")]
                ]), (u, w, p, entityAsEntity, display) => {
                    var entity = entityAsEntity;
                    return [(entity.searchable().isHidden ? "Hidden" : (entity.openable().isOpen ? "Open" : "Closed"))];
                }), true // isVisible
                ),
                Emplacement.fromAppearance("door"),
                new Openable(false, false),
                new Searchable(.25, // chance
                false, // isHidden
                null),
                generatable0
            ]),
            new Entity2("Gravestone", [
                mappableOpen,
                drawableFromVisualName("Gravestone"),
                Emplacement.fromAppearance("gravestone"),
                generatable1
            ]),
            new Entity2("Hole", [
                mappableOpen,
                generatable1,
                drawableFromVisualName("Hole"),
                Emplacement.fromAppearance("hole")
            ]),
            new Entity2("Sink", [
                mappableOpen,
                generatable1,
                drawableFromVisualName("Sink"),
                Emplacement.fromAppearance("sink")
            ]),
            new Entity2("StairsDown", [
                mappableDefns.Open,
                drawableFromVisualName("StairsDown"),
                Emplacement.fromAppearanceAndUse("stairway down", useEmplacementPortal),
                generatable0,
                Portal2.create()
            ]),
            new Entity2("StairsExit", [
                mappableDefns.Open,
                drawableFromVisualName("StairsUp"),
                Emplacement.fromAppearanceAndUse("stairway up", useEmplacementPortal),
                generatable0,
                Portal2.create()
            ]),
            new Entity2("StairsUp", [
                mappableDefns.Open,
                drawableFromVisualName("StairsUp"),
                Emplacement.fromAppearanceAndUse("stairway up", useEmplacementPortal),
                generatable0,
                Portal2.create()
            ]),
            new Entity2("Statue", [
                mappableOpen,
                drawableFromVisualName("Statue"),
                Emplacement.fromAppearance("statue"),
                generatable1
            ]),
            // Hidden until discovered.
            new Entity2("MagicPortal", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("MagicPortal"),
                searchableTrap,
                Emplacement.fromAppearance("magic portal")
            ]),
            new Entity2("Pit", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("Pit"),
                searchableTrap, Emplacement.fromAppearance("pit")
            ]),
            new Entity2("PitSpiked", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("PitSpiked"),
                searchableTrap,
                Emplacement.fromAppearance("spiked pit")
            ]),
            new Entity2("TeleporterShort", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TeleporterShort"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("short-range teleporter", (u, w, p, eColliding, eCollidedWith) => {
                    var placeLevel = p;
                    var zones = placeLevel.zones;
                    var randomizer = u.randomizer;
                    var zoneToTeleportTo = ArrayHelper.random(zones, randomizer);
                    var posToTeleportTo = zoneToTeleportTo.bounds.posRandom(randomizer).floor();
                    eColliding.locatable().loc.pos.overwriteWith(posToTeleportTo);
                })
            ]),
            new Entity2("TeleporterLong", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TeleporterLong"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("long-range teleporter", (u, w, p, eColliding, eCollidedWith) => {
                    var placeCurrent = p;
                    var placeCurrentIndex = w.places.indexOf(placeCurrent);
                    var randomizer = u.randomizer;
                    var placeIndexOffsetMax = 2;
                    var placeIndexOffset = Math.floor(randomizer.getNextRandom()) * placeIndexOffsetMax;
                    var plusOrMinus = ((randomizer.getNextRandom() > .5) ? 1 : -1);
                    placeIndexOffset *= plusOrMinus;
                    var placeToTeleportToIndex = placeCurrentIndex + placeIndexOffset;
                    var places = w.places;
                    var placeToTeleportTo = places[placeToTeleportToIndex];
                    var zones = placeCurrent.zones;
                    var zoneToTeleportTo = ArrayHelper.random(zones, randomizer);
                    var posToTeleportTo = zoneToTeleportTo.bounds.posRandom(randomizer).floor();
                    var eCollidingLoc = eColliding.locatable().loc;
                    eCollidingLoc.placeName = placeToTeleportTo.name;
                    eCollidingLoc.pos.overwriteWith(posToTeleportTo);
                })
            ]),
            new Entity2("TrapAlarm", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapAlarm"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("alarm trap", (u, w, p, eColliding, eCollidedWith) => {
                    var placeLevel = p;
                    var movers = placeLevel.movers();
                    movers.forEach(mover => {
                        // todo - Target the trap.
                    });
                })
            ]),
            new Entity2("TrapArrow", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapArrow"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("arrow trap", (u, w, p, eColliding, eCollidedWith) => {
                    trapProjectileCollide(u, w, p, eColliding, eCollidedWith, "Arrow");
                })
            ]),
            new Entity2("TrapBoulder", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapBoulder"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("boulder trap", (u, w, p, eColliding, eCollidedWith) => {
                    trapProjectileCollide(u, w, p, eColliding, eCollidedWith, "Boulder");
                })
            ]),
            new Entity2("TrapDart", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapDart"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("dart trap", (u, w, p, eColliding, eCollidedWith) => {
                    trapProjectileCollide(u, w, p, eColliding, eCollidedWith, "Dart");
                })
            ]),
            new Entity2("TrapDeadfall", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapDeadfall"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("deadfall", (u, w, p, eColliding, eCollidedWith) => {
                    trapProjectileCollide(u, w, p, eColliding, eCollidedWith, "Rock");
                })
            ]),
            new Entity2("TrapDoor", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapDoor"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("trap door", (u, w, p, eColliding, eCollidedWith) => {
                    var placeCurrent = p;
                    var placeCurrentIndex = w.places.indexOf(placeCurrent);
                    var randomizer = u.randomizer;
                    var placeIndexOffsetMax = 3;
                    var placeIndexOffset = 1 + Math.floor(randomizer.getNextRandom() * placeIndexOffsetMax);
                    var placeToDropToIndex = placeCurrentIndex + placeIndexOffset;
                    var places = w.places;
                    var placeToDropTo = places[placeToDropToIndex];
                    var zones = placeToDropTo.zones;
                    var zoneToDropTo = ArrayHelper.random(zones, randomizer);
                    var posToDropTo = zoneToDropTo.bounds.posRandom(randomizer).floor();
                    eColliding.locatable().loc.pos.overwriteWith(posToDropTo);
                })
            ]),
            new Entity2("TrapDrain", [
                mappableOpen,
                generatable1,
                drawableInvisibleFromVisualName("TrapDrain"),
                searchableTrap,
                Emplacement.fromAppearance("drain trap")
            ]),
            new Entity2("TrapHex", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapHex"),
                searchableTrap,
                Emplacement.fromAppearance("hex trap")
            ]),
            new Entity2("TrapJaws", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapJaws"),
                searchableTrap,
                Emplacement.fromAppearance("bear trap")
            ]),
            new Entity2("TrapMine", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapMine"),
                searchableTrap,
                Emplacement.fromAppearance("landmine")
            ]),
            new Entity2("TrapPolymorph", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapPolymorph"),
                searchableTrap,
                Emplacement.fromAppearance("polymorph trap")
            ]),
            new Entity2("TrapSleep", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapSleep"),
                searchableTrap,
                Emplacement.fromAppearance("sleeping gas trap")
            ]),
            new Entity2("TrapWater", [
                mappableOpen,
                generatable1,
                drawableInvisibleFromVisualName("TrapWater"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("flood trap", (u, w, p, eColliding, eCollidedWith) => {
                    var equipmentUser = eColliding.equipmentUser();
                    var sockets = equipmentUser.socketGroup.sockets;
                    var randomizer = u.randomizer;
                    var socketToAttack = ArrayHelper.random(sockets, randomizer);
                    var player = eColliding.player();
                    if (player != null) {
                        var message = "Acid pours onto your " + socketToAttack.defnName + "!";
                        var messageLog = player.messageLog;
                        // todo - Corrode.
                        messageLog.messageAdd(message);
                    }
                })
            ]),
            new Entity2("TrapFire", [
                mappableOpen, generatable1,
                drawableInvisibleFromVisualName("TrapFire"),
                searchableTrap,
                Emplacement.fromAppearanceAndCollide("fire trap", (u, w, p, eColliding, eCollidedWith) => {
                    var equipmentUser = eColliding.equipmentUser();
                    var sockets = equipmentUser.socketGroup.sockets;
                    var socketToAttack = sockets.filter(x => x.defnName == "Feet")[0];
                    var player = eColliding.player();
                    if (player != null) {
                        var message = "Fire bursts out at your feet!";
                        socketToAttack.unequip();
                        var messageLog = player.messageLog;
                        // todo - Burn.
                        messageLog.messageAdd(message);
                    }
                })
            ]),
            new Entity2("Web", [
                mappableOpen,
                generatable1,
                drawableFromVisualName("Web"),
                Emplacement.fromAppearance("web")
            ]),
        ];
        var returnValue = new EntityDefnGroup("Emplacements", 1, // relativeFrequency
        entityDefns);
        return returnValue;
    }
}
