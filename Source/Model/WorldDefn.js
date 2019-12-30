
function WorldDefn
(
	name,
	actions,
	activityDefns,
	itemCategories,
	entityDefnGroups,
	placeDefns,
	venueStructure,
	buildPlaces
)
{
	this.name = name;
	this.actions = actions;
	this.activityDefns = activityDefns;
	this.itemCategories = itemCategories;
	this.entityDefnGroups = entityDefnGroups;
	this.placeDefns = placeDefns;
	this.venueStructure = venueStructure;
	this.buildPlaces = buildPlaces;

	var entityDefnSets = this.entityDefnGroups.select
	(
		function(element) { return element["entityDefns"]; }
	);

	this.entityDefns = entityDefnSets.concatenateAll();

	this.actions.addLookupsByName();
	this.activityDefns.addLookupsByName();
	this.placeDefns.addLookupsByName();
	this.entityDefnGroups.addLookupsByName();
	this.entityDefns.addLookupsByName();
}
