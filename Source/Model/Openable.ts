
class Openable extends EntityProperty
{
	isOpen: boolean;
	isLocked: boolean;

	constructor(isOpen: boolean, isLocked: boolean)
	{
		super();
		this.isOpen = isOpen;
		this.isLocked = isLocked;
	}

	clone()
	{
		return new Openable(this.isOpen, this.isLocked);
	}

	overwriteWith(other: Openable)
	{
		this.isOpen = other.isOpen;
		this.isLocked = other.isLocked;
		return this;
	}
}
