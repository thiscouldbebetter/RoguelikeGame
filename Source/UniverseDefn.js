
function UniverseDefn
(
	name,
	actions,
	activityDefns,
	itemCategories,
	entityDefnGroups,
	venueDefns,
	venueStructure,
	buildVenues
)
{
	this.name = name;
	this.actions = actions;
	this.activityDefns = activityDefns;
	this.itemCategories = itemCategories;
	this.entityDefnGroups = entityDefnGroups;
	this.venueDefns = venueDefns;
	this.venueStructure = venueStructure;
	this.buildVenues = buildVenues;

	var entityDefnSets = this.entityDefnGroups.select
	(
		function(element) { return element["entityDefns"]; }
	);

	this.entityDefns = entityDefnSets.concatenateAll();

	this.actions.addLookupsByName();
	this.activityDefns.addLookupsByName();
	this.venueDefns.addLookupsByName();
	this.entityDefnGroups.addLookupsByName();
	this.entityDefns.addLookupsByName();
}
