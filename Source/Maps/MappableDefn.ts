
class MappableDefn implements EntityProperty<MappableDefn>
{
	blocksMovement: (e:Entity2)=>boolean;
	blocksVision: (e:Entity2)=>boolean;

	constructor
	(
		blocksMovement: (e:Entity2) => boolean,
		blocksVision: (e:Entity2) => boolean
	)
	{
		this.blocksMovement = blocksMovement;
		this.blocksVision = blocksVision;
	}

	static _instances: MappableDefn_Instances;
	static Instances(): MappableDefn_Instances
	{
		if (MappableDefn._instances == null)
		{
			MappableDefn._instances = new MappableDefn_Instances();
		}
		return MappableDefn._instances;
	}

	// entity

	initialize
	(
		uwpe: UniverseWorldPlaceEntities
	)
	{
		var place = uwpe.place as PlaceLevel;
		var entity = uwpe.entity as Entity2;

		var mappable = new Mappable
		(
			entity.mappableDefn()
		);

		var map = place.map;
		var entityPosInCells = entity.locatable().loc.pos;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		mappable.mapCellOccupied = mapCellOccupied;

		entity.propertyAddForPlace(mappable, place);
		//entity.collidable = entity.mappable; // hack
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// todo
	}

	// Cloneable.

	clone(): MappableDefn
	{
		return this; // hack
	}

	overwriteWith(other: MappableDefn): MappableDefn
	{
		return this; // todo
	}

	// Equatable.
	equals(other: MappableDefn) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
}

class MappableDefn_Instances
{
	Blocking: MappableDefn;
	Concealing: MappableDefn;
	Open: MappableDefn;
	Transparent: MappableDefn;

	constructor()
	{
		this.Blocking = new MappableDefn((e: Entity2) => true, (e: Entity2) => true);
		this.Concealing = new MappableDefn((e: Entity2) => false, (e: Entity2) => true);
		this.Open = new MappableDefn((e: Entity2) => false, (e: Entity2) => false);
		this.Transparent = new MappableDefn((e: Entity2) => true, (e: Entity2) => false);
	}
}
