
function ActorData()
{
	// do nothing?
}

{
	ActorData.prototype.activity_Get = function() { return this._activity; };
	ActorData.prototype.activity_Set = function(world, actor, value)
	{
		this._activity = value;
		this._activity.initialize(world, actor);
	};
}
