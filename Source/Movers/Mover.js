
function Mover(movesPerTurn)
{
	this.movesPerTurn = movesPerTurn;
}

{
	Mover.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var mover = entity.Mover;
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.Turnable == null)
		{
			entity.Turnable = new Turnable
			(
				function updateForTurn(universe, world, place, entity)
				{
					entity.Mover.movesThisTurn += entity.Mover.movesPerTurn;
					entity.Turnable.hasActedThisTurn = false;
				}
			);
		}
	};

	Mover.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var entityLoc = entity.Locatable.loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	};
}
