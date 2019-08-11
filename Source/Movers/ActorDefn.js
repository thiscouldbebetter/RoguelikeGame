
function ActorDefn(activityDefnNameInitial)
{
	this.activityDefnNameInitial = activityDefnNameInitial;
}

{
	ActorDefn.prototype.name = function() { return "Actor"; }

	ActorDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		var actorData = new ActorData();
		entity.actorData = actorData;

		actorData.actions = [];

		var activity = new Activity
		(
			entity.defn().Actor.activityDefnNameInitial,
			null
		);

		actorData.activity_Set(entity, activity);
	}

	ActorDefn.prototype.updateEntityForVenue = function(entity, venue)
	{
		entity.actorData.activity_Get().perform(entity);

		var entityActions = entity.actorData.actions;

		var world = Globals.Instance.world;
		for (var a = 0; a < entityActions.length; a++)
		{
			var action = entityActions[a];
			action.perform(world, entity, action);
		}

		entityActions.length = 0;
	}
}
