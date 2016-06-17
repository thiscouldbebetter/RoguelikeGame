
function Activity(defnName, target)
{
	this.defnName = defnName;
	this.target = target;
}

{
	// instance methods

	Activity.prototype.defn = function()
	{
		return Globals.Instance.universe.defn.activityDefns[this.defnName];
	}

	Activity.prototype.initialize = function(actor)
	{
		this.defn().initialize(actor, this);
	}

	Activity.prototype.perform = function(actor)
	{
		this.defn().perform(actor, this);
	}
}
