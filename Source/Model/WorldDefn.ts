
class WorldDefn2 extends WorldDefn
{
	name: string;
	actions: Action[];
	actionMovesByHeading: Action[];
	activityDefns: ActivityDefn[];
	itemCategories: ItemCategory[];
	entityDefnGroups: EntityDefnGroup[];
	spells: Spell[];
	placeDefns: PlaceDefn2[];
	placeTree: PlaceBranch;
	buildPlaces: (worldDefn: WorldDefn2) => PlaceLevel[];

	actionsByName: Map<string, Action>;
	activityDefnsByName: Map<string, ActivityDefn>;
	entityDefns: Entity[];
	entityDefnsByName: Map<string, Entity>;
	entityDefnGroupsByName: Map<string, EntityDefnGroup>;
	spellsByName: Map<string, Spell>;
	itemCategoriesByName: Map<string, ItemCategory>;
	itemDefns: ItemDefn[];
	placeDefn2sByName: Map<string, PlaceDefn2>;
	_itemDefnsByName: Map<string, ItemDefn>;

	constructor
	(
		name: string,
		actions: Action[],
		actionMovesByHeading: Action[],
		activityDefns: ActivityDefn[],
		itemCategories: ItemCategory[],
		entityDefnGroups: EntityDefnGroup[],
		spells: Spell[],
		placeDefns: PlaceDefn2[],
		placeTree: PlaceBranch,
		buildPlaces: any
	)
	{
		super( [ placeDefns ] );
		this.name = name;
		this.actions = actions;
		this.actionMovesByHeading = actionMovesByHeading;
		this.activityDefns = activityDefns;
		this.itemCategories = itemCategories;
		this.entityDefnGroups = entityDefnGroups;
		this.spells = spells;
		this.placeDefns = placeDefns;
		this.placeTree = placeTree;
		this.buildPlaces = buildPlaces;

		this.entityDefnGroupsByName =
			ArrayHelper.addLookupsByName(this.entityDefnGroups);

		var entityDefnSets = this.entityDefnGroups.map
		(
			(x: EntityDefnGroup) => x.entityDefns
		);

		this.entityDefns = ArrayHelper.concatenateAll(entityDefnSets);
		this.entityDefnsByName = ArrayHelper.addLookupsByName(this.entityDefns);

		this.actionsByName =
			ArrayHelper.addLookupsByName(this.actions);
		this.activityDefnsByName =
			ArrayHelper.addLookupsByName(this.activityDefns);
		this.placeDefn2sByName =
			ArrayHelper.addLookupsByName(this.placeDefns);
		this.entityDefnGroupsByName =
			ArrayHelper.addLookupsByName(this.entityDefnGroups);

		var entityDefnsForItemDefns = this.entityDefns.filter
		(
			(x: Entity) => (x.itemDefn() != null)
		);
		this.itemDefns = entityDefnsForItemDefns.map
		(
			(x: Entity) => x.itemDefn()
		);
		this._itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);

		this.spellsByName = ArrayHelper.addLookupsByName(this.spells);
	}

	activityDefnByName(defnName: string): ActivityDefn
	{
		return this.activityDefnsByName.get(defnName);
	}

	entityDefnByName(defnName: string): Entity
	{
		return this.entityDefnsByName.get(defnName);
	}

	itemDefnByName(itemDefnName: string): ItemDefn
	{
		return this._itemDefnsByName.get(itemDefnName);
	}

	itemDefnsByName(): Map<string, ItemDefn>
	{
		return this._itemDefnsByName;
	}

	placeDefnsByName(): Map<string, PlaceDefn2>
	{
		return this.placeDefn2sByName;
	}
}
