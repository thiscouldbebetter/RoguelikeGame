
function Mover(movesPerTurn)
{
	this.movesPerTurn = movesPerTurn;
}

{
	Mover.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var mover = entity.mover();
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.turnable() == null)
		{
			var turnable = new Turnable
			(
				function updateForTurn(universe, world, place, entity)
				{
					entity.mover().movesThisTurn += entity.mover().movesPerTurn;
					if (entity.effectable() != null)
					{
						entity.effectable().updateForTurn(universe, world, place, entity);
					}
					entity.turnable().hasActedThisTurn = false;
				}
			);
			entity.propertiesByName.set(Turnable.name, turnable);
		}
	};

	Mover.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var entityLoc = entity.locatable().loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	};
}
