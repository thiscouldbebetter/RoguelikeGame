
function Portal(destinationPlaceName, destinationEntityName)
{
	this.destinationPlaceName = destinationPlaceName;
	this.destinationEntityName = destinationEntityName;
}
{
	Portal.prototype.use = function(universe, world, place, entityActor, entityPortal)
	{
		var portal = entityPortal.portal;
		var destinationPlaceName = portal.destinationPlaceName;
		var destinationEntityName = portal.destinationEntityName;

		var destinationPlace = world.places[destinationPlaceName];
		if (destinationPlace != null)
		{
			destinationPlace.update(universe, world);

			var entities = destinationPlace.entities;
			var destinationEntity = entities[destinationEntityName];
			if (destinationEntity != null)
			{
				var destinationLoc = destinationEntity.locatable.loc;
				destinationLoc.placeName = destinationPlaceName; // hack - Set on spawn, not spawned until venue visited.
				var transport = new MoverTransport(entityActor, destinationLoc);
				var entityForTransport = new Entity
				(
					entityActor.name + "_Transport", [ transport ]
				);
				destinationPlace.entitiesToSpawn.push(entityForTransport);
				world.placeNext = destinationPlace;
			}
		}
	};
}
