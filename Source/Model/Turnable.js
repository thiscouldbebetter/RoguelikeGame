
function Turnable(updateForTurn)
{
	this.updateForTurn = updateForTurn;
	this.hasActedThisTurn = false;
}
{
	Turnable.prototype.clone = function()
	{
		return new Turnable(this.updateForTurn);
	};
}
