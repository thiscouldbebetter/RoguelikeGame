
class Openable implements EntityProperty<Openable>
{
	isOpen: boolean;
	isLocked: boolean;

	constructor(isOpen: boolean, isLocked: boolean)
	{
		this.isOpen = isOpen;
		this.isLocked = isLocked;
	}

	// Clonable.

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

	// Equatable.
	equals(other: Openable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}
