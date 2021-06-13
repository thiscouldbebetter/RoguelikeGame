
class ActorData implements EntityProperty
{
	_activity: Activity;
	actions: Action[];
	target: any;

	activity() { return this._activity; }

	actionAdd(action: Action): void
	{
		this.actions.push(action);
	}

	activitySet
	(
		universe: Universe, world: World, place: Place, actor: Entity,
		value: Activity
	): void
	{
		this._activity = value;
		//this._activity.initialize(universe, world, place, actor);
	}

	entityBeingFaced(u: Universe, w: World, place: Place, actor: Entity): Entity2
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

	clone(): ActorData
	{
		return this; // todo
	}

	overwriteWith(other: ActorData): ActorData
	{
		return this; // todo
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
