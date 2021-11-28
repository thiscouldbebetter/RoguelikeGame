"use strict";
class Portal2 {
    constructor(destinationPlaceName, destinationEntityName) {
        this.destinationPlaceName = destinationPlaceName;
        this.destinationEntityName = destinationEntityName;
    }
    static create() {
        return new Portal2(null, null);
    }
    use(uwpe) {
        var world = uwpe.world;
        var entityActor = uwpe.entity;
        var entityPortal = uwpe.entity2;
        var portal = entityPortal.portal2();
        var destinationPlaceName = portal.destinationPlaceName;
        var destinationEntityName = portal.destinationEntityName;
        var destinationPlace = world.placesByName.get(destinationPlaceName);
        if (destinationPlace != null) {
            destinationPlace.updateForTimerTick(uwpe.clone().placeSet(destinationPlace));
            var entitiesByName = destinationPlace.entitiesByName;
            var destinationEntity = entitiesByName.get(destinationEntityName);
            if (destinationEntity != null) {
                var destinationLoc = destinationEntity.locatable().loc;
                destinationLoc.placeName = destinationPlaceName; // hack - Set on spawn, not spawned until venue visited.
                var transport = new MoverTransport(entityActor, destinationLoc);
                var entityForTransport = new Entity2(entityActor.name + "_Transport", [transport]);
                destinationPlace.entitiesToSpawn.push(entityForTransport);
                world.placeNext = destinationPlace;
            }
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
