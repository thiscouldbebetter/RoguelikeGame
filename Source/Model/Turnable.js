
class Turnable
{
	constructor(updateForTurn)
	{
		this.updateForTurn = updateForTurn;
		this.hasActedThisTurn = false;
	}

	clone()
	{
		return new Turnable(this.updateForTurn);
	}
}
