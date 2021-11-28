
class Mover implements EntityProperty<Mover>
{
	movesPerTurn: number;
	_costToTraverseTerrain: (terrain: MapTerrain)=>number;

	movesThisTurn: number;

	constructor
	(
		movesPerTurn: number,
		costToTraverseTerrain: (terrain: MapTerrain)=>number
	)
	{
		this.movesPerTurn = movesPerTurn;
		this._costToTraverseTerrain = costToTraverseTerrain;
	}

	static fromMovesPerTurn(movesPerTurn: number): Mover
	{
		return new Mover(movesPerTurn, null);
	}

	costToTraverseTerrain(terrainToTraverse: MapTerrain): number
	{
		var returnValue: number;

		if (this._costToTraverseTerrain == null)
		{
			returnValue = terrainToTraverse.costToTraverse;
		}
		else
		{
			returnValue = this._costToTraverseTerrain(terrainToTraverse);
		}

		return returnValue;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		var entity = uwpe.entity as Entity2;

		var mover = entity.mover();
		mover.movesThisTurn = mover.movesPerTurn;

		if (entity.turnable() == null)
		{
			var turnable = new Turnable
			(
				(uwpe: UniverseWorldPlaceEntities) =>
				{
					var entity = uwpe.entity as Entity2;

					var mover = entity.mover();
					mover.movesThisTurn += mover.movesPerTurn;
					var effectable = entity.effectable2();
					if (effectable != null)
					{
						effectable.updateForTurn(uwpe);
					}
					entity.turnable().hasActedThisTurn = false;
				}
			);
			entity.propertyAddForPlace(turnable, place);
		}
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place as PlaceLevel;
		var entity = uwpe.entity;

		var entityLoc = entity.locatable().loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	}

	// Clonable.

	clone(): Mover { return this; }
	overwriteWith(other: Mover): Mover { return this; }

	// Equatable.
	equals(other: Mover) { return false; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

}
