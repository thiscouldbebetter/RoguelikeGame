
function PlaceStructureBranch
(
	name,
	placeDefnName,
	startOffsetRangeWithinParent,
	depthRangeInVenues,
	children
)
{
	this.name = name;
	this.placeDefnName = placeDefnName;
	this.startOffsetRangeWithinParent = startOffsetRangeWithinParent;
	this.depthRangeInVenues = depthRangeInVenues;
	this.children = children;
	this.places = [];

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].parent = this;
	}
}

{
	PlaceStructureBranch.prototype.buildPlaces = function
	(
		worldDefn, randomizer
	)
	{
		var placeDefns = worldDefn.placeDefns;
		var entityDefns = worldDefn.entityDefns;

		var placeDefn = placeDefns[this.placeDefnName];
		var placeDefnName = placeDefn.name;

		var numberOfVenuesInBranch = Math.floor(this.depthRangeInVenues.random(randomizer));

		for (var i = 0; i < numberOfVenuesInBranch; i++)
		{
			var place = placeDefn.venueGenerate.call
			(
				new DemoData(randomizer), // hack
				worldDefn,
				this.name,
				placeDefn,
				i,
				randomizer
			);

			this.places.push(place);
		}

		// Connect adjacent places within parent branch.

		for (var i = 0; i < this.places.length - 1; i++)
		{
			var place = this.places[i];
			var placeNext = this.places[i + 1];

			var placePortalDown = place.entitiesToSpawn.filter(x => x.name == "StairsDownToNextLevel")[0].Portal;
			var placeNextPortalUp = placeNext.entitiesToSpawn.filter(x => x.name == "StairsUp")[0].Portal;

			placePortalDown.destinationPlaceName = placeNext.name;
			placeNextPortalUp.destinationPlaceName = place.name;
			placeNextPortalUp.destinationEntityName = "StairsDownToNextLevel";
		}

		// Create child branches.

		for (var c = 0; c < this.children.length; c++)
		{
			var child = this.children[c];
			child.buildPlaces(worldDefn, randomizer);
		}

		// Connect to next sibling if appropriate.

		for (var c = 0; c < this.children.length; c++)
		{
			var child = this.children[c];
			var childPlaceLast = child.places[child.places.length - 1];
			var childNext = this.children[c + 1];

			if (childNext != null && childNext.startOffsetRangeWithinParent == null)
			{
				var childPortalLast = childPlaceLast.entitiesToSpawn.filter
				(
					x => x.name == "StairsDownToNextLevel"
				)[0].Portal;

				var childNextPlaceFirst = childNext.places[0];
				var childNextPortalFirst = childNextPlaceFirst.entitiesToSpawn.filter
				(
					x => x.name == "StairsUp"
				)[0].Portal;

				childPortalLast.destinationPlaceName = childNextPlaceFirst.name;
				childNextPortalFirst.destinationPlaceName = childPlaceLast.name;
				childNextPortalFirst.destinationEntityName = "StairsDownToNextLevel";
			}
			else
			{
				// If this is final sibling or should not connect to next sibling, remove final portal.

				var childPlaceLastEntities = childPlaceLast.entitiesToSpawn;
				var childPortalLast = childPlaceLastEntities.filter(x => x.name == "StairsDownToNextLevel")[0];
				childPlaceLastEntities.remove(childPortalLast);
			}
		}

		// Connect to child branches.

		if (this.places.length > 0)
		{
			for (var c = 0; c < this.children.length; c++)
			{
				var child = this.children[c];
				if (child.startOffsetRangeWithinParent == false)
				{
					var childStartOffset = Math.floor
					(
						child.startOffsetRangeWithinParent.random(randomizer)
					);
					var parentPlaceToBranchFrom = this.places[childStartOffset];
					var parentPortals = parentPlaceToBranchFrom.entitiesToSpawn.filter
					(
						x => x.name == "StairsDownToChildBranch"
					);

					var parentPortalIndexToBranchFrom;
					for (var p = 0; p < parentPortals.length; p++)
					{
						var portal = parentPortals[p];
						if (portal.destinationPlaceName == null)
						{
							parentPortalIndexToBranchFrom = p;
							break;
						}
					}
					var parentPortalToBranchFrom = parentPortals[parentPortalIndexToBranchFrom].Portal;

					var childPlaceFirst = child.places[0];
					var childPortalFirst = childPlaceFirst.entitiesToSpawn.filter
					(
						x => x.name == "StairsUp"
					)[0].Portal;

					parentPortalToBranchFrom.destinationPlaceName = childPlaceFirst.name;
					childPortalFirst.destinationPlaceName = parentPlaceToBranchFrom.name;
					childPortalFirst.destinationEntityName = "StairsDownToChildBranch";
				}
			}
		}

		// Remove unused placeholder portals.

		for (var i = 0; i < this.places.length; i++)
		{
			var place = this.places[i];
			var placeEntities = place.entitiesToSpawn;
			var stairsDownToChild = placeEntities.filter
			(
				x => x.name == "StairsDownToChildBranch"
			);
			for (var p = 0; p < stairsDownToChild.length; p++)
			{
				var stairDownToChild = stairsDownToChild[p];
				if (stairDownToChild.Portal.destinationPlaceName == null)
				{
					placeEntities.remove(stairDownToChild);
				}
			}
		}

		var returnValues = [];
		returnValues.addMany(this.places);
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			returnValues.addMany(child.places);
		}

		return returnValues;
	};
}
