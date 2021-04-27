
class Effector implements EntityProperty
{
	effects: Effect2[];

	constructor(effects: Effect2[])
	{
		this.effects = effects || [];
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Effector) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}
