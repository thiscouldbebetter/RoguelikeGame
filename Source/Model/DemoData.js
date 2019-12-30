
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

		var items = this.buildEntityDefnGroups_Items(images, itemCategories);

		var movers = this.buildEntityDefnGroups_Movers(images, activityDefns, itemCategories);

		var returnValues =
		[
			[ emplacements ],
			items,
			movers,
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
					collidableDefns.Clear,
					new Drawable(visuals["Altar"]),
					new Emplacement("altar", useEmplacementAltar),
				]
			),

			new Entity
			(
				"Blood",
				[
					collidableDefns.Clear,
					new Drawable(visuals["Blood"]),
					new Emplacement("pool of blood"),
					new Ephemeral(30),
				]
			),

			new Entity
			(
				"Door",
				[
					collidableDefns.Concealing,
					new Drawable(visuals["Door"]),
					new Emplacement("door"),
				]
			),

			new Entity
			(
				"Gravestone",
				[
					collidableDefns.Clear,
					new Drawable(visuals["Gravestone"]),
					new Emplacement("gravestone"),
				]
			),

			new Entity
			(
				"StairsDown",
				[
					collidableDefns.Clear,
					new Drawable(visuals["StairsDown"]),
					new Emplacement("stairway down", useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsExit",
				[
					collidableDefns.Clear,
					new Drawable(visuals["StairsUp"]),
					new Emplacement("stairway up", useEmplacementPortal),
				]
			),

			new Entity
			(
				"StairsUp",
				[
					collidableDefns.Clear,
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

		var placeStructure = this.buildPlaceStructure();

		var randomizer = this.randomizer;

		var returnValue = new WorldDefn
		(
			"WorldDefn0",
			actions,
			activityDefns,
			itemCategories,
			entityDefnGroups,
			placeDefns,
			placeStructure,
			function buildPlaces()
			{
				var root = this.venueStructure.branchRoot;
				var returnValues = root.buildPlaces
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
