
class Portal2 implements EntityProperty
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

	use
	(
		universe: Universe, world: World, place: Place,
		entityActorAsEntity: Entity, entityPortalAsEntity: Entity
	): void
	{
		var entityActor = entityActorAsEntity as Entity2;
		var entityPortal = entityPortalAsEntity as Entity2;

		var portal = entityPortal.portal2();
		var destinationPlaceName = portal.destinationPlaceName;
		var destinationEntityName = portal.destinationEntityName;

		var destinationPlace = world.placesByName.get(destinationPlaceName);
		if (destinationPlace != null)
		{
			destinationPlace.updateForTimerTick(universe, world);

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

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
