
function MappableDefn(blocksMovement, blocksVision)
{
	this.blocksMovement = blocksMovement;
	this.blocksVision = blocksVision;
}

{
	function MappableDefn_Instances()
	{
		this.Blocking = new MappableDefn(() => true, () => true);
		this.Concealing = new MappableDefn(() => false, () => true);
		this.Open = new MappableDefn(() => false, () => false);
		this.Transparent = new MappableDefn(() => true, () => false);
	}

	MappableDefn.Instances = function()
	{
		if (MappableDefn._instances == null)
		{
			MappableDefn._instances = new MappableDefn_Instances();
		}
		return MappableDefn._instances;
	};

	// entity

	MappableDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var mappable = new Mappable
		(
			entity.mappableDefn()
		);

		var map = place.map;
		var entityPosInCells = entity.locatable().loc.pos;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		mappable.mapCellOccupied = mapCellOccupied;

		entity.propertiesByName.set(Mappable.name, mappable);
		entity.collidable = entity.mappable; // hack
	};

	MappableDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		// todo
	};

	// Cloneable.

	MappableDefn.prototype.clone = function()
	{
		return this; // hack
	};
}
