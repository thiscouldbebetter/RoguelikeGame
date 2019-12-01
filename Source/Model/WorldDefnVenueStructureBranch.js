
function WorldDefnVenueStructureBranch
(
	name,
	venueDefnName,
	startsAfterSibling,
	startOffsetRangeWithinParent,
	depthRangeInVenues,
	children
)
{
	this.name = name;
	this.venueDefnName = venueDefnName;
	this.startsAfterSibling = startsAfterSibling;
	this.startOffsetRangeWithinParent = startOffsetRangeWithinParent;
	this.depthRangeInVenues = depthRangeInVenues;
	this.children = children;
	this.venues = [];

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].parent = this;
	}
}

{
	WorldDefnVenueStructureBranch.prototype.buildVenuesAndAddToList = function
	(
		worldDefn, venuesSoFar, venueDepth, randomizer
	)
	{
		var venueDefns = worldDefn.venueDefns;
		var entityDefns = worldDefn.entityDefns;

		var venueDefn = venueDefns[this.venueDefnName];
		var numberOfVenuesInBranch = Math.floor(this.depthRangeInVenues.random(randomizer));

		var indexOfFirstVenueInBranch = venuesSoFar.length;

		for (var i = 0; i < numberOfVenuesInBranch; i++)
		{
			venueDepth++;

			var venue = venueDefn.venueGenerate.call
			(
				new DemoData(randomizer), // hack
				worldDefn,
				venueDefn,
				venuesSoFar.length, // venueIndex
				numberOfVenuesInBranch,
				venueDepth,
				randomizer
			);

			this.venues.push(venue);

			venuesSoFar.push(venue);
		}

		var venueFirstInBranch = venuesSoFar[indexOfFirstVenueInBranch];

		if (this.parent != null && this.parent.venues.length > 0)
		{
			var venueIndexToBranchFrom = Math.floor
			(
				this.startOffsetRangeWithinParent.random(randomizer)
			);
			var venueToBranchFrom = this.parent.venues[venueIndexToBranchFrom];

			var entityPortalToParentBranch = new Entity
			(
				"StairsUp",
				worldDefn.entityDefns["StairsUp"].name,
				new Coords().randomize(randomizer).multiply
				(
					venueFirstInBranch.map.sizeInCells
				).floor(),
				// propertyValues
				[
					new PortalData
					(
						venueToBranchFrom.name,
						"StairsDown" // portalName
					),
				]
			);

			venue.entitiesToSpawn.push(entityPortalToParentBranch);

		}

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.buildVenuesAndAddToList(worldDefn, venuesSoFar, 0, randomizer);
		}

		return venuesSoFar;
	}
}
