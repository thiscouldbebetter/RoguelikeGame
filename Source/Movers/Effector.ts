
class Effector implements EntityProperty<Effector>
{
	effects: Effect2[];

	constructor(effects: Effect2[])
	{
		this.effects = effects || [];
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Effector) { return this; }

	// Equatable.
	equals(other: Effector) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}
