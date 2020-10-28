
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

	clone()
	{
		return this; // todo
	}

	overwriteWith(other: ActorData)
	{
		return this; // todo
	}
}
