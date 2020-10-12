
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

		var entityDefnSets = this.entityDefnGroups.map
		(
			x => x.entityDefns
		);

		this.entityDefns = entityDefnSets.concatenateAll();

		this.actions.addLookupsByName();
		this.activityDefns.addLookupsByName();
		this.placeDefns.addLookupsByName();
		this.entityDefnGroups.addLookupsByName();
		this.entityDefns.addLookupsByName();

		var entityDefnsForItemDefns = this.entityDefns.filter(x => x.itemDefn() != null);
		this.itemDefns = entityDefnsForItemDefns.map(x => x.itemDefn());
		var itemDefnNamesAndDefns = this.itemDefns.map(x => [ x.name, x ]);
		this._itemDefnsByName = new Map(itemDefnNamesAndDefns);
	}

	itemDefnsByName()
	{
		return this._itemDefnsByName;
	}
}
