
class Generatable implements EntityProperty
{
	relativeFrequency: number;

	constructor(relativeFrequency: number)
	{
		this.relativeFrequency = relativeFrequency;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
