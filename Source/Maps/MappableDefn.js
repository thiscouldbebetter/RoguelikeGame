
class MappableDefn
{
	constructor(blocksMovement, blocksVision)
	{
		this.blocksMovement = blocksMovement;
		this.blocksVision = blocksVision;
	}

	static Instances()
	{
		if (MappableDefn._instances == null)
		{
			MappableDefn._instances = new MappableDefn_Instances();
		}
		return MappableDefn._instances;
	}

	// entity

	initializeEntityForPlace(universe, world, place, entity)
	{
		var mappable = new Mappable
		(
			entity.mappableDefn
		);

		var map = place.map;
		var entityPosInCells = entity.locatable.loc.pos;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		mappable.mapCellOccupied = mapCellOccupied;

		entity.mappable = mappable;
		entity.collidable = entity.mappable; // hack
	}

	updateForTimerTick(universe, world, place, entity)
	{
		// todo
	}

	// Cloneable.

	clone()
	{
		return this; // hack
	}
}

class MappableDefn_Instances
{
	constructor()
	{
		this.Blocking = new MappableDefn(() => true, () => true);
		this.Concealing = new MappableDefn(() => false, () => true);
		this.Open = new MappableDefn(() => false, () => false);
		this.Transparent = new MappableDefn(() => true, () => false);
	}
}
