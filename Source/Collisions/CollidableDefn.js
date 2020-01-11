
function CollidableDefn(blocksMovement, blocksView)
{
	this.blocksMovement = blocksMovement;
	this.blocksView = blocksView;
}

{
	function CollidableDefn_Instances()
	{
		this.Blocking = new CollidableDefn(true, true);
		this.Concealing = new CollidableDefn(false, true);
		this.Clear = new CollidableDefn(false, false);
	}

	CollidableDefn.Instances = function()
	{
		if (CollidableDefn._instances == null)
		{
			CollidableDefn._instances = new CollidableDefn_Instances();
		}
		return CollidableDefn._instances;
	};

	CollidableDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var collidable = new Collidable
		(
			entity.CollidableDefn
		);

		var map = place.map;
		var entityPosInCells = entity.Locatable.loc.pos;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		collidable.mapCellOccupied = mapCellOccupied;

		entity.Collidable = collidable;
	};

	CollidableDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		// todo
	};
}
