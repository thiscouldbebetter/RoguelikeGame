
function ActorDefn(activityDefnNameInitial)
{
	this.activityDefnNameInitial = activityDefnNameInitial;
}

{
	ActorDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
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

	ActorDefn.prototype.updateForTimerTick = function(universe, world, venue, entity)
	{
		var actorData = entity.ActorData;
		actorData.activity_Get().perform(universe, world, venue, entity);

		var entityActions = actorData.actions;

		for (var a = 0; a < entityActions.length; a++)
		{
			var action = entityActions[a];
			action.perform(universe, world, venue, entity, action);
		}

		entityActions.length = 0;
	}
}
