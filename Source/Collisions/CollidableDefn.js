
function CollidableDefn(blocksMovement, blocksVision)
{
	this.blocksMovement = blocksMovement;
	this.blocksVision = blocksVision;
}

{
	function CollidableDefn_Instances()
	{
		this.Blocking = new CollidableDefn(() => true, () => true);
		this.Concealing = new CollidableDefn(() => false, () => true);
		this.Open = new CollidableDefn(() => false, () => false);
		this.Transparent = new CollidableDefn(() => true, () => false);
	}

	CollidableDefn.Instances = function()
	{
		if (CollidableDefn._instances == null)
		{
			CollidableDefn._instances = new CollidableDefn_Instances();
		}
		return CollidableDefn._instances;
	};

	// entity

	CollidableDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var collidable = new Collidable
		(
			entity.collidableDefn
		);

		var map = place.map;
		var entityPosInCells = entity.locatable.loc.pos;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		collidable.mapCellOccupied = mapCellOccupied;

		entity.collidable = collidable;
	};

	CollidableDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		// todo
	};

	// Cloneable.

	CollidableDefn.prototype.clone = function()
	{
		return this; // hack
	};
}
