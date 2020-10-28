
class ActorDefn extends EntityProperty
{
	activityDefnNameInitial: string;

	constructor(activityDefnNameInitial: string)
	{
		super();
		this.activityDefnNameInitial = activityDefnNameInitial;
	}

	initialize(universe: Universe, world: World, place: Place, entityAsEntity: Entity)
	{
		var entity = entityAsEntity as Entity2;

		var actorData = new ActorData();
		entity.propertyAddForPlace(actorData, place);

		actorData.actions = [];

		var activity = new Activity2
		(
			entity.actorDefn().activityDefnNameInitial,
			null
		);

		actorData.activity_Set(universe, world, place, entity, activity);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entityAsEntity: Entity)
	{
		var entity = entityAsEntity as Entity2;
		if (entity.killable() == null || entity.killable().isAlive())
		{
			var actorData = entity.actorData();
			actorData.activity_Get().perform(universe, world, place, entity);

			var entityActions = actorData.actions;

			for (var a = 0; a < entityActions.length; a++)
			{
				var action = entityActions[a];
				action.perform(universe, world, place, entity);
			}

			if (entityActions.length > 0)
			{
				(place as PlaceLevel).hasBeenUpdatedSinceDrawn = true;
			}

			entityActions.length = 0;
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }
}
