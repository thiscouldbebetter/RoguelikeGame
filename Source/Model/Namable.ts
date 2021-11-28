
class Namable2 implements EntityProperty<Namable2>
{
	name: string;
	appearance: string;

	constructor(name: string, appearance: string)
	{
		this.name = name;
		this.appearance = appearance;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Namable2) { return this; }

	// Equatable.
	equals(other: Namable2) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
