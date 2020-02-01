
function World(name, defn, places, entityForPlayer, randomizer)
{
	this.name = name;
	this.defn = defn;
	this.places = places.addLookupsByName();
	this.entityForPlayer = entityForPlayer;
	this.randomizer = randomizer;

	if (this.entityForPlayer == null)
	{
		var place0 = this.places[0];
		var portal0 = place0.entitiesToSpawn[0]; // hack
		var portal0Pos = portal0.locatable.loc.pos.clone();

		var entityDefnPlayer = this.defn.entityDefns.Player;
		this.entityForPlayer = EntityHelper.new
		(
			entityDefnPlayer.name,
			entityDefnPlayer,
			[
				new Locatable
				(
					new Location(portal0Pos, null, place0.name)
				)
			]
		);
		this.entityForPlayer.demographics.rank = 1; // hack

		place0.entitiesToSpawn.insertElementAt(this.entityForPlayer, 0);
	}

	this.placeNext = this.places[this.entityForPlayer.locatable.loc.placeName];

	this.turnsSoFar = 0;

	this.idHelper = IDHelper.Instance();
	this.sightHelper = new SightHelper(new FieldOfView(8));
	this.timerTicksSoFar = 0;

	var itemDefns = this.defn.entityDefns.filter
	(
		x => x.itemDefn != null
	).map
	(
		x => x.itemDefn
	).addLookupsByName();

	this.defns =
	{
		"itemDefns" : itemDefns
	};
}

{
	World.new = function(universe)
	{
		var randomizer = RandomizerLCG.default();
		var visualsForTiles = [];
		var imageTileset = universe.mediaLibrary.imageGetByName("Tiles");
		var visualImageTileset = new VisualImageFromLibrary(imageTileset.name);
		var imageTilesetSizeInTiles = new Coords(40, 27);
		var tileSizeInPixels =
			imageTileset.sizeInPixels.clone().divide(imageTilesetSizeInTiles);
		var imageBuilder = new ImageBuilder(Color.Instances()._All);
		for (var y = 0; y < imageTilesetSizeInTiles.y; y++)
		{
			var visualsForTilesRow = [];

			for (var x = 0; x < imageTilesetSizeInTiles.x; x++)
			{
				var tilePosInTiles = new Coords(x, y);
				var tilePosInPixels =
					tilePosInTiles.clone().multiply(tileSizeInPixels);
				var imageTile = imageBuilder.copyRegionFromImage
				(
					imageTileset, tilePosInPixels, tileSizeInPixels
				);
				var visualTile = new VisualImageImmediate(imageTile);
				visualsForTilesRow.push(visualTile);
			}

			visualsForTiles.push(visualsForTilesRow);
		}

		var worldDefn = new DemoData(randomizer).buildWorldDefn
		(
			visualsForTiles
		);

		var places = worldDefn.buildPlaces
		(
			worldDefn,
			worldDefn.placeDefns,
			worldDefn.entityDefnGroups,
			[]
		);

		var world = new World
		(
			"World0",
			worldDefn,
			places,
			null, // entityForPlayer
			randomizer
		);

		return world;
	}

	World.prototype.draw = function()
	{
		// todo
	}

	World.prototype.initialize = function(universe)
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.initialize(universe, this);
		}
	}

	World.prototype.updateForTimerTick = function(universe)
	{
		if (this.placeNext != null)
		{
			this.placeNext.initialize(universe, this);

			this.placeCurrent = this.placeNext;

			this.placeNext = null;
		}

		this.placeCurrent.update(universe, this);

		this.timerTicksSoFar++;
	}

	// debugging

	World.prototype.logTicksPerSecond = function()
	{
		var reportingWindowInTicks = 10;
		if (this.timerTicksSoFar % reportingWindowInTicks == 0)
		{
			var now = new Date();

			if (this.timeReportingWindowStarted != null)
			{
				var reportingWindowInMilliseconds =
					now - this.timeReportingWindowStarted;
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
}
