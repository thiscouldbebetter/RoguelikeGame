
class Armored implements EntityProperty<Armored>
{
	armorClassCalculate(u: Universe, w: World, p: Place, e: Entity)
	{
		return 10; // todo
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Armored) { return this; }

	// Equatable.
	equals(other: Armored) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
