
function PlaceBranch(name, displayName, placeDefnName, startOffsetRangeWithinParent, depthRangeInVenues, children)
{
	this.name = name;
	this.displayName = displayName;
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
	PlaceBranch.prototype.buildPlaces = function(worldDefn, randomizer, depthFirst)
	{
		this.buildPlaces_1_Generate(worldDefn, randomizer, depthFirst);
		this.buildPlaces_2_ConnectAdjacentPlaces();
		this.buildPlaces_3_CreateChildBranches(worldDefn, randomizer, depthFirst);
		this.buildPlaces_4_ConnectChildrenToSiblings();
		this.buildPlaces_5_ConnectToChildren();
		this.buildPlaces_6_RemovePlaceholderPortals();

		var returnValues = [];
		returnValues.addMany(this.places);
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			returnValues.addMany(child.places);
		}

		return returnValues;
	};

	PlaceBranch.prototype.buildPlaces_1_Generate = function(worldDefn, randomizer, depthFirst)
	{
		var placeDefnsByName = worldDefn.placeDefnsByName;

		var placeDefn = placeDefnsByName.get(this.placeDefnName);
		var placeDefnName = placeDefn.name;

		var numberOfVenuesInBranch = Math.floor(this.depthRangeInVenues.random(randomizer));

		for (var i = 0; i < numberOfVenuesInBranch; i++)
		{
			var place = placeDefn.placeGenerate.call
			(
				new DemoData(randomizer), // this
				worldDefn,
				this,
				placeDefn,
				i,
				depthFirst + i,
				randomizer
			);

			this.places.push(place);
		}
	};

	PlaceBranch.prototype.buildPlaces_2_ConnectAdjacentPlaces = function()
	{
		// Connect adjacent places within parent branch.

		for (var i = 0; i < this.places.length - 1; i++)
		{
			var place = this.places[i];
			var placeNext = this.places[i + 1];

			var placePortalDown = place.entitiesToSpawn.filter(x => x.name == "StairsDownToNextLevel")[0].portal();
			var placeNextPortalUp = placeNext.entitiesToSpawn.filter(x => x.name == "StairsUp")[0].portal();

			placePortalDown.destinationPlaceName = placeNext.name;
			placeNextPortalUp.destinationPlaceName = place.name;
			placeNextPortalUp.destinationEntityName = "StairsDownToNextLevel";
		}
	};

	PlaceBranch.prototype.buildPlaces_3_CreateChildBranches = function(worldDefn, randomizer, depthFirst)
	{
		// Create child branches.

		var sumOfChildDepthsInMainBranchSoFar = 0;

		for (var c = 0; c < this.children.length; c++)
		{
			var child = this.children[c];

			var childStartOffsetRange = child.startOffsetRangeWithinParent;
			var isChildInMainBranch = (childStartOffsetRange == null);
			if (isChildInMainBranch == false)
			{
				child.startOffset = Math.floor
				(
					childStartOffsetRange.random(randomizer)
				);
			}

			var childDepthWithinThis =
			(
				isChildInMainBranch ? sumOfChildDepthsInMainBranchSoFar : child.startOffset
			);
			var childDepthFirst = depthFirst + childDepthWithinThis;

			child.buildPlaces(worldDefn, randomizer, childDepthFirst);

			sumOfChildDepthsInMainBranchSoFar += (isChildInMainBranch ? child.places.length : 0);
		}
	};

	PlaceBranch.prototype.buildPlaces_4_ConnectChildrenToSiblings = function()
	{
		// Connect each child to next sibling if appropriate.

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
				)[0].portal();

				var childNextPlaceFirst = childNext.places[0];
				var childNextPortalFirst = childNextPlaceFirst.entitiesToSpawn.filter
				(
					x => x.name == "StairsUp"
				)[0].portal();

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
	};

	PlaceBranch.prototype.buildPlaces_5_ConnectToChildren = function()
	{
		// Connect to child branches.

		if (this.places.length > 0)
		{
			for (var c = 0; c < this.children.length; c++)
			{
				var child = this.children[c];
				var childStartOffset = child.startOffset;

				if (childStartOffset != null)
				{
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
					var parentPortalToBranchFrom = parentPortals[parentPortalIndexToBranchFrom].portal();

					var childPlaceFirst = child.places[0];
					var childPortalFirst = childPlaceFirst.entitiesToSpawn.filter
					(
						x => x.name == "StairsUp"
					)[0].portal();

					parentPortalToBranchFrom.destinationPlaceName = childPlaceFirst.name;
					childPortalFirst.destinationPlaceName = parentPlaceToBranchFrom.name;
					childPortalFirst.destinationEntityName = "StairsDownToChildBranch";
				}
			}
		}
	};

	PlaceBranch.prototype.buildPlaces_6_RemovePlaceholderPortals = function()
	{
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
				if (stairDownToChild.portal().destinationPlaceName == null)
				{
					placeEntities.remove(stairDownToChild);
				}
			}
		}
	};
}
