"use strict";
class DemoData_MoversTests extends TestFixture {
    constructor() {
        super(DemoData_MoversTests.name);
    }
    tests() {
        var returnValues = [
            this.buildEntityDefnGroups
        ];
        return returnValues;
    }
    universeBuild() {
        var timerHelper = new TimerHelper(0);
        var display = DisplayTest.default();
        var mediaLibrary = MediaLibrary.default();
        var controlBuilder = ControlBuilder.default();
        var tileSize = Coords.fromXY(16, 16);
        var visualMock = new VisualImageMock(tileSize);
        var visualGetByName = (visualName) => visualMock;
        var universe = new Universe("TestUniverse", "[version]", timerHelper, display, mediaLibrary, controlBuilder, (u) => World2.createForUniverseAndVisualGetByName(u, visualGetByName));
        universe.initialize(() => { });
        universe.worldCreate().initialize(universe);
        return universe;
    }
    // Tests.
    buildEntityDefnGroups() {
        var universe = this.universeBuild();
        var world = universe.world;
        var place = world.places[0];
        place.initialize(universe, world);
        var entityPlayer = place.player();
        var playerItemHolder = entityPlayer.itemHolder();
        var demoData_Movers = new DemoData_Movers(null);
        var demoData_Activities = new DemoData_Activities(null, universe.randomizer);
        var activityDefns = demoData_Activities.buildActivityDefns();
        var activityDefnsByName = ArrayHelper.addLookupsByName(activityDefns);
        var demoData_Items = new DemoData_Items(null, universe.randomizer);
        var itemCategories = demoData_Items.buildItemCategories();
        var tileSize = Coords.fromXY(16, 16);
        var visualMock = new VisualImageMock(tileSize);
        var visualGetByName = (visualName) => visualMock;
        Assert.isNotNull(itemCategories);
        var moverGroupsAndCorpsesGroup = demoData_Movers.buildEntityDefnGroups_MoverGroupsAndCorpsesGroup(visualGetByName, activityDefnsByName, itemCategories);
        Assert.isNotNull(moverGroupsAndCorpsesGroup);
        Assert.areEqual(2, moverGroupsAndCorpsesGroup.length);
        var entityDefnGroupsMovers = moverGroupsAndCorpsesGroup[0];
        var entityDefnGroupCorpses = moverGroupsAndCorpsesGroup[1];
        Assert.isNotNull(entityDefnGroupsMovers);
        Assert.isNotNull(entityDefnGroupCorpses);
        // Movers.
        var locatable = Locatable.fromPos(Coords.zeroes());
        entityDefnGroupsMovers.forEach(entityDefnGroup => {
            var entityDefnsMovers = entityDefnGroup.entityDefns;
            entityDefnsMovers.forEach(entityDefnMover => {
                entityDefnMover.propertyAdd(locatable);
                var mover = entityDefnMover.mover();
                mover.initialize(universe, world, place, entityDefnMover);
                mover.updateForTimerTick(universe, world, place, entityDefnMover);
            });
        });
        // Corpses.
        var entityDefnsCorpses = entityDefnGroupCorpses.entityDefns;
        entityDefnsCorpses.forEach(entityDefn => {
            var itemDefn = entityDefn.itemDefn();
            var item = new Item(itemDefn.name, 1);
            playerItemHolder.itemAdd(item);
            var itemAsEntity = item.toEntity(universe, world, place, entityPlayer);
            item.use(universe, world, place, entityPlayer, itemAsEntity);
        });
    }
}
