
function Portal(destinationVenueName, destinationEntityName)
{
	this.destinationVenueName = destinationVenueName;
	this.destinationEntityName = destinationEntityName;
}
{
	Portal.prototype.use = function(universe, world, place, entityActor, entityPortal)
	{
		var portal = entityPortal.Portal;
		var destinationVenueName = portal.destinationVenueName;
		var destinationEntityName = portal.destinationEntityName;

		var destinationVenue = world.places[destinationVenueName];
		if (destinationVenue != null)
		{
			//destinationVenue.initialize(universe, world);
			destinationVenue.update(universe, world);

			var entities = destinationVenue.entities;
			var destinationEntity = entities[destinationEntityName];
			if (destinationEntity != null)
			{
				var destinationLoc = destinationEntity.Locatable.loc;
				destinationLoc.placeName = destinationVenueName; // hack - Set on spawn, not spawned until venue visited.
				var transport = new MoverTransport(entityActor, destinationLoc);
				var entityForTransport = new Entity
				(
					entityActor.name + "_Transport", [ transport ]
				);
				destinationVenue.entitiesToSpawn.push(entityForTransport);
				world.placeNext = destinationVenue;
			}
		}
	};
}
