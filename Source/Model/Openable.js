
function Openable(isOpen)
{
	this.isOpen = isOpen;
}
{
	Openable.prototype.clone = function()
	{
		return new Openable(this.isOpen);
	};
}
