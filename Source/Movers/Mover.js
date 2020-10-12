
class Mover
{
	constructor(movesPerTurn)
	{
		this.movesPerTurn = movesPerTurn;
	}

	initializeEntityForPlace(universe, world, place, entity)
	{
		var mover = entity.mover();
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.turnable() == null)
		{
			var turnable = new Turnable
			(
				function updateForTurn(universe, world, place, entity)
				{
					var mover = entity.mover();
					mover.movesThisTurn += mover.movesPerTurn;
					var effectable = entity.effectable();
					if (effectable != null)
					{
						effectable.updateForTurn(universe, world, place, entity);
					}
					entity.turnable().hasActedThisTurn = false;
				}
			);
			entity.propertyAddForPlace(turnable, place);
		}
	}

	updateForTimerTick(universe, world, place, entity)
	{
		var entityLoc = entity.locatable().loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	}
}
