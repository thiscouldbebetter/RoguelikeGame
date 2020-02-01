
function DemoData(randomizer)
{
	this.randomizer = randomizer;
	this.imageBuilder = new ImageBuilder(Color.Instances()._All);
}
{
	var collidableDefns = CollidableDefn.Instances();

	DemoData.prototype.buildEntityDefnGroups = function(images, activityDefns, itemCategories)
	{
		// entityDefns

		var emplacements = this.buildEntityDefnGroups_Emplacements(images);

		var itemGroups = this.buildEntityDefnGroups_Items(images, itemCategories);

		var moverGroups = this.buildEntityDefnGroups_Movers(images, activityDefns, itemCategories);
		var moverEntities = moverGroups[0].entityDefns;
		var killables = moverEntities.filter(x => x.killable != null); // hack
		var itemDefnsForCorpses = killables.map
		(
			x => x.killable.itemDefnCorpse
		).filter
		(
			x => (x != null)
		);
		var entityDefnsForCorpses = itemDefnsForCorpses.map(x => new Entity(x.name, [ x ]) );
		var entityDefnGroupForCorpses = new EntityDefnGroup("Corpses", 0, entityDefnsForCorpses);
		itemGroups.push(entityDefnGroupForCorpses);

		var returnValues =
		[
			[ emplacements ],
			itemGroups,
			moverGroups
		].concatenateAll();

		return returnValues;
	};

	DemoData.prototype.buildEntityDefnGroups_Emplacements = function(visuals)
	{
		var sizeInPixels = visuals["Floor"].size;

		var useEmplacementAltar = function(universe, world, place, entityUsing, entityUsed)
		{
			var itemsHeld = entityUsing.itemHolder.itemEntities;
			var isItemGoalHeld = itemsHeld.some(x => x.name == "Amulet of Yendor");
			var messageLog = entityUsing.player.messageLog;
			if (isItemGoalHeld == false)
			{
				var message = "You do not have the Amulet of Yendor!"
				messageLog.messageAdd(message);
				var message = "You are punished with death."
				messageLog.messageAdd(message);

				var venueMessage = new VenueMessage
				(
					"You lose!",
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half(),
					function acknowledge(universe)
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls(universe.controlBuilder.title(universe))
						);
					}
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
					"You win!",
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone().half(),
					function acknowledge(universe)
					{
						universe.venueNext = new VenueFader
						(
							new VenueControls(universe.controlBuilder.title(universe))
						);
					}
				);
				universe.venueNext = venueMessage;

			}
		}

		var useEmplacementPortal = function(universe, world, place, entityUsing, entityUsed)
		{
			var message = "You use the " + entityUsed.emplacement.appearance + ".";
			entityUsing.player.messageLog.messageAdd(message);
			entityUsed.portal.use(universe, world, place, entityUsing, entityUsed);
		};

		var collidableOpen = collidableDefns.Open;
		var generatable0 = new Generatable(0);
		var generatable1 = new Generatable(1);

		var entityDefns =
		[
			new Entity
			(
				"Altar",
				[
					collidableOpen,
					new Drawable(visuals["Altar"]),
					new Emplacement("altar", useEmplacementAltar),
					generatable1
				]
			),

			new Entity
			(
				"Door",
				[
					new CollidableDefn
					(
						function blocksMovement(entity)
						{
							return (entity.openable.isOpen == false);
						},
						function blocksVision(entity)
						{
							return (entity.openable.isOpen == false);
						},
					),
					new Drawable
					(
						new VisualSelect
						(
							function selectChildName(universe, world, display, entity)
							{
								return (entity.openable.isOpen ? "Open" : "Closed");
							},
							[ "Closed", "Open" ],
							[ visuals["DoorClosed"], visuals["DoorOpenLeft"] ]
						)
					),
					new Emplacement("door"),
					new Openable(false),
					generatable0
				]
			),

			new Entity
			(
				"Gravestone",
				[
					collidableOpen,
					new Drawable(visuals["Gravestone"]),
					new Emplacement("gravestone"),
					generatable1
				]
			),

			new Entity("Sink", 			[ collidableOpen, generatable1, new Drawable(visuals["Sink"]), 			new Emplacement("sink"), ] ),
			new Entity("TrapAlarm", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapAlarm"]), 	new Emplacement("alarm trap"), ] ),
			new Entity("TrapArrow", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapArrow"]), 	new Emplacement("arrow trap"), ] ),
			new Entity("TrapDart", 		[ collidableOpen, generatable1, new Drawable(visuals["TrapDart"]), 		new Emplacement("dart trap"), ] ),
			new Entity("TrapDeadfall", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapDeadfall"]), 	new Emplacement("deadfall"), ] ),
			new Entity("TrapJaws",  	[ collidableOpen, generatable1, new Drawable(visuals["TrapJaws"]), 		new Emplacement("bear trap"), ] ),
			new Entity("TrapMine",  	[ collidableOpen, generatable1, new Drawable(visuals["TrapMine"]), 		new Emplacement("landmine"), ] ),
			new Entity("TrapBoulder", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapBoulder"]), 	new Emplacement("boulder trap"), ] ),
			new Entity("TrapSleep", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapSleep"]), 	new Emplacement("sleeping gas trap"), ] ),
			new Entity("TrapWater", 	[ collidableOpen, generatable1, new Drawable(visuals["TrapWater"]), 	new Emplacement("flood trap"), ] ),
			new Entity("TrapFire", 		[ collidableOpen, generatable1, new Drawable(visuals["TrapFire"]), 		new Emplacement("fire trap"), ] ),
			new Entity("Pit",			[ collidableOpen, generatable1, new Drawable(visuals["Pit"]), 			new Emplacement("pit"), ] ),
			new Entity("PitSpiked",		[ collidableOpen, generatable1, new Drawable(visuals["PitSpiked"]), 	new Emplacement("spiked pit"), ] ),
			new Entity("Hole",			[ collidableOpen, generatable1, new Drawable(visuals["Hole"]), 			new Emplacement("hole"), ] ),
			new Entity("TrapDoor",		[ collidableOpen, generatable1, new Drawable(visuals["TrapDoor"]), 		new Emplacement("trap door"), ] ),
			new Entity("TeleporterShort",[ collidableOpen, generatable1, new Drawable(visuals["TeleporterShort"]),new Emplacement("short-range teleporter"), ] ),
			new Entity("TeleporterLong",[ collidableOpen, generatable1, new Drawable(visuals["TeleporterLong"]),new Emplacement("long-range teleporter"), ] ),
			new Entity("MagicPortal",	[ collidableOpen, generatable1, new Drawable(visuals["MagicPortal"]), 	new Emplacement("magic portal"), ] ),
			new Entity("Web",			[ collidableOpen, generatable1, new Drawable(visuals["Web"]), 			new Emplacement("web"), ] ),
			new Entity("TrapHex",		[ collidableOpen, generatable1, new Drawable(visuals["TrapHex"]), 		new Emplacement("hex trap"), ] ),
			new Entity("TrapDrain",		[ collidableOpen, generatable1, new Drawable(visuals["TrapDrain"]), 	new Emplacement("drain trap"), ] ),
			new Entity("TrapPolymorph", [ collidableOpen, generatable1, new Drawable(visuals["TrapPolymorph"]), new Emplacement("polymorph trap"), ] ),


			new Entity
			(
				"StairsDown",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsDown"]),
					new Emplacement("stairway down", useEmplacementPortal),
					generatable0
				]
			),

			new Entity
			(
				"StairsExit",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
					generatable0
				]
			),

			new Entity
			(
				"StairsUp",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
					generatable0
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
	};

	DemoData.prototype.buildWorldDefn = function(visualsForTiles)
	{
		var visualsOpaque = this.buildVisualLookup(visualsForTiles);

		var actions = this.actionsBuild();

		var activityDefns = this.buildActivityDefns();

		var itemCategories = this.buildItemCategories();

		var entityDefnGroups = this.buildEntityDefnGroups
		(
			visualsOpaque, activityDefns, itemCategories
		);

		var placeDefns = this.buildPlaceDefns(visualsOpaque, actions);

		var placeTree = this.buildPlaceTree();

		var randomizer = this.randomizer;

		var returnValue = new WorldDefn
		(
			"WorldDefn0",
			actions,
			activityDefns,
			itemCategories,
			entityDefnGroups,
			placeDefns,
			placeTree,
			function buildPlaces()
			{
				var returnValues = this.placeTree.buildPlaces
				(
					this, // worldDefn
					randomizer,
					0 // depthFirst
				);
				return returnValues;
			}
		);

		return returnValue;
	};

}
