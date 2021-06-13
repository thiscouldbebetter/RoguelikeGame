
class DemoData_ItemsTests extends TestFixture
{
	constructor()
	{
		super(DemoData_ItemsTests.name);
	}

	// Setup.

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.buildEntityDefnGroups
		];

		return returnValues;
	}

	universeBuild(): Universe
	{
		var timerHelper = new TimerHelper(0);
		var display = DisplayTest.default();
		var mediaLibrary = MediaLibrary.default();
		var controlBuilder = ControlBuilder.default();
		var tileSize = Coords.fromXY(16, 16);
		var visualMock = new VisualImageMock(tileSize);
		var visualGetByName = (visualName: string) => visualMock;

		var universe = new Universe
		(
			"TestUniverse",
			"[version]",
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			(u: Universe) =>
				World2.createForUniverseAndVisualGetByName(u, visualGetByName)
		);

		universe.initialize(() => {});
		universe.worldCreate().initialize(universe);

		return universe;
	}

	// Tests.

	buildEntityDefnGroups(): void
	{
		var universe = this.universeBuild();
		var world = universe.world as World2;
		var place = world.places[0] as PlaceLevel;
		place.initialize(universe, world);
		var entityPlayer = place.player();
		var playerItemHolder = entityPlayer.itemHolder();

		var demoData_Items = new DemoData_Items(null, universe.randomizer);

		var tileSize = Coords.fromXY(16, 16);
		var visualMock = new VisualImageMock(tileSize);
		var visualGetByName = (visualName: string) => visualMock;

		var itemCategories = demoData_Items.buildItemCategories();

		Assert.isNotNull(itemCategories);

		var entityDefnGroups = demoData_Items.buildEntityDefnGroups
		(
			universe, visualGetByName, itemCategories
		);

		Assert.isNotNull(entityDefnGroups);

		entityDefnGroups.forEach(entityDefnGroup =>
		{
			var entityDefnsInGroup = entityDefnGroup.entityDefns;

			entityDefnsInGroup.forEach(entityDefn =>
			{
				var itemDefn = entityDefn.itemDefn();
				var item = new Item(itemDefn.name, 1);
				playerItemHolder.itemAdd(item);
				var itemAsEntity =
					item.toEntity(universe, world, place, entityPlayer);
				item.use
				(
					universe, world, place, entityPlayer, itemAsEntity
				);
			});
		}); 
	}
}
