
class Cursable implements EntityProperty<Cursable>
{
	blessingLevel: number;

	constructor(blessingLevel: number)
	{
		this.blessingLevel = blessingLevel;
	}

	bless()
	{
		if (this.isBlessed() == false)
		{
			this.blessingLevel++;
		}
	}

	curse()
	{
		if (this.isCursed() == false)
		{
			this.blessingLevel--;
		}
	}

	isBlessed()
	{
		return (this.blessingLevel > 0);
	}

	isCursed()
	{
		return (this.blessingLevel < 0);
	}

	// Clonable.

	clone()
	{
		return new Cursable(this.blessingLevel);
	}

	overwriteWith(other: Cursable)
	{
		this.blessingLevel = other.blessingLevel;
		return this;
	}

	// Equatable.
	equals(other: Cursable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
