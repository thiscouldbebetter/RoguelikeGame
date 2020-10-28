
class Namable2 extends EntityProperty
{
	name: string;
	appearance: string;

	constructor(name: string, appearance: string)
	{
		super();
		this.name = name;
		this.appearance = appearance;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Namable2) { return this; }
}
