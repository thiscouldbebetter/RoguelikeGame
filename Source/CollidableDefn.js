
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

	CollidableDefn.prototype.name = function() { return "Collidable"; };

	CollidableDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		var collidableData = new CollidableData
		(
			entity.defn().Collidable
		);

		var map = venue.map;
		var entityPosInCells = entity.loc.posInCells;
		var mapCellOccupied = map.cellAtPos(entityPosInCells);
		mapCellOccupied.entitiesPresent.push(entity);
		collidableData.mapCellOccupied = mapCellOccupied;

		entity.collidableData = collidableData;
	};

	CollidableDefn.prototype.updateEntityForVenue = function(entity, venue)
	{
		// todo
	};

	CollidableDefn.prototype.finalizeEntityForVenue = function(entity, venue)
	{
		var collidableData = entity.collidableData;
		var entitiesPresentInCellOccupied = collidableData.mapCellOccupied;
		entitiesPresentInCellOccupied.splice
		(
			entitiesPresentInCellOccupied.indexOf(entity),
			1
		);
	};

}
