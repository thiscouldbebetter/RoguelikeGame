
class Turnable extends EntityProperty
{
	updateForTurn: any;
	hasActedThisTurn: boolean;

	turnsToLive: number;

	constructor(updateForTurn: any)
	{
		super();
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
}
