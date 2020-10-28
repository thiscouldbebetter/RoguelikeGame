
class PlaceBranch
{
	name: string;
	displayName: string;
	placeDefnName: string;
	startOffsetRangeWithinParent: RangeExtent;
	depthRangeInVenues: RangeExtent;
	children: PlaceBranch[];

	places: PlaceLevel[];
	parent: PlaceBranch;
	startOffset: number;

	constructor
	(
		name: string,
		displayName: string,
		placeDefnName: string,
		startOffsetRangeWithinParent: RangeExtent,
		depthRangeInVenues: RangeExtent,
		children: PlaceBranch[]
	)
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

	buildPlaces(worldDefn: WorldDefn2, randomizer: Randomizer, depthFirst: number)
	{
		this.buildPlaces_1_Generate(worldDefn, randomizer, depthFirst);
		this.buildPlaces_2_ConnectAdjacentPlaces();
		this.buildPlaces_3_CreateChildBranches(worldDefn, randomizer, depthFirst);
		this.buildPlaces_4_ConnectChildrenToSiblings();
		this.buildPlaces_5_ConnectToChildren();
		this.buildPlaces_6_RemovePlaceholderPortals();

		var returnValues = new Array<PlaceLevel>();
		returnValues.push(...this.places);
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			returnValues.push(...child.places);
		}

		return returnValues;
	}

	buildPlaces_1_Generate(worldDefn: WorldDefn2, randomizer: Randomizer, depthFirst: number)
	{
		var placeDefnsByName = worldDefn.placeDefn2sByName;

		var placeDefn = placeDefnsByName.get(this.placeDefnName);

		var numberOfVenuesInBranch =
			Math.floor(this.depthRangeInVenues.random(randomizer));

		var demoDataPlaces = new DemoData_Main(randomizer).demoDataPlaces;

		for (var i = 0; i < numberOfVenuesInBranch; i++)
		{
			var place = placeDefn.placeGenerate.call
			(
				demoDataPlaces, // this
				worldDefn,
				this,
				placeDefn,
				i,
				depthFirst + i,
				randomizer
			);

			this.places.push(place);
		}
	}

	buildPlaces_2_ConnectAdjacentPlaces()
	{
		// Connect adjacent places within parent branch.

		for (var i = 0; i < this.places.length - 1; i++)
		{
			var place = this.places[i];
			var placeNext = this.places[i + 1];

			var placePortalDown = 
			(
				place.entitiesToSpawn.filter
				(
					(x: Entity) => x.name == "StairsDownToNextLevel"
				)[0] as Entity2
			).portal2();
			var placeNextPortalUp =
			(
				placeNext.entitiesToSpawn.filter
				(
					(x: Entity) => x.name == "StairsUp"
				)[0] as Entity2
			).portal2();

			placePortalDown.destinationPlaceName = placeNext.name;
			placeNextPortalUp.destinationPlaceName = place.name;
			placeNextPortalUp.destinationEntityName = "StairsDownToNextLevel";
		}
	}

	buildPlaces_3_CreateChildBranches(worldDefn: WorldDefn2, randomizer: Randomizer, depthFirst: number)
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
	}

	buildPlaces_4_ConnectChildrenToSiblings()
	{
		// Connect each child to next sibling if appropriate.

		for (var c = 0; c < this.children.length; c++)
		{
			var child = this.children[c];
			var childPlaceLast = child.places[child.places.length - 1];
			var childNext = this.children[c + 1];

			if (childNext != null && childNext.startOffsetRangeWithinParent == null)
			{
				var childPortalLast =
				(
					childPlaceLast.entitiesToSpawn.filter
					(
						(x: Entity) => x.name == "StairsDownToNextLevel"
					)[0] as Entity2
				).portal2();

				var childNextPlaceFirst = childNext.places[0];
				var childNextPortalFirst =
				(
					childNextPlaceFirst.entitiesToSpawn.filter
					(
						(x: Entity) => x.name == "StairsUp"
					)[0] as Entity2
				).portal2();

				childPortalLast.destinationPlaceName = childNextPlaceFirst.name;
				childNextPortalFirst.destinationPlaceName = childPlaceLast.name;
				childNextPortalFirst.destinationEntityName = "StairsDownToNextLevel";
			}
			else
			{
				// If this is final sibling or should not connect to next sibling, remove final portal.

				var childPlaceLastEntities = childPlaceLast.entitiesToSpawn;
				var childPortalLastAsEntity = childPlaceLastEntities.filter
				(
					(x: Entity) => x.name == "StairsDownToNextLevel"
				)[0];
				ArrayHelper.remove(childPlaceLastEntities, childPortalLastAsEntity);
			}
		}
	}

	buildPlaces_5_ConnectToChildren()
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
						(x: Entity) => x.name == "StairsDownToChildBranch"
					);

					var parentPortalIndexToBranchFrom;
					for (var p = 0; p < parentPortals.length; p++)
					{
						var portal = (parentPortals[p] as Entity2).portal2();
						if (portal.destinationPlaceName == null)
						{
							parentPortalIndexToBranchFrom = p;
							break;
						}
					}
					var parentPortalToBranchFrom =
						(parentPortals[parentPortalIndexToBranchFrom] as Entity2).portal2();

					var childPlaceFirst = child.places[0];
					var childPortalFirst =
					(
						childPlaceFirst.entitiesToSpawn.filter
						(
							(x: Entity) => x.name == "StairsUp"
						)[0] as Entity2
					).portal2();

					parentPortalToBranchFrom.destinationPlaceName = childPlaceFirst.name;
					childPortalFirst.destinationPlaceName = parentPlaceToBranchFrom.name;
					childPortalFirst.destinationEntityName = "StairsDownToChildBranch";
				}
			}
		}
	}

	buildPlaces_6_RemovePlaceholderPortals()
	{
		// Remove unused placeholder portals.

		for (var i = 0; i < this.places.length; i++)
		{
			var place = this.places[i];
			var placeEntities = place.entitiesToSpawn;
			var stairsDownToChild = placeEntities.filter
			(
				(x: Entity) => x.name == "StairsDownToChildBranch"
			);
			for (var p = 0; p < stairsDownToChild.length; p++)
			{
				var stairDownToChild = stairsDownToChild[p] as Entity2;
				if (stairDownToChild.portal2().destinationPlaceName == null)
				{
					ArrayHelper.remove(placeEntities, stairDownToChild);
				}
			}
		}
	}
}
