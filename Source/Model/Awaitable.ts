
class Awaitable extends EntityProperty
{
	isDone: boolean;

	constructor()
	{
		super();
		this.isDone = false;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Awaitable) { return this; }

}
