
class Generatable extends EntityProperty
{
	relativeFrequency: number;

	constructor(relativeFrequency: number)
	{
		super();
		this.relativeFrequency = relativeFrequency;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }

}
