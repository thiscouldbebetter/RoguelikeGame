
function Mover(movesPerTurn)
{
	this.movesPerTurn = movesPerTurn;
}

{
	Mover.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var mover = entity.mover;
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.turnable == null)
		{
			entity.turnable = new Turnable
			(
				function updateForTurn(universe, world, place, entity)
				{
					entity.mover.movesThisTurn += entity.mover.movesPerTurn;
					if (entity.effectable != null)
					{
						entity.effectable.updateForTurn(universe, world, place, entity);
					}
					entity.turnable.hasActedThisTurn = false;
				}
			);
		}
	};

	Mover.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var entityLoc = entity.locatable.loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	};
}
