"use strict";
class WorldDefn2 extends WorldDefn {
    constructor(name, actions, actionMovesByHeading, activityDefns, itemCategories, entityDefnGroups, placeDefns, placeTree, buildPlaces) {
        super([placeDefns]);
        this.name = name;
        this.actions = actions;
        this.actionMovesByHeading = actionMovesByHeading;
        this.activityDefns = activityDefns;
        this.itemCategories = itemCategories;
        this.entityDefnGroups = entityDefnGroups;
        this.placeDefns = placeDefns;
        this.placeTree = placeTree;
        this.buildPlaces = buildPlaces;
        this.entityDefnGroupsByName =
            ArrayHelper.addLookupsByName(this.entityDefnGroups);
        var entityDefnSets = this.entityDefnGroups.map((x) => x.entityDefns);
        this.entityDefns = ArrayHelper.concatenateAll(entityDefnSets);
        this.entityDefnsByName = () => ArrayHelper.addLookupsByName(this.entityDefns);
        this.actionsByName =
            ArrayHelper.addLookupsByName(this.actions);
        this.activityDefn2sByName =
            ArrayHelper.addLookupsByName(this.activityDefns);
        this.placeDefn2sByName =
            ArrayHelper.addLookupsByName(this.placeDefns);
        this.entityDefnGroupsByName =
            ArrayHelper.addLookupsByName(this.entityDefnGroups);
        /*
        this.entityDefnsByName =
            ArrayHelper.addLookupsByName(this.entityDefns);
        */
        var entityDefnsForItemDefns = this.entityDefns.filter((x) => (x.itemDefn() != null));
        this.itemDefns = entityDefnsForItemDefns.map((x) => x.itemDefn());
        /*
        var itemDefnNamesAndDefns = this.itemDefns.map
        (
            (x: ItemDefn) => [ x.name, x ]
        );
        this._itemDefnsByName = new Map<string,ItemDefn>(itemDefnNamesAndDefns);
        */
        this._itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
    }
    itemDefnsByName() {
        return this._itemDefnsByName;
    }
    placeDefnsByName() {
        return this.placeDefn2sByName;
    }
}
