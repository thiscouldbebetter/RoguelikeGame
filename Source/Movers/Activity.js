
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

	Activity.prototype.initialize = function(world, actor)
	{
		this.defn(world).initialize(world, actor, this);
	}

	Activity.prototype.perform = function(world, actor)
	{
		this.defn(world).perform(world, actor, this);
	}
}
