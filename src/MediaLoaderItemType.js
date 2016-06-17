
function MediaLoaderItemType(name, load)
{
	this.name = name;
	this.load = load;
}

{
	function MediaLoaderItemType_Instances()
	{
		this.Image = new MediaLoaderItemType
		(
			"Image",
			function(mediaLoader, mediaLoaderItem)
			{

				var htmlElementLibrary = Globals.Instance.htmlElementLibrary;
				var htmlElement = htmlElementLibrary.createElement("img");
				mediaLoaderItem.htmlElement = htmlElement;
				htmlElement.mediaLoaderItem = mediaLoaderItem;
				htmlElement.onload = mediaLoader.itemLoaded.bind(mediaLoader);
				htmlElement.setAttribute("crossOrigin", "anonymous");
				htmlElement.src = mediaLoaderItem.path;
			}
		);
	}

	MediaLoaderItemType.Instances = new MediaLoaderItemType_Instances();
}
