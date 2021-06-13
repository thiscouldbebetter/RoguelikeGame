
class Mover implements EntityProperty
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

	initialize
	(
		universe: Universe, world: World, place: Place, entityAsEntity: Entity
	): void
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

	updateForTimerTick
	(
		universe: Universe, world: World, placeAsPlace: Place, entity: Entity
	): void
	{
		var place = placeAsPlace as PlaceLevel;

		var entityLoc = entity.locatable().loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	}

	// Clonable.

	clone(): Mover { return this; }
	overwriteWith(other: Mover): Mover { return this; }

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}

}
