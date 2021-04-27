
class Openable implements EntityProperty
{
	isOpen: boolean;
	isLocked: boolean;

	constructor(isOpen: boolean, isLocked: boolean)
	{
		this.isOpen = isOpen;
		this.isLocked = isLocked;
	}

	clone()
	{
		return new Openable(this.isOpen, this.isLocked);
	}

	overwriteWith(other: Openable)
	{
		this.isOpen = other.isOpen;
		this.isLocked = other.isLocked;
		return this;
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}
