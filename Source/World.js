
function World(name, defn, venues, entityForPlayer, randomizer, font)
{
	this.name = name;
	this.defn = defn;
	this.venues = venues.addLookupsByName();
	this.entityForPlayer = entityForPlayer;
	this.randomizer = randomizer;
	this.font = font;

	if (this.entityForPlayer == null)
	{
		var venue0 = this.venues[0];
		var portal0 = venue0.entitiesToSpawn[0]; // hack

		this.entityForPlayer = new Entity
		(
			"Player",
			this.defn.entityDefns["Player"].name,
			portal0.loc.posInCells.clone()
		);

		this.entityForPlayer.loc.venueName = venue0.name;

		venue0.entitiesToSpawn.splice(0, 0, this.entityForPlayer);
	}

	this.venueNext = this.venues[this.entityForPlayer.loc.venueName];

	this.turnsSoFar = 0;

	this.idHelper = new IDHelper();
	this.sightHelper = new SightHelper();
	this.timerTicksSoFar = 0;
}

{
	World.new = function(universe)
	{
		var randomizer = new RandomizerLCG
		(
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31), // modulus
			0.12345 // firstRandom
		);

		var visualsForTiles = [];
		var imageTileset = universe.mediaLibrary.imageGetByName("Tiles");
		var visualImageTileset = new VisualImageFromLibrary(imageTileset.name);
		var imageTilesetSizeInTiles = new Coords(40, 27);
		var tileSizeInPixels =
			imageTileset.sizeInPixels.clone().divide(imageTilesetSizeInTiles);
		var imageHelper = new ImageHelper();
		for (var y = 0; y < imageTilesetSizeInTiles.y; y++)
		{
			var visualsForTilesRow = [];

			for (var x = 0; x < imageTilesetSizeInTiles.x; x++)
			{
				var tilePosInTiles = new Coords(x, y);
				var tilePosInPixels =
					tilePosInTiles.clone().multiply(tileSizeInPixels);
				var imageTile = imageHelper.copyRegionFromImage
				(
					imageTileset, tilePosInPixels, tileSizeInPixels
				);
				var visualTile = new VisualImageImmediate(imageTile);
				/*
				var visualTile = new VisualImagePartial
				(
					visualImageTileset,
					Bounds.fromMinAndSize(tilePosInPixels, tileSizeInPixels)
				);
				*/
				//var visualTile = new VisualRectangle(tileSizeInPixels, null, "Violet");
				visualsForTilesRow.push(visualTile);
			}

			visualsForTiles.push(visualsForTilesRow);
		}

		var worldDefn = new DemoData(randomizer).buildWorldDefn
		(
			visualsForTiles
		);

		var venues = worldDefn.buildVenues
		(
			worldDefn,
			worldDefn.venueDefns,
			worldDefn.entityDefnGroups,
			[]
		);

		var world = new World
		(
			"World0",
			worldDefn,
			venues,
			null, // entityForPlayer
			randomizer,
			new DemoData().buildFont()
		);

		return world;
	}

	World.prototype.draw = function()
	{
		// todo
	}

	World.prototype.initialize = function()
	{
		// Do nothing.
	}

	World.prototype.updateForTimerTick = function(universe)
	{
		if (this.venueNext != null)
		{
			this.venueNext.initialize(universe, this);

			this.venueCurrent = this.venueNext;

			this.venueNext = null;
		}

		this.venueCurrent.update(universe, this);

		this.timerTicksSoFar++;

//this.logTicksPerSecond();
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
