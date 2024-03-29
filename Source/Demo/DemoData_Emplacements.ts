
class DemoData_Emplacements
{
	parent: DemoData_Main;

	constructor(parent: DemoData_Main)
	{
		this.parent = parent;
	}

	buildEntityDefnGroup(visualGetByName: (visualName: string) => VisualBase): EntityDefnGroup
	{
		var useEmplacementAltar = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityUsing = uwpe.entity as Entity2;

			var itemsHeld = entityUsing.itemHolder().items;
			var isItemGoalHeld = itemsHeld.some
			(
				(x: Item) => x.defnName == "Amulet of Yendor"
			);
			var messageLog = entityUsing.player().messageLog;
			if (isItemGoalHeld == false)
			{
				var message = "You do not have the Amulet of Yendor!"
				messageLog.messageAdd(message);
				var message = "You are punished with death."
				messageLog.messageAdd(message);

				var venueMessage = new VenueMessage
				(
					DataBinding.fromContext("You lose!"),
					() => // acknowledge
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls
							(
								universe.controlBuilder.title(universe, null),
								null // ignoreInputs
							),
							null, null, null
						);
					},
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half(),
					null // showMessageOnly
				);
				universe.venueNext = venueMessage;

			}
			else
			{
				var message = "You sacrifice the Amulet of Yendor,"
				messageLog.messageAdd(message);
				message = "and are rewarded with eternal life."
				messageLog.messageAdd(message);

				var venueMessage = new VenueMessage
				(
					DataBinding.fromContext("You win!"),
					() => // acknowledge
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls
							(
								universe.controlBuilder.title(universe, null),
								null // ignoreInputs
							),
							null, null, null
						);
					},
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half(),
					null // showMessageOnly
				);
				universe.venueNext = venueMessage;

			}
		}

		var useEmplacementPortal = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var entityUsing = uwpe.entity as Entity2;
			var entityUsed = uwpe.entity2 as Entity2;

			var message = "You use the " + entityUsed.emplacement().appearance + ".";
			entityUsing.player().messageLog.messageAdd(message);
			var portal = entityUsed.portal2();
			portal.use(uwpe);
		};

		var mappableDefns = MappableDefn.Instances();
		var mappableOpen = mappableDefns.Open;
		var generatable0 = new Generatable(0);
		var generatable1 = new Generatable(1);
		var searchableTrap = new Searchable(.25, null, null);

		var drawableFromVisualName =
			(visualName: string) => Drawable.fromVisual(visualGetByName(visualName));

		var drawableInvisibleFromVisualName =
			(visualName: string) => new Drawable(visualGetByName(visualName), false);

		var trapProjectileCollide =
			(
				uwpe: UniverseWorldPlaceEntities, itemProjectileDefnName: string
			) =>
			{
				var universe = uwpe.universe;
				var placeLevel = uwpe.place as PlaceLevel;
				var entityColliding = uwpe.entity;
				var entityCollidedWith = uwpe.entity2 as Entity2;

				var itemProjectile = new Item(itemProjectileDefnName, 1);
				var entityProjectile = itemProjectile.toEntity(uwpe);
				placeLevel.entitySpawn(uwpe.clone().entitySet(entityProjectile));

				var chanceOfHitAsDiceRoll = DiceRoll.fromExpression("1d2");
				var randomizer = universe.randomizer;
				var doesProjectileHit =
					(chanceOfHitAsDiceRoll.roll(randomizer) >= 2);
				var message = "";
				if (doesProjectileHit)
				{
					var killable = entityColliding.killable();
					var damager = entityProjectile.damager();
					killable.damageApply
					(
						uwpe, damager.damagePerHit
					);

					if (player != null)
					{
						message = "and hits";
					}
				}
				else
				{
					if (player != null)
					{
						message = "but misses";
					}
				}

				var player = entityCollidedWith.player();
				if (player != null)
				{
					var messageLog = player.messageLog;
					message =
						"An " + itemProjectileDefnName.toLowerCase()
						+ " shoots out " + message + " you!";
					messageLog.messageAdd(message);
				}
			};

		var entityDefns =
		[
			new Entity2
			(
				"Altar",
				[
					mappableOpen,
					drawableFromVisualName("Altar"),
					Emplacement.fromAppearanceAndUse("altar", useEmplacementAltar),
					generatable1
				]
			),

			new Entity2
			(
				"Door",
				[
					new MappableDefn
					(
						(entity: Entity2) => // blocksMovement
							(entity.openable().isOpen == false),
						(entity: Entity2) => // blocksVision
							(entity.openable().isOpen == false)
					),
					new Drawable
					(
						new VisualSelect
						(
							new Map<string, VisualBase>
							([
								[ 
									"Hidden",
									new VisualDirectional
									(
										null,
										[
											visualGetByName("WallDungeonNorthSouth"),
											visualGetByName("WallDungeonEastWest")
										],
										null
									)
								],
								[ "Closed", visualGetByName("DoorClosed") ],
								[ "Open", visualGetByName("DoorOpenLeft") ]
							]),
							(uwpe: UniverseWorldPlaceEntities, display: Display) =>
							{
								var entity = uwpe.entity as Entity2;
								var returnValue =
								[
									(
										entity.searchable().isHidden
										? "Hidden"
										: (entity.openable().isOpen ? "Open" : "Closed")
									)
								];
								return returnValue;
							}
						),
						true // isVisible
					),
					Emplacement.fromAppearance("door"),
					new Openable(false, false),
					new Searchable
					(
						.25, // chance
						false, // isHidden
						null
					),
					generatable0
				]
			),

			new Entity2
			(
				"Gravestone",
				[
					mappableOpen,
					drawableFromVisualName("Gravestone"),
					Emplacement.fromAppearance("gravestone"),
					generatable1
				]
			),

			new Entity2
			(
				"Hole",
				[
					mappableOpen,
					generatable1,
					drawableFromVisualName("Hole"),
					Emplacement.fromAppearance("hole")
				]
			),
			new Entity2
			(
				"Sink", 
				[
					mappableOpen,
					generatable1,
					drawableFromVisualName("Sink"),
					Emplacement.fromAppearance("sink")
				]
			),

			new Entity2
			(
				"StairsDown",
				[
					mappableDefns.Open,
					drawableFromVisualName("StairsDown"),
					Emplacement.fromAppearanceAndUse("stairway down", useEmplacementPortal),
					generatable0,
					Portal2.create()
				]
			),

			new Entity2
			(
				"StairsExit",
				[
					mappableDefns.Open,
					drawableFromVisualName("StairsUp"),
					Emplacement.fromAppearanceAndUse("stairway up", useEmplacementPortal),
					generatable0,
					Portal2.create()
				]
			),

			new Entity2
			(
				"StairsUp",
				[
					mappableDefns.Open,
					drawableFromVisualName("StairsUp"),
					Emplacement.fromAppearanceAndUse("stairway up", useEmplacementPortal),
					generatable0,
					Portal2.create()
				]
			),

			new Entity2
			(
				"Statue",
				[
					mappableOpen,
					drawableFromVisualName("Statue"),
					Emplacement.fromAppearance("statue"),
					generatable1
				]
			),

			// Hidden until discovered.
			new Entity2
			(
				"MagicPortal",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("MagicPortal"),
					searchableTrap,
					Emplacement.fromAppearance("magic portal")
				]
			),

			new Entity2
			(
				"Pit",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("Pit"), 
					searchableTrap, Emplacement.fromAppearance("pit")
				]
			),

			new Entity2
			(
				"PitSpiked",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("PitSpiked"),
					searchableTrap,
					Emplacement.fromAppearance("spiked pit")
				]
			),

			new Entity2
			(
				"TeleporterShort",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("TeleporterShort"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"short-range teleporter",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var universe = uwpe.universe;
							var placeLevel = uwpe.place as PlaceLevel;
							var entityColliding = uwpe.entity;

							var zones = placeLevel.zones;
							var randomizer = universe.randomizer;
							var zoneToTeleportTo =
								ArrayHelper.random(zones, randomizer);
							var posToTeleportTo =
								zoneToTeleportTo.bounds.pointRandom(randomizer).floor();
							entityColliding.locatable().loc.pos.overwriteWith(posToTeleportTo);
						}
					)
				]
			),

			new Entity2
			(
				"TeleporterLong",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("TeleporterLong"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"long-range teleporter", // appearance
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var universe = uwpe.universe;
							var world = uwpe.world;
							var placeCurrent = uwpe.place as PlaceLevel;
							var entityColliding = uwpe.entity;

							var placeCurrentIndex = world.places.indexOf(placeCurrent);
							var randomizer = universe.randomizer;
							var placeIndexOffsetMax = 2;
							var placeIndexOffset = Math.floor
							(
								randomizer.getNextRandom()
							) * placeIndexOffsetMax;
							var plusOrMinus =
							(
								(randomizer.getNextRandom() > .5) ? 1 : -1
							);
							placeIndexOffset *= plusOrMinus;
							var placeToTeleportToIndex =
								placeCurrentIndex + placeIndexOffset;
							var places = world.places;
							var placeToTeleportTo = places[placeToTeleportToIndex];
							var zones = placeCurrent.zones;
							var zoneToTeleportTo = ArrayHelper.random(zones, randomizer);
							var posToTeleportTo =
								zoneToTeleportTo.bounds.pointRandom(randomizer).floor();
							var entityCollidingLoc = entityColliding.locatable().loc;
							entityCollidingLoc.placeName = placeToTeleportTo.name;
							entityCollidingLoc.pos.overwriteWith(posToTeleportTo);
						}
					)
				]
			),

			new Entity2
			(
				"TrapAlarm",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapAlarm"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"alarm trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var placeLevel = uwpe.place as PlaceLevel;

							var movers = placeLevel.movers();
							movers.forEach(mover =>
							{
								// todo - Target the trap.
							});
						}
					)
				]
			),
			new Entity2
			(
				"TrapArrow",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapArrow"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"arrow trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							trapProjectileCollide(uwpe, "Arrow");
						}
					)
				]
			),

			new Entity2
			(
				"TrapBoulder", 
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapBoulder"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"boulder trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							trapProjectileCollide(uwpe, "Boulder");
						}
					)
				]
			),

			new Entity2
			(
				"TrapDart",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapDart"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"dart trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							trapProjectileCollide(uwpe, "Dart");
						}
					)
				]
			),

			new Entity2
			(
				"TrapDeadfall",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapDeadfall"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"deadfall",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							trapProjectileCollide(uwpe, "Rock");
						}
					)
				]
			),

			new Entity2
			(
				"TrapDoor",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapDoor"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"trap door",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var universe = uwpe.universe;
							var world = uwpe.world;
							var placeCurrent = uwpe.place;
							var eColliding = uwpe.entity;

							var placeCurrentIndex =
								world.places.indexOf(placeCurrent);
							var randomizer = universe.randomizer;
							var placeIndexOffsetMax = 3;
							var placeIndexOffset = 1 + Math.floor
							(
								randomizer.getNextRandom() * placeIndexOffsetMax
							);
							var placeToDropToIndex = placeCurrentIndex + placeIndexOffset;
							var places = world.places;
							var placeToDropTo = places[placeToDropToIndex] as PlaceLevel;
							var zones = placeToDropTo.zones;
							var zoneToDropTo = ArrayHelper.random(zones, randomizer);
							var posToDropTo =
								zoneToDropTo.bounds.pointRandom(randomizer).floor();
							eColliding.locatable().loc.pos.overwriteWith(posToDropTo);
						}
					)
				]
			),

			new Entity2
			(
				"TrapDrain",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapDrain"),
					searchableTrap,
					Emplacement.fromAppearance("drain trap")
				] 
			),

			new Entity2
			(
				"TrapHex",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapHex"),
					searchableTrap,
					Emplacement.fromAppearance("hex trap")
				]
			),

			new Entity2
			(
				"TrapJaws", 
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapJaws"),
					searchableTrap,
					Emplacement.fromAppearance("bear trap")
				]
			),

			new Entity2
			(
				"TrapMine", 
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapMine"),
					searchableTrap,
					Emplacement.fromAppearance("landmine")
				]
			),

			new Entity2
			(
				"TrapPolymorph",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapPolymorph"),
					searchableTrap,
					Emplacement.fromAppearance("polymorph trap")
				]
			),

			new Entity2
			(
				"TrapSleep",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapSleep"), 
					searchableTrap,
					Emplacement.fromAppearance("sleeping gas trap")
				]
			),

			new Entity2
			(
				"TrapWater",
				[
					mappableOpen,
					generatable1,
					drawableInvisibleFromVisualName("TrapWater"), 
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"flood trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var u = uwpe.universe;
							var eColliding = uwpe.entity;

							var equipmentUser = eColliding.equipmentUser();
							var sockets = equipmentUser.socketGroup.sockets;
							var randomizer = u.randomizer;
							var socketToAttack =
								ArrayHelper.random(sockets, randomizer);
							var player = (eColliding as Entity2).player();
							if (player != null)
							{
								var message =
									"Acid pours onto your " + socketToAttack.defnName + "!";
								var messageLog = player.messageLog;
								// todo - Corrode.
								messageLog.messageAdd(message);
							}
						}
					)
				]
			),

			new Entity2
			(
				"TrapFire",
				[
					mappableOpen, generatable1,
					drawableInvisibleFromVisualName("TrapFire"),
					searchableTrap,
					Emplacement.fromAppearanceAndCollide
					(
						"fire trap",
						(uwpe: UniverseWorldPlaceEntities) =>
						{
							var eColliding = uwpe.entity;

							var equipmentUser = eColliding.equipmentUser();
							var sockets = equipmentUser.socketGroup.sockets;
							var socketToAttack =
								sockets.filter(x => x.defnName == "Feet")[0];
							var player = (eColliding as Entity2).player();
							if (player != null)
							{
								var message =
									"Fire bursts out at your feet!"
								socketToAttack.unequip();
								var messageLog = player.messageLog;
								// todo - Burn.
								messageLog.messageAdd(message);
							}
						}
					)
				]
			),

			new Entity2
			(
				"Web",
				[
					mappableOpen,
					generatable1,
					drawableFromVisualName("Web"),
					Emplacement.fromAppearance("web")
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
}
