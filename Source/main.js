
function main()
{
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

	//display.childSelectByName("Map"); // todo

	//world.initialize();

	//localStorage.clear();

	var mediaLibrary = new MediaLibrary.fromFileNames
	(
		"../Content/",
		[ "Title.png", "Tiles.png" ],
		[ "Sound.wav" ],
		[ "Music.mp3" ],
		[ "Movie.webm" ],
		[ "Font.ttf" ],
		[ "Conversation.json", "Instructions.txt" ]
	);

	var timerHelper = new TimerHelper(20);

	var universe = Universe.new
	(
		"RoguelikeGame", timerHelper, display, mediaLibrary, null
	);
	universe.initialize();

}