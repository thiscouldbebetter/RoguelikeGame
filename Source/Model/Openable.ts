
class Openable extends EntityProperty
{
	isOpen: boolean;

	constructor(isOpen: boolean)
	{
		super();
		this.isOpen = isOpen;
	}

	clone()
	{
		return new Openable(this.isOpen);
	}

	overwriteWith(other: Openable)
	{
		return this; // todo
	}
}
