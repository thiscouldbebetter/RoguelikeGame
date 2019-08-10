
function MediaLoaderItem(name, itemType, path)
{
	this.name = name;
	this.itemType = itemType;
	this.path = path;
}

{
	MediaLoaderItem.prototype.load = function(mediaLoader)
	{
		this.itemType.load(mediaLoader, this);
	}
}
