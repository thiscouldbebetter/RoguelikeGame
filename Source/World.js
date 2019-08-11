
function World(name, defn, venues, entityForPlayer)
{
	this.name = name;
	this.defn = defn;
	this.venues = venues;
	this.entityForPlayer = entityForPlayer;

	this.venues.addLookupsByName();

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
}

{
	World.prototype.update = function()
	{
		if (this.venueNext != null)
		{
			this.venueNext.initialize();

			this.venueCurrent = this.venueNext;

			this.venueNext = null;
		}

		this.venueCurrent.update();
	}
}
