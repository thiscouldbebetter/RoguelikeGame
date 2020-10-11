
class Emplacement
{
	constructor(appearance, use)
	{
		this.appearance = appearance;
		this._use = use;
	}

	use(universe, world, place, entityUsing, entityUsed)
	{
		if (this._use == null)
		{
			entityUsing.player.messageLog.messageAdd("Nothing happens.");
		}
		else
		{
			this._use(universe, world, place, entityUsing, entityUsed);
		}
	}

	// Cloneable.

	clone()
	{
		return this;
	}
}
