
function Activity(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}

{
	// instance methods

	Activity.prototype.defn = function(world)
	{
		return world.defn.activityDefns[this.defnName];
	}

	Activity.prototype.initialize = function(universe, world, place, actor)
	{
		this.defn(world).initialize(universe, world, place, actor, this);
	}

	Activity.prototype.perform = function(universe, world, place, actor)
	{
		this.defn(world).perform(universe, world, place, actor, this);
	}
}
