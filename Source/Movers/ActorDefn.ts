
class ActorDefn implements EntityProperty<ActorDefn>
{
	activityDefnNameInitial: string;

	constructor(activityDefnNameInitial: string)
	{
		this.activityDefnNameInitial = activityDefnNameInitial;
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity as Entity2;

		var actorData = new ActorData();
		entity.propertyAddForPlace(actorData, uwpe.place);

		actorData.actions = [];

		var activity = Activity.fromDefnName
		(
			entity.actorDefn().activityDefnNameInitial,
		);

		actorData.activitySet(uwpe, activity);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity as Entity2;

		if (entity.killable() == null || entity.killable().isAlive())
		{
			var actorData = entity.actorData();
			actorData.activity().perform(uwpe);

			var entityActions = actorData.actions;

			for (var a = 0; a < entityActions.length; a++)
			{
				var action = entityActions[a];
				action.perform(uwpe);
			}

			if (entityActions.length > 0)
			{
				(uwpe.place as PlaceLevel).hasBeenUpdatedSinceDrawn = true;
			}

			entityActions.length = 0;
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }

	// Equatable.
	equals(other: ActorDefn) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
}
