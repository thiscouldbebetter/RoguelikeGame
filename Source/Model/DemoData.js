
function DemoData(randomizer)
{
	this.randomizer = randomizer;
	this.imageBuilder = new ImageBuilder(Color.Instances()._All);
}
{
	var mappableDefns = MappableDefn.Instances();

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

		var mappableOpen = mappableDefns.Open;
		var generatable0 = new Generatable(0);
		var generatable1 = new Generatable(1);
		var searchableTrap = new Searchable(.25);

		var entityDefns =
		[
			new Entity
			(
				"Altar",
				[
					mappableOpen,
					new Drawable(visuals["Altar"]),
					new Emplacement("altar", useEmplacementAltar),
					generatable1
				]
			),

			new Entity
			(
				"Door",
				[
					new MappableDefn
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
								return (entity.searchable.isHidden ? "Hidden" : (entity.openable.isOpen ? "Open" : "Closed"));
							},
							[ "Hidden", "Closed", "Open" ],
							[ 
								new VisualDirectional
								(
									null,
									[
										visuals["WallDungeonNorthSouth"],
										visuals["WallDungeonEastWest"]
									]
								),
								visuals["DoorClosed"],
								visuals["DoorOpenLeft"]
							]
						)
					),
					new Emplacement("door"),
					new Openable(false),
					new Searchable
					(
						.25, // chance
						false // isHidden
					),
					generatable0
				]
			),

			new Entity
			(
				"Gravestone",
				[
					mappableOpen,
					new Drawable(visuals["Gravestone"]),
					new Emplacement("gravestone"),
					generatable1
				]
			),

			new Entity("Hole",			[ mappableOpen, generatable1, new Drawable(visuals["Hole"]), 			new Emplacement("hole"), ] ),
			new Entity("Sink", 			[ mappableOpen, generatable1, new Drawable(visuals["Sink"]), 			new Emplacement("sink"), ] ),

			new Entity
			(
				"StairsDown",
				[
					mappableDefns.Open,
					new Drawable(visuals["StairsDown"]),
					new Emplacement("stairway down", useEmplacementPortal),
					generatable0
				]
			),

			new Entity
			(
				"StairsExit",
				[
					mappableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
					generatable0
				]
			),

			new Entity
			(
				"StairsUp",
				[
					mappableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
					generatable0
				]
			),

			// Hidden until discovered.
			new Entity("MagicPortal",	[ mappableOpen, generatable1, new Drawable(visuals["MagicPortal"], false), 	searchableTrap, new Emplacement("magic portal"), ] ),

			new Entity("Pit",			[ mappableOpen, generatable1, new Drawable(visuals["Pit"], false), 			searchableTrap, new Emplacement("pit"), ] ),
			new Entity("PitSpiked",		[ mappableOpen, generatable1, new Drawable(visuals["PitSpiked"], false), 	searchableTrap, new Emplacement("spiked pit"), ] ),

			new Entity("TeleporterShort",[ mappableOpen, generatable1, new Drawable(visuals["TeleporterShort"], false), searchableTrap, new Emplacement("short-range teleporter"), ] ),
			new Entity("TeleporterLong",[ mappableOpen, generatable1, new Drawable(visuals["TeleporterLong"], false),	searchableTrap, new Emplacement("long-range teleporter"), ] ),

			new Entity("TrapAlarm", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapAlarm"], false), 	searchableTrap, new Emplacement("alarm trap"), ] ),
			new Entity("TrapArrow", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapArrow"], false), 	searchableTrap, new Emplacement("arrow trap"), ] ),
			new Entity("TrapBoulder", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapBoulder"], false),	searchableTrap, new Emplacement("boulder trap"), ] ),
			new Entity("TrapDart", 		[ mappableOpen, generatable1, new Drawable(visuals["TrapDart"], false), 	searchableTrap, new Emplacement("dart trap"), ] ),
			new Entity("TrapDeadfall", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapDeadfall"], false), searchableTrap, new Emplacement("deadfall"), ] ),
			new Entity("TrapDoor",		[ mappableOpen, generatable1, new Drawable(visuals["TrapDoor"], false), 	searchableTrap, new Emplacement("trap door"), ] ),
			new Entity("TrapDrain",		[ mappableOpen, generatable1, new Drawable(visuals["TrapDrain"], false), 	searchableTrap, new Emplacement("drain trap"), ] ),
			new Entity("TrapHex",		[ mappableOpen, generatable1, new Drawable(visuals["TrapHex"], false), 		searchableTrap, new Emplacement("hex trap"), ] ),
			new Entity("TrapJaws",  	[ mappableOpen, generatable1, new Drawable(visuals["TrapJaws"], false), 	searchableTrap, new Emplacement("bear trap"), ] ),
			new Entity("TrapMine",  	[ mappableOpen, generatable1, new Drawable(visuals["TrapMine"], false), 	searchableTrap, new Emplacement("landmine"), ] ),
			new Entity("TrapPolymorph", [ mappableOpen, generatable1, new Drawable(visuals["TrapPolymorph"], false),searchableTrap, new Emplacement("polymorph trap"), ] ),
			new Entity("TrapSleep", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapSleep"], false), 	searchableTrap, new Emplacement("sleeping gas trap"), ] ),
			new Entity("TrapWater", 	[ mappableOpen, generatable1, new Drawable(visuals["TrapWater"], false), 	searchableTrap, new Emplacement("flood trap"), ] ),
			new Entity("TrapFire", 		[ mappableOpen, generatable1, new Drawable(visuals["TrapFire"], false), 	searchableTrap, new Emplacement("fire trap"), ] ),

			new Entity("Web",			[ mappableOpen, generatable1, new Drawable(visuals["Web"]), new Emplacement("web"), ] ),
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
