
function WorldDefn2(name, actions, activityDefns, itemCategories, entityDefnGroups, placeDefns, placeTree, buildPlaces)
{
	this.name = name;
	this.actions = actions;
	this.activityDefns = activityDefns;
	this.itemCategories = itemCategories;
	this.entityDefnGroups = entityDefnGroups;
	this.placeDefns = placeDefns;
	this.placeTree = placeTree;
	this.buildPlaces = buildPlaces;

	var entityDefnSets = this.entityDefnGroups.map
	(
		x => x.entityDefns
	);

	this.entityDefns = entityDefnSets.concatenateAll();

	this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
	this.activityDefnsByName = ArrayHelper.addLookupsByName(this.activityDefns);
	this.placeDefnsByName = ArrayHelper.addLookupsByName(this.placeDefns);
	this.entityDefnGroupsByName = ArrayHelper.addLookupsByName(this.entityDefnGroups);
	this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);
}
