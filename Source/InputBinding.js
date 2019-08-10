
function InputBinding(key, actionName)
{
	this.key = key;
	this.actionName = actionName;
}

{
	InputBinding.prototype.action = function()
	{
		return Globals.Instance.universe.defn.actions[this.actionName];
	}
}
