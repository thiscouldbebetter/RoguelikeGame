
class WorldDefn
{
	constructor(name, actions, activityDefns, itemCategories, entityDefnGroups, placeDefns, placeTree, buildPlaces)
	{
		this.name = name;
		this.actions = actions;
		this.activityDefns = activityDefns;
		this.itemCategories = itemCategories;
		this.entityDefnGroups = entityDefnGroups;
		this.placeDefns = placeDefns;
		this.placeTree = placeTree;
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
}
