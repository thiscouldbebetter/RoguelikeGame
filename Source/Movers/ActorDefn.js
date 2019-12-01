
function ActorDefn(activityDefnNameInitial)
{
	this.activityDefnNameInitial = activityDefnNameInitial;
}

{
	ActorDefn.prototype.name = function() { return "Actor"; }

	ActorDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		var actorData = new ActorData();
		entity.actorData = actorData;

		actorData.actions = [];

		var activity = new Activity
		(
			entity.defn(world).Actor.activityDefnNameInitial,
			null
		);

		actorData.activity_Set(universe, world, entity, activity);
	}

	ActorDefn.prototype.updateEntityForVenue = function(universe, world, venue, entity)
	{
		entity.actorData.activity_Get().perform(universe, world, venue, entity);

		var entityActions = entity.actorData.actions;

		for (var a = 0; a < entityActions.length; a++)
		{
			var action = entityActions[a];
			action.perform(universe, world, venue, entity, action);
		}

		entityActions.length = 0;
	}
}
