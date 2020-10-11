
class ActorData
{
	activity_Get() { return this._activity; }

	activity_Set(universe, world, place, actor, value)
	{
		this._activity = value;
		this._activity.initialize(universe, world, place, actor, this._activity);
	}
}
