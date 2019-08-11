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
		var imageTiles = Image.fromSystemImage
		(
			"Tiles",
			mediaLoader.items["Tiles"].htmlElement
		);
		imageTiles.onload = null;

		var imageTilesTransparent = Image.fromSystemImage
		(
			"TilesTransparent",
			mediaLoader.items["TilesTransparent"].htmlElement
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

		var randomizer = Globals.Instance.randomizer;
		var worldDefn = new DemoData(randomizer).buildWorldDefn
		(
			imagesForTiles, imagesForTilesTransparent
		);

		var venues = worldDefn.buildVenues
		(
			worldDefn,
			worldDefn.venueDefns,
			worldDefn.entityDefnGroups,
			[]
		);

		var world0 = new World
		(
			"World0",
			worldDefn,
			venues,
			null // entityForPlayer
		);

		Globals.Instance.initialize
		(
			new DemoData().buildFont(),
			100, //realWorldMillisecondsPerTick,
			new Coords(1000, 800), //viewSizeInPixels,
			world0
		);
	}
}
