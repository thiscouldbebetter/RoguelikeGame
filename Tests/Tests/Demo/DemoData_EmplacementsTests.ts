
class DemoData_EmplacementsTests extends TestFixture
{
	constructor()
	{
		super(DemoData_EmplacementsTests.name);
	}

	// Setup.

	tests(): ( ()=>void )[]
	{
		var returnValues =
		[
			this.buildEntityDefnGroup
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

	buildEntityDefnGroup(): void
	{
		var demoData_Emplacements = new DemoData_Emplacements(null);

		var visualNone = new VisualNone();
		var visualGetByName = (visualName: string) => visualNone;

		var entityDefnGroup =
			demoData_Emplacements.buildEntityDefnGroup(visualGetByName);

		Assert.isNotNull(entityDefnGroup);

		var universe = this.universeBuild();
		var world = universe.world as World2;
		var place = world.places[0] as PlaceLevel;
		place.initialize(universe, world);
		var entityPlayer = place.player();

		var entityDefns = entityDefnGroup.entityDefns;

		entityDefns.forEach(entityDefnEmplacement =>
		{
			Assert.isNotNull(entityDefnEmplacement);

			var emplacement = entityDefnEmplacement.emplacement();

			emplacement.collide
			(
				universe, world, place, entityPlayer, entityDefnEmplacement
			);

			emplacement.use
			(
				universe, world, place, entityPlayer, entityDefnEmplacement
			);
		}); 
	}
}
