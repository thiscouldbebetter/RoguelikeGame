
class ActorData extends EntityProperty
{
	_activity: Activity2;
	actions: Action[];
	target: any;

	constructor()
	{
		super();
	}

	activity_Get() { return this._activity; }

	activity_Set
	(
		universe: Universe, world: World, place: Place, actor: Entity,
		value: Activity2
	)
	{
		this._activity = value;
		this._activity.initialize(universe, world, place, actor);
	}

	entityBeingFaced(u: Universe, w: World, place: Place, actor: Entity)
	{
		var returnValue = null;

		var actorLoc = actor.locatable().loc;
		var directionFacing = actorLoc.orientation.forward.clone().directions();
		var posInCellsDestination = actorLoc.pos.clone().add
		(
			directionFacing
		);

		var map = (place as PlaceLevel).map;
		var cellDestination = map.cellAtPos(posInCellsDestination);

		if (cellDestination != null)
		{
			var entitiesInCellDestination = cellDestination.entitiesPresent;
			if (entitiesInCellDestination.length > 0)
			{
				returnValue = entitiesInCellDestination[0];
			}
		}

		return returnValue;
	}

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other: ActorData)
	{
		return this; // todo
	}
}
