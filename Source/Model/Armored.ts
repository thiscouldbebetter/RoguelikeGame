
class Armored implements EntityProperty
{
	armorClassCalculate(u: Universe, w: World, p: Place, e: Entity)
	{
		return 10; // todo
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Armored) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
