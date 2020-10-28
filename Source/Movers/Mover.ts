
class Mover extends EntityProperty
{
	movesPerTurn: number;

	movesThisTurn: number;

	constructor(movesPerTurn: number)
	{
		super();
		this.movesPerTurn = movesPerTurn;
	}

	initialize(universe: Universe, world: World, place: Place, entityAsEntity: Entity)
	{
		var entity = entityAsEntity as Entity2;

		var mover = entity.mover();
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.turnable() == null)
		{
			var turnable = new Turnable
			(
				(universe: Universe, world: World, place: Place, entityAsEntity: Entity) =>
				{
					var entity = entityAsEntity as Entity2;

					var mover = entity.mover();
					mover.movesThisTurn += mover.movesPerTurn;
					var effectable = entity.effectable2();
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

	updateForTimerTick(universe: Universe, world: World, placeAsPlace: Place, entity: Entity)
	{
		var place = placeAsPlace as PlaceLevel;

		var entityLoc = entity.locatable().loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Mover) { return this; }
}
