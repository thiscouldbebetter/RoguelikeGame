
class Armored extends EntityProperty
{
	constructor()
	{
		super();
	}

	armorClassCalculate(u: Universe, w: World, p: Place, e: Entity)
	{
		return 10; // todo
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Armored) { return this; }
}
