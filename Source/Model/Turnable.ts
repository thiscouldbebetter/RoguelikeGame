
class Turnable implements EntityProperty<Turnable>
{
	updateForTurn: (uwpe: UniverseWorldPlaceEntities) => void;
	hasActedThisTurn: boolean;

	turnsToLive: number;

	constructor(updateForTurn: (uwpe: UniverseWorldPlaceEntities) => void)
	{
		this.updateForTurn = updateForTurn;
		this.hasActedThisTurn = false;
	}

	// Clonable.

	clone(): Turnable
	{
		return new Turnable(this.updateForTurn);
	}

	overwriteWith(other: Turnable): Turnable
	{
		this.updateForTurn = other.updateForTurn;
		this.hasActedThisTurn = other.hasActedThisTurn;
		return this;
	}

	// Equatable.
	equals(other: Turnable): boolean { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
