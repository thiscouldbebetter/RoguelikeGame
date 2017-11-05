function Simulation()
{}
{
	Simulation.prototype.main = function()
	{
		var imageTilesPath = "../Media/nethack-tiles-vanilla.png";

		var itemTypeImage = MediaLoaderItemType.Instances.Image;

		var mediaLoader = new MediaLoader
		(
			this, // objectContainingCallback,
			this.main2, // callbackToRunWhenLoadingComplete,
			[
				new MediaLoaderItem("Tiles", itemTypeImage, imageTilesPath),
				new MediaLoaderItem("TilesTransparent", itemTypeImage, imageTilesPath),
			]
		);

		mediaLoader.loadItemsAll();
	}

	Simulation.prototype.main2 = function(mediaLoader)
	{
		var imageTiles = Image.buildFromSystemImage
		(
			"Tiles",
			mediaLoader.items["Tiles"].htmlElement,
			new Coords(640, 432) // sizeInPixels
		);
		imageTiles.onload = null;

		var imageTilesTransparent = Image.buildFromSystemImage
		(
			"TilesTransparent",
			mediaLoader.items["TilesTransparent"].htmlElement,
			new Coords(640, 432) // sizeInPixels
		);
		imageTilesTransparent.onload = null;

		var sizeOfImageTilesInTiles = new Coords(40, 27);

		var imagesForTiles = ImageHelper.sliceImageIntoTiles
		(
			imageTiles,
			sizeOfImageTilesInTiles
		);

		var imagesForTilesTransparent = ImageHelper.sliceImageIntoTiles
		(
			imageTilesTransparent,
			sizeOfImageTilesInTiles
		);

		Camera.initializeStatic();

		var universeDefn = DemoData.buildUniverseDefn(imagesForTiles, imagesForTilesTransparent);

		var venues = universeDefn.buildVenues
		(
			universeDefn,
			universeDefn.venueDefns,
			universeDefn.entityDefnGroups,
			[]
		);

		var universe0 = new Universe
		(
			"Universe0",
			universeDefn,
			venues,
			null // entityForPlayer
		);

		Globals.Instance.initialize
		(
			DemoData.buildFont(),
			100, //realWorldMillisecondsPerTick,
			new Coords(1000, 800), //viewSizeInPixels, 
			universe0
		);
	}
}
