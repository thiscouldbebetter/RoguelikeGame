
class Openable
{
	constructor(isOpen)
	{
		this.isOpen = isOpen;
	}

	clone()
	{
		return new Openable(this.isOpen);
	}
}
