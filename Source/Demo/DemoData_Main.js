"use strict";
class DemoData_Main {
    constructor(randomizer) {
        this.randomizer = randomizer;
        this.imageBuilder = ImageBuilder.default();
        this.demoDataActions = new DemoData_Actions(this);
        this.demoDataActivities = new DemoData_Activities(this, this.randomizer);
        this.demoDataEmplacements = new DemoData_Emplacements(this);
        this.demoDataItems = new DemoData_Items(this, this.randomizer);
        this.demoDataMovers = new DemoData_Movers(this);
        this.demoDataPlaces = new DemoData_Places(this);
        this.demoDataVisuals = new DemoData_Visuals(this);
    }
    buildEntityDefnGroups(universe, visualGetByName, activityDefns, itemCategories) {
        // entityDefns
        var boulders = this.buildEntityDefnGroup_Boulders(visualGetByName);
        var emplacements = this.demoDataEmplacements.buildEntityDefnGroup(visualGetByName);
        var talkers = this.buildEntityDefnGroup_Talkers(visualGetByName);
        var itemGroups = this.demoDataItems.buildEntityDefnGroups(universe, visualGetByName, itemCategories);
        var moverAndCorpseGroups = this.demoDataMovers.buildEntityDefnGroups_MoverGroupsAndCorpsesGroup(visualGetByName, activityDefns, itemCategories);
        var moverGroups = moverAndCorpseGroups[0];
        var corpseGroup = moverAndCorpseGroups[1];
        //var moverEntities = moverGroups[0].entityDefns;
        itemGroups.push(corpseGroup);
        var returnValues = ArrayHelper.concatenateAll([
            [boulders],
            [emplacements],
            [talkers],
            itemGroups,
            moverGroups
        ]);
        return returnValues;
    }
    buildEntityDefnGroup_Boulders(visualGetByName) {
        var name = "Boulder";
        var mappableDefns = MappableDefn.Instances();
        var mappableDefn = mappableDefns.Blocking;
        var damager = new Damager(Damage.fromAmount(10)); // todo
        var itemDefnToEntity = (u, w, p, e, i) => {
            var itemDefn = i.defn(w);
            var returnValue = new Entity2(i.defnName, [
                i,
                e.locatable().clone(),
                new Mappable(mappableDefn),
                mappableDefn,
                damager,
                Drawable.fromVisual(itemDefn.visual),
            ]);
            return returnValue;
        };
        var visual = visualGetByName(name);
        var itemDefn = new ItemDefn(name, name, name, 1, // mass
        1, // tradeValue
        1, // stackSizeMax
        [Stone.name], // categoryNames
        null, visual, itemDefnToEntity);
        var entityDefns = [
            new Entity2(name, [
                mappableDefn,
                Drawable.fromVisual(visual),
                new Generatable(0),
                damager,
                itemDefn
            ])
        ];
        var returnValue = new EntityDefnGroup("Boulders", 0, // relativeFrequency
        entityDefns);
        return returnValue;
    }
    buildEntityDefnGroup_Talkers(visualGetByName) {
        var mappableDefns = MappableDefn.Instances();
        var mappableBlocking = mappableDefns.Blocking;
        var entityDefns = [
            new Entity2("Mentor", [
                mappableBlocking,
                Drawable.fromVisual(visualGetByName("Aligned Priest")),
                new ItemHolder([
                    new Item("Coins", 5)
                ], // itemEntities
                100, // massMax
                0 // reachRadius
                ),
                new Talker("Talk_Mentor"),
                new Generatable(0)
            ])
        ];
        var returnValue = new EntityDefnGroup("Talkers", 0, // relativeFrequency
        entityDefns);
        return returnValue;
    }
    buildWorldDefn(universe, visualGetByName) {
        var actionsAndActionMovesByHeading = this.demoDataActions.actionsBuild();
        var actions = actionsAndActionMovesByHeading[0];
        var actionMovesByHeading = actionsAndActionMovesByHeading[1];
        var activityDefns = this.demoDataActivities.buildActivityDefns();
        var activityDefnsByName = ArrayHelper.addLookupsByName(activityDefns);
        var itemCategories = this.demoDataItems.buildItemCategories();
        var entityDefnGroups = this.buildEntityDefnGroups(universe, visualGetByName, activityDefnsByName, itemCategories);
        var spells = Spell.Instances()._All;
        var placeDefns = this.demoDataPlaces.buildPlaceDefns(visualGetByName, actions);
        var placeTree = this.demoDataPlaces.buildPlaceTree();
        var randomizer = this.randomizer;
        var returnValue = new WorldDefn2("WorldDefn0", actions, actionMovesByHeading, activityDefns, itemCategories, entityDefnGroups, spells, placeDefns, placeTree, (worldDefn) => // buildPlaces
         {
            var returnValues = placeTree.buildPlaces(worldDefn, randomizer, 0 // depthFirst
            );
            return returnValues;
        });
        return returnValue;
    }
}
