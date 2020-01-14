
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
					new Emplacement("altar", useEmplacementAltar),
				]
			),

			new Entity
			(
				"Blood",
				[
					collidableDefns.Open,
					new Drawable(visuals["Blood"]),
					new Emplacement("pool of blood"),
					new Ephemeral(30),
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
					new Emplacement("door"),
					new Openable(false),
				]
			),

			new Entity
			(
				"Gravestone",
				[
					collidableDefns.Open,
					new Drawable(visuals["Gravestone"]),
					new Emplacement("gravestone"),
				]
			),

			new Entity
			(
				"StairsDown",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsDown"]),
					new Emplacement("stairway down", useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsExit",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsUp",
				[
					collidableDefns.Open,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
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
					randomizer
				);
				return returnValues;
			}
		);

		return returnValue;
	};

}
