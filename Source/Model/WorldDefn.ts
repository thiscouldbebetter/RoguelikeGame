
class WorldDefn2 extends WorldDefn
{
	name: string;
	actionMovesByHeading: Action[];
	itemCategories: ItemCategory[];
	entityDefnGroups: EntityDefnGroup[];
	spells: Spell[];
	placeTree: PlaceBranch;
	buildPlaces: (worldDefn: WorldDefn2) => PlaceLevel[];

	entityDefns: Entity[];
	entityDefnsByName: Map<string, Entity>;
	entityDefnGroupsByName: Map<string, EntityDefnGroup>;
	spellsByName: Map<string, Spell>;
	itemCategoriesByName: Map<string, ItemCategory>;

	constructor
	(
		name: string,
		actions: Action[],
		actionMovesByHeading: Action[],
		activityDefns: ActivityDefn[],
		itemCategories: ItemCategory[],
		entityDefnGroups: EntityDefnGroup[],
		spells: Spell[],
		placeDefns: PlaceDefnLevel[],
		placeTree: PlaceBranch,
		buildPlaces: any
	)
	{
		super( actions, activityDefns, null, null, placeDefns, null);
		this.name = name;
		this.actionMovesByHeading = actionMovesByHeading;
		this.itemCategories = itemCategories;
		this.entityDefnGroups = entityDefnGroups;
		this.spells = spells;
		this.placeTree = placeTree;
		this.buildPlaces = buildPlaces;

		this.entityDefnGroupsByName =
			ArrayHelper.addLookupsByName(this.entityDefnGroups);

		var entityDefnSets = this.entityDefnGroups.map
		(
			(x: EntityDefnGroup) => x.entityDefns
		);

		this.entityDefns = ArrayHelper.flattenArrayOfArrays(entityDefnSets);
		this.entityDefnsByName =
			ArrayHelper.addLookupsByName(this.entityDefns);

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
		this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);

		this.spellsByName = ArrayHelper.addLookupsByName(this.spells);
	}
}
