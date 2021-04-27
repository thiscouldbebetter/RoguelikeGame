
class Awaitable implements EntityProperty
{
	isDone: boolean;

	constructor()
	{
		this.isDone = false;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Awaitable) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
