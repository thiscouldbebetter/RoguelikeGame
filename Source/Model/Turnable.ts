
class Turnable implements EntityProperty
{
	updateForTurn: any;
	hasActedThisTurn: boolean;

	turnsToLive: number;

	constructor(updateForTurn: any)
	{
		this.updateForTurn = updateForTurn;
		this.hasActedThisTurn = false;
	}

	clone()
	{
		return new Turnable(this.updateForTurn);
	}

	overwriteWith(other: Turnable)
	{
		this.updateForTurn = other.updateForTurn;
		this.hasActedThisTurn = other.hasActedThisTurn;
		return this;
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
