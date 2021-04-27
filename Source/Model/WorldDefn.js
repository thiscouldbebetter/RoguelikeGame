"use strict";
class WorldDefn2 extends WorldDefn {
    constructor(name, actions, actionMovesByHeading, activityDefns, itemCategories, entityDefnGroups, spells, placeDefns, placeTree, buildPlaces) {
        super([placeDefns]);
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
        var entityDefnSets = this.entityDefnGroups.map((x) => x.entityDefns);
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
        var entityDefnsForItemDefns = this.entityDefns.filter((x) => (x.itemDefn() != null));
        this.itemDefns = entityDefnsForItemDefns.map((x) => x.itemDefn());
        this._itemDefnsByName = ArrayHelper.addLookupsByName(this.itemDefns);
        this.spellsByName = ArrayHelper.addLookupsByName(this.spells);
    }
    activityDefnByName(defnName) {
        return this.activityDefnsByName.get(defnName);
    }
    entityDefnByName(defnName) {
        return this.entityDefnsByName.get(defnName);
    }
    itemDefnByName(itemDefnName) {
        return this._itemDefnsByName.get(itemDefnName);
    }
    itemDefnsByName() {
        return this._itemDefnsByName;
    }
    placeDefnsByName() {
        return this.placeDefn2sByName;
    }
}
