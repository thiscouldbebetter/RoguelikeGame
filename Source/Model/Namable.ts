
class Namable2 implements EntityProperty
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

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
