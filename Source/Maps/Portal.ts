
class Portal2 implements EntityProperty<Portal2>
{
	destinationPlaceName: string;
	destinationEntityName: string;

	constructor(destinationPlaceName: string, destinationEntityName: string)
	{
		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
	}

	static create(): Portal2
	{
		return new Portal2(null, null);
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		var world = uwpe.world;
		var entityActor = uwpe.entity as Entity2;
		var entityPortal = uwpe.entity2 as Entity2;

		var portal = entityPortal.portal2();
		var destinationPlaceName = portal.destinationPlaceName;
		var destinationEntityName = portal.destinationEntityName;

		var destinationPlace = world.placesByName.get(destinationPlaceName);
		if (destinationPlace != null)
		{
			destinationPlace.updateForTimerTick
			(
				uwpe.clone().placeSet(destinationPlace)
			);

			var entitiesByName = destinationPlace.entitiesByName;
			var destinationEntity = entitiesByName.get(destinationEntityName);
			if (destinationEntity != null)
			{
				var destinationLoc = destinationEntity.locatable().loc;
				destinationLoc.placeName = destinationPlaceName; // hack - Set on spawn, not spawned until venue visited.
				var transport = new MoverTransport(entityActor, destinationLoc);
				var entityForTransport = new Entity2
				(
					entityActor.name + "_Transport", [ transport ]
				);
				destinationPlace.entitiesToSpawn.push(entityForTransport);
				world.placeNext = destinationPlace;
			}
		}
	}

	// Clonable.
	clone(): Portal2 { return this; }
	overwriteWith(other: Portal2): Portal2 { return this; }

	// Equatable.
	equals(other: Portal2) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
