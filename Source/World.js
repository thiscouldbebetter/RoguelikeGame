
function World(name, defn, venues, entityForPlayer, randomizer, font, millisecondsPerTick, display)
{
	this.name = name;
	this.defn = defn;
	this.venues = venues.addLookupsByName();
	this.entityForPlayer = entityForPlayer;
	this.randomizer = randomizer;
	this.font = font;
	this.millisecondsPerTick = millisecondsPerTick;
	this.display = display;

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

	this.collisionHelper = new CollisionHelper();
	this.idHelper = new IDHelper();
	this.platformHelper = new PlatformHelper();
	this.sightHelper = new SightHelper();
	this.inputHelper = new InputHelper();
}

{
	World.prototype.initialize = function()
	{
		this.display.initialize(this);

		this.platformHelper.initialize(this);
		this.platformHelper.platformableAdd(this.display);

		this.inputHelper.initialize(this);

		this.timer = setInterval
		(
			this.update.bind(this),
			this.millisecondsPerTick
		);
	}

	World.prototype.update = function()
	{
		if (this.venueNext != null)
		{
			this.venueNext.initialize(this);

			this.venueCurrent = this.venueNext;

			this.venueNext = null;
		}

		this.venueCurrent.update(this);
	}
}
