
class Effector extends EntityProperty
{
	effects: Effect2[];

	constructor(effects: Effect2[])
	{
		super();
		this.effects = effects || [];
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Effector) { return this; }
}
