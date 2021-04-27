
class Cursable implements EntityProperty
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

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
