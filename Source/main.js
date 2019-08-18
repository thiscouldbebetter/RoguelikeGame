
function main()
{
	var imageTilesPath = "../Media/nethack-tiles-vanilla.png";

	var itemTypeImage = MediaLoaderItemType.Instances.Image;

	var mediaLoader = new MediaLoader
	(
		this, // objectContainingCallback,
		this.main_MediaLoadingCompleted, // callbackToRunWhenLoadingComplete,
		[
			new MediaLoaderItem("Tiles", itemTypeImage, imageTilesPath),
			new MediaLoaderItem("TilesTransparent", itemTypeImage, imageTilesPath),
		]
	);

	mediaLoader.loadItemsAll();
}

function main_MediaLoadingCompleted(mediaLoader)
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
		imageTiles,	sizeOfImageTilesInTiles
	);

	var imagesForTilesTransparent = ImageHelper.sliceImageIntoTiles
	(
		imageTilesTransparent, sizeOfImageTilesInTiles
	);

	var randomizer = new RandomizerLCG
	(
		1103515245, // multiplier
		12345, // addend
		Math.pow(2.0, 31), // modulus
		0.12345 // firstRandom
	);

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

	var displaySize = new Coords(800, 600);
	var zeroes = Coords.Instances().Zeroes;

	var colorFore = "White";
	var colorBack = "Black";
	var display = new DisplayPane
	(
		"Root",
		zeroes,
		displaySize,
		colorFore, colorBack,
		[
			new DisplayPane
			(
				"Map",
				zeroes, // pos
				new Coords(1, 1).multiplyScalar(displaySize.y), // size
				colorFore, colorBack,
				[]
			),
			new DisplayPane
			(
				"Status",
				new Coords(displaySize.y, 0), // pos
				new Coords(displaySize.x - displaySize.y, displaySize.y), // size
				colorFore, colorBack,
				[] // children
			),
		]
	);

	display.childSelectByName("Map"); // todo

	var world = new World
	(
		"World0",
		worldDefn,
		venues,
		null, // entityForPlayer
		randomizer,
		new DemoData().buildFont(),
		100, // millisecondsPerTick
		display
	);

	world.initialize();
}
