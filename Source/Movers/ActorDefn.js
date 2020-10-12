
class ActorDefn
{
	constructor(activityDefnNameInitial)
	{
		this.activityDefnNameInitial = activityDefnNameInitial;
	}

	initializeEntityForPlace(universe, world, place, entity)
	{
		var actorData = new ActorData();
		entity.propertyAddForPlace(actorData, place);

		actorData.actions = [];

		var activity = new Activity
		(
			entity.actorDefn().activityDefnNameInitial,
			null
		);

		actorData.activity_Set(universe, world, place, entity, activity);
	}

	updateForTimerTick(universe, world, place, entity)
	{
		if (entity.killable() == null || entity.killable().isAlive())
		{
			var actorData = entity.actorData();
			actorData.activity_Get().perform(universe, world, place, entity);

			var entityActions = actorData.actions;

			for (var a = 0; a < entityActions.length; a++)
			{
				var action = entityActions[a];
				action.perform(universe, world, place, entity, action);
			}

			if (entityActions.length > 0)
			{
				place.hasBeenUpdatedSinceDrawn = true;
			}

			entityActions.length = 0;
		}
	}
}
