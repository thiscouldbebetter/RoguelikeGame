
class Generatable implements EntityProperty<Generatable>
{
	relativeFrequency: number;

	constructor(relativeFrequency: number)
	{
		this.relativeFrequency = relativeFrequency;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }

	// Equatable.
	equals(other: Generatable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
