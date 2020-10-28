
class Emplacement extends EntityProperty
{
	appearance: string;
	_use: any;

	constructor(appearance: string, use: any)
	{
		super();
		this.appearance = appearance;
		this._use = use;
	}

	use
	(
		universe: Universe, world: World, place: Place,
		entityUsing: Entity, entityUsed: Entity
	)
	{
		if (this._use == null)
		{
			(entityUsing as Entity2).player().messageLog.messageAdd("Nothing happens.");
		}
		else
		{
			this._use(universe, world, place, entityUsing, entityUsed);
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Emplacement) { return this; }
}
