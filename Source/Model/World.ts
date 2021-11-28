
class World2 extends World
{
	name: string;
	defn2: WorldDefn2;
	places: Place[];
	entityForPlayer: Entity2;
	randomizer: Randomizer;

	//defns: Map<string, Map<string, Entity> >;
	idHelper: IDHelper;
	placesByName: Map<string, Place>;
	placeCurrent: Place;
	placeNext: Place;
	sightHelper: SightHelper;
	timeReportingWindowStarted: Date;
	timerTicksSoFar: number;
	turnsSoFar: number;

	constructor
	(
		name: string, defn: WorldDefn2, places: Place[],
		entityForPlayer: Entity2, randomizer: Randomizer
	)
	{
		super(name, null, defn, places);

		this.defn2 = defn;

		this.entityForPlayer = entityForPlayer;
		this.randomizer = randomizer;

		this.placesByName = ArrayHelper.addLookupsByName(this.places);

		if (this.entityForPlayer == null)
		{
			var place0 = this.places[0];
			var portal0 = place0.entitiesToSpawn[0]; // hack
			var portal0Pos = portal0.locatable().loc.pos.clone();

			var entityDefnPlayer = this.defn2.entityDefnByName("Player") as Entity2;
			this.entityForPlayer = Entity2.fromNameDefnAndProperties
			(
				entityDefnPlayer.name,
				entityDefnPlayer,
				[
					new Locatable
					(
						new Disposition(portal0Pos, null, place0.name)
					)
				]
			) as Entity2;
			this.entityForPlayer.demographics().rank = 1; // hack

			ArrayHelper.insertElementAt(place0.entitiesToSpawn, this.entityForPlayer, 0);
		}

		this.placeNext = this.placesByName.get
		(
			this.entityForPlayer.locatable().loc.placeName
		);

		this.turnsSoFar = 0;

		this.idHelper = IDHelper.Instance();
		this.sightHelper = new SightHelper(8);
		this.timerTicksSoFar = 0;

		/*
		var itemDefns = this.defn2.entityDefns.filter
		(
			(x: Entity) => x.itemDefn() != null
		).map
		(
			(x: Entity) => x.itemDefn()
		);

		var itemDefnsByName = ArrayHelper.addLookupsByName(itemDefns);

		this.defns = new Map<string, Map<string, Entity> >
		([
			[ "itemDefns", itemDefnsByName ]
		]);
		*/
	}

	static create(universe: Universe): World2
	{
		var visualsForTiles = World2.visualsForTiles(universe);

		var agentDatas = DemoData_Movers.buildAgentDatas();

		var visualsByName = DemoData_Visuals.visualArraysToLookup
		(
			visualsForTiles, agentDatas
		);

		var visualGetByName =
			(visualName: string) => visualsByName.get(visualName);

		var returnValue = World2.createForUniverseAndVisualGetByName
		(
			universe, visualGetByName
		);
		return returnValue;
	}

	static createForUniverseAndVisualGetByName
	(
		universe: Universe, visualGetByName: (x:string)=>VisualBase
	): World2
	{
		var randomizer = RandomizerLCG.default();

		var worldDefn = new DemoData_Main(randomizer).buildWorldDefn
		(
			universe, visualGetByName
		);

		var places = worldDefn.buildPlaces
		(
			worldDefn
		);

		var world = new World2
		(
			"WorldGame",
			worldDefn,
			places,
			null, // entityForPlayer
			randomizer
		);

		return world;
	}

	static visualsForTiles(universe: Universe): VisualBase[][]
	{
		var visualsForTiles = new Array<Array<VisualBase>>();
		var imageTileset = universe.mediaLibrary.imageGetByName("Tiles");
		//var visualImageTileset = new VisualImageFromLibrary(imageTileset.name);
		// var tileSize = Coords.fromXY(16, 16);
		var imageTilesetSizeInTiles = Coords.fromXY(40, 27);
		var tileSizeInPixels =
			imageTileset.sizeInPixels.clone().divide(imageTilesetSizeInTiles);
		var imageBuilder = ImageBuilder.default();
		for (var y = 0; y < imageTilesetSizeInTiles.y; y++)
		{
			var visualsForTilesRow = new Array<VisualBase>();

			for (var x = 0; x < imageTilesetSizeInTiles.x; x++)
			{
				var tilePosInTiles = Coords.fromXY(x, y);
				var tilePosInPixels =
					tilePosInTiles.clone().multiply(tileSizeInPixels);
				var imageTile = imageBuilder.copyRegionFromImage
				(
					imageTileset, tilePosInPixels, tileSizeInPixels
				);
				var visualTile = new VisualImageImmediate(imageTile, null);
				visualsForTilesRow.push(visualTile);
			}

			visualsForTiles.push(visualsForTilesRow);
		}

		return visualsForTiles;
	}

	draw(): void
	{
		// todo
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.placeCurrent != null)
		{
			uwpe.world = this;
			this.placeCurrent.initialize(uwpe);
		}
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.world = this;

		if (this.placeNext != null)
		{
			this.placeNext.initialize(uwpe);

			this.placeCurrent = this.placeNext;

			this.placeNext = null;
		}

		this.placeCurrent.updateForTimerTick(uwpe);

		this.timerTicksSoFar++;
	}

	// debugging

	logTicksPerSecond(): void
	{
		var reportingWindowInTicks = 10;
		if (this.timerTicksSoFar % reportingWindowInTicks == 0)
		{
			var now = new Date();
			var nowAsTicks = now.getTime();

			if (this.timeReportingWindowStarted != null)
			{
				var reportingWindowInMilliseconds =
					nowAsTicks - this.timeReportingWindowStarted.getTime();
				var reportingWindowInSeconds =
					reportingWindowInMilliseconds / 1000;
				var ticksPerSecond = Math.floor
				(
					reportingWindowInTicks / reportingWindowInSeconds
				);
				console.log(ticksPerSecond + " cps");
			}

			this.timeReportingWindowStarted = now;
		}
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}
}
