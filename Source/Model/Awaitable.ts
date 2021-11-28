
class Awaitable implements EntityProperty<Awaitable>
{
	isDone: boolean;

	constructor()
	{
		this.isDone = false;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Awaitable) { return this; }

	// Equatable.
	equals(other: Awaitable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
