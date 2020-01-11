
function ActorDefn(activityDefnNameInitial)
{
	this.activityDefnNameInitial = activityDefnNameInitial;
}

{
	ActorDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		var actorData = new ActorData();
		entity.ActorData = actorData;

		actorData.actions = [];

		var activity = new Activity
		(
			entity.ActorDefn.activityDefnNameInitial,
			null
		);

		actorData.activity_Set(universe, world, entity, activity);
	}

	ActorDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var actorData = entity.ActorData;
		actorData.activity_Get().perform(universe, world, place, entity);

		var entityActions = actorData.actions;

		for (var a = 0; a < entityActions.length; a++)
		{
			var action = entityActions[a];
			action.perform(universe, world, place, entity, action);
		}

		entityActions.length = 0;
	}
}
