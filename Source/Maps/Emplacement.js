
function Emplacement(appearance, use)
{
	this.appearance = appearance;
	this._use = use;
}
{
	Emplacement.prototype.use = function(universe, world, place, entityUsing, entityUsed)
	{
		if (this._use == null)
		{
			entityUsing.Player.messageLog.messageAdd("Nothing happens.");
		}
		else
		{
			this._use(universe, world, place, entityUsing, entityUsed);
		}
	}

	// Cloneable.

	Emplacement.prototype.clone = function()
	{
		return this;
	};
}
