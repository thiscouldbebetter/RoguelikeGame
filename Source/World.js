
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
}

{
	World.new = function()
	{
		var randomizer = new RandomizerLCG
		(
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31), // modulus
			0.12345 // firstRandom
		);

		var visualsForTiles = [];
		var sizeInTiles = new Coords(40, 27);
		var tileSizeInPixels = new Coords(16, 16);
		for (var y = 0; y < sizeInTiles.y; y++)
		{
			var visualsForTilesRow = [];

			for (var x = 0; x < sizeInTiles.x; x++)
			{
				var tilePosInTiles = new Coords(x, y);
				var tilePosInPixels = tilePosInTiles.clone().multiply(tileSizeInPixels);

				var visualForTile =
					new VisualImagePartial
					(
						new VisualImageFromLibrary("Tiles"),
						Bounds.fromMinAndSize(tilePosInPixels, tileSizeInPixels) // todo
					);

				visualsForTilesRow.push(visualForTile);
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
	}
}
