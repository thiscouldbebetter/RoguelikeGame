
function MediaLoader
(
	objectContainingCallback,
	callbackToRunWhenLoadingComplete,
	items
)
{
	this.objectContainingCallback = objectContainingCallback;
	this.callbackToRunWhenLoadingComplete = callbackToRunWhenLoadingComplete; 
	this.items = items;
	this.items.addLookups("name");
}

{
	MediaLoader.prototype.itemLoaded = function(event)
	{
		this.numberOfItemsLoadedSoFar++;	
		if (this.numberOfItemsLoadedSoFar >= this.items.length)
		{
			this.callbackToRunWhenLoadingComplete.call
			(
				this.objectContainingCallback,
				this
			);
		}
	}

	MediaLoader.prototype.loadItemsAll = function()
	{
		this.numberOfItemsLoadedSoFar = 0;

		for (var i = 0; i < this.items.length; i++)
		{
			var item = this.items[i];
			item.load(this, item);
		}
	}

}
