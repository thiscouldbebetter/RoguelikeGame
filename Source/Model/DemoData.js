
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
		var moverDefnEntities = moverGroups[0].entityDefns;
		var moverDefns = moverDefnEntities.filter(x => x.MoverDefn != null); // hack
		var itemDefnsForCorpses = moverDefns.map
		(
			x => x.MoverDefn.itemDefnCorpse
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
			var itemsHeld = entityUsing.ItemHolder.itemEntities;
			var isItemGoalHeld = itemsHeld.some(x => x.name == "Amulet of Yendor");
			var messageLog = entityUsing.Player.messageLog;
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
			var message = "You use the " + entityUsed.Emplacement.appearance + ".";
			entityUsing.Player.messageLog.messageAdd(message);
			entityUsed.Portal.use(universe, world, place, entityUsing, entityUsed);
		};

		var entityDefns =
		[
			new Entity
			(
				"Altar",
				[
					collidableDefns.Open,
					new Drawable(visuals["Altar"]),
					new Emplacement("altar", 1, useEmplacementAltar),
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
							return (entity.Openable.isOpen == false);
						},
						function blocksVision(entity)
						{
							return (entity.Openable.isOpen == false);
						},
					),
					new Drawable
					(
						new VisualSelect
						(
							function selectChildName(universe, world, display, drawable, entity)
							{
								return (entity.Openable.isOpen ? "Open" : "Closed");
							},
							[ "Closed", "Open" ],
							[ visuals["DoorClosed"], visuals["DoorOpenLeft"] ]
						)
					),
					new Emplacement("door", 0),
					new Openable(false),
				]
			),

			new Entity
			(
				"Gravestone",
				[
					collidableDefns.Open,
					new Drawable(visuals["Gravestone"]),
					new Emplacement("gravestone", 1),
				]
			),

			new Entity("Sink", 		[ collidableDefns.Open, new Drawable(visuals["Sink"]), 			new Emplacement("sink", 1), ] ),
			new Entity("TrapArrow", 	[ collidableDefns.Open, new Drawable(visuals["TrapArrow"]), 	new Emplacement("arrow trap", 1), ] ),
			new Entity("TrapDart", 		[ collidableDefns.Open, new Drawable(visuals["TrapDart"]), 		new Emplacement("dart trap", 1), ] ),
			new Entity("TrapDeadfall", 	[ collidableDefns.Open, new Drawable(visuals["TrapDeadfall"]), 	new Emplacement("deadfall", 1), ] ),
			new Entity("TrapNoise", 	[ collidableDefns.Open, new Drawable(visuals["TrapNoise"]), 	new Emplacement("noise trap", 1), ] ),
			new Entity("TrapJaws",  	[ collidableDefns.Open, new Drawable(visuals["TrapJaws"]), 		new Emplacement("bear trap", 1), ] ),
			new Entity("TrapMine",  	[ collidableDefns.Open, new Drawable(visuals["TrapMine"]), 		new Emplacement("landmine", 1), ] ),
			new Entity("TrapBoulder", 	[ collidableDefns.Open, new Drawable(visuals["TrapBoulder"]), 	new Emplacement("boulder trap", 1), ] ),
			new Entity("TrapSleep", 	[ collidableDefns.Open, new Drawable(visuals["TrapSleep"]), 	new Emplacement("sleeping gas trap", 1), ] ),
			new Entity("TrapWater", 	[ collidableDefns.Open, new Drawable(visuals["TrapWater"]), 	new Emplacement("flood trap", 1), ] ),
			new Entity("TrapFire", 		[ collidableDefns.Open, new Drawable(visuals["TrapFire"]), 		new Emplacement("fire trap", 1), ] ),
			new Entity("Pit",			[ collidableDefns.Open, new Drawable(visuals["Pit"]), 			new Emplacement("pit", 1), ] ),
			new Entity("PitSpiked",		[ collidableDefns.Open, new Drawable(visuals["PitSpiked"]), 	new Emplacement("spiked pit", 1), ] ),
			new Entity("Hole",			[ collidableDefns.Open, new Drawable(visuals["Hole"]), 			new Emplacement("hole", 1), ] ),
			new Entity("TrapDoor",		[ collidableDefns.Open, new Drawable(visuals["TrapDoor"]), 		new Emplacement("trap door", 1), ] ),
			new Entity("TeleporterShort",[ collidableDefns.Open, new Drawable(visuals["TeleporterShort"]),new Emplacement("short-range teleporter", 1), ] ),
			new Entity("TeleporterLong",[ collidableDefns.Open, new Drawable(visuals["TeleporterLong"]),new Emplacement("long-range teleporter", 1), ] ),
			new Entity("MagicPortal",	[ collidableDefns.Open, new Drawable(visuals["MagicPortal"]), 	new Emplacement("magic portal", 1), ] ),
			new Entity("Web",			[ collidableDefns.Open, new Drawable(visuals["Web"]), 			new Emplacement("web", 1), ] ),
			new Entity("TrapHex",		[ collidableDefns.Open, new Drawable(visuals["TrapHex"]), 		new Emplacement("hex trap", 1), ] ),
			new Entity("TrapDrain",		[ collidableDefns.Open, new Drawable(visuals["TrapDrain"]), 	new Emplacement("drain trap", 1), ] ),
			new Entity("TrapPolymorph", [ collidableDefns.Open, new Drawable(visuals["TrapPolymorph"]), new Emplacement("polymorph trap", 1), ] ),


			new Entity
			(
				"StairsDown",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsDown"]),
					new Emplacement("stairway down", 0, useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsExit",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", 0, useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsUp",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", 0, useEmplacementPortal),
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

		var entityDefnGroups = this.buildEntityDefnGroups(visualsOpaque, activityDefns, itemCategories);

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
