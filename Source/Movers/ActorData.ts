
class ActorData implements EntityProperty<ActorData>
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
		uwpe: UniverseWorldPlaceEntities, value: Activity
	): void
	{
		this._activity = value;
		//this._activity.initialize(universe, world, place, actor);
	}

	entityBeingFaced(uwpe: UniverseWorldPlaceEntities): Entity2
	{
		var place = uwpe.place;
		var actor = uwpe.entity;

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

	// Equatable.
	equals(other: ActorData) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
