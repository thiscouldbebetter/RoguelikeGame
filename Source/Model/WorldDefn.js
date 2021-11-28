"use strict";
class WorldDefn2 extends WorldDefn {
    constructor(name, actions, actionMovesByHeading, activityDefns, itemCategories, entityDefnGroups, spells, placeDefns, placeTree, buildPlaces) {
        super(actions, activityDefns, null, null, placeDefns, null);
        this.name = name;
        this.actionMovesByHeading = actionMovesByHeading;
        this.itemCategories = itemCategories;
        this.entityDefnGroups = entityDefnGroups;
        this.spells = spells;
        this.placeTree = placeTree;
        this.buildPlaces = buildPlaces;
        this.entityDefnGroupsByName =
            ArrayHelper.addLookupsByName(this.entityDefnGroups);
        var entityDefnSets = this.entityDefnGroups.map((x) => x.entityDefns);
        this.entityDefns = ArrayHelper.flattenArrayOfArrays(entityDefnSets);
        this.entityDefnsByName =
            ArrayHelper.addLookupsByName(this.entityDefns);
        this.entityDefnGroupsByName =
            ArrayHelper.addLookupsByName(this.entityDefnGroups);
        var entityDefnsForItemDefns = this.entityDefns.filter((x) => (x.itemDefn() != null));
        this.itemDefns = entityDefnsForItemDefns.map((x) => x.itemDefn());
        this.itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
        this.spellsByName = ArrayHelper.addLookupsByName(this.spells);
    }
}
