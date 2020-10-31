
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
				new Coords(displaySize.x - displaySize.y, displaySize.y / 2), // size
				colorFore, colorBack,
				[] // children
			),
			new DisplayPane
			(
				"Messages",
				new Coords(displaySize.y, displaySize.y / 2), // pos
				new Coords(displaySize.x - displaySize.y, displaySize.y / 2), // size
				colorFore, colorBack,
				[] // children
			),
		]
	);

	//localStorage.clear();

	var contentPath = "../Content/";
	var imagePath = contentPath + "Images/";
	var audioPath = contentPath + "Audio/";
	var effectsPath = audioPath + "Effects/";
	var musicPath = audioPath + "Music/";
	var videoPath = contentPath + "Video/";
	var fontPath = contentPath + "Fonts/";
	var textStringPath = contentPath + "Text/";

	var mediaLibrary = MediaLibrary.fromFilePaths
	([
		imagePath + "Opening.png",
		imagePath + "Title.png",
		imagePath + "Tiles.png",

		effectsPath + "Sound.wav",

		musicPath + "Music.mp3",
		musicPath + "Title.mp3",

		videoPath + "Movie.webm",

		fontPath + "Font.ttf",

		textStringPath + "Talk/Mentor.json",
	]);

	var timerHelper = new TimerHelper(15);

	var version = "0.0.0-20201031-1645";

	var universe = Universe.create
	(
		"RoguelikeGame",
		version,
		timerHelper,
		display,
		mediaLibrary,
		ControlStyle.Instances().Default,
		(u) => World2.create(u)
	);
	universe.initialize
	(
		function()
		{
			universe.start();
		}
	);
}
