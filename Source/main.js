"use strict";
function main() {
    var displaySize = Coords.fromXY(800, 600);
    var zeroes = Coords.Instances().Zeroes;
    var colorFore = Color.byName("White");
    var colorBack = Color.byName("Black");
    var display = new DisplayPane("Root", zeroes, displaySize, colorFore, colorBack, [
        new DisplayPane("Map", zeroes, // pos
        Coords.fromXY(1, 1).multiplyScalar(displaySize.y), // size
        colorFore, colorBack, []),
        new DisplayPane("Status", Coords.fromXY(displaySize.y, 0), // pos
        Coords.fromXY(displaySize.x - displaySize.y, displaySize.y / 2), // size
        colorFore, colorBack, [] // children
        ),
        new DisplayPane("Messages", Coords.fromXY(displaySize.y, displaySize.y / 2), // pos
        Coords.fromXY(displaySize.x - displaySize.y, displaySize.y / 2), // size
        colorFore, colorBack, [] // children
        ),
    ]);
    //localStorage.clear();
    var contentPath = "../Content/";
    var imagePath = contentPath + "Images/";
    var audioPath = contentPath + "Audio/";
    var effectsPath = audioPath + "Effects/";
    var musicPath = audioPath + "Music/";
    var videoPath = contentPath + "Video/";
    var fontPath = contentPath + "Fonts/";
    var textStringPath = contentPath + "Text/";
    var mediaLibrary = MediaLibrary.fromFilePaths([
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
    var version = "0.0.0-20210427-0000";
    var controlBuilder = ControlBuilder.default();
    var universe = Universe.create("RoguelikeGame", version, timerHelper, display, mediaLibrary, controlBuilder, (u) => World2.create(u));
    universe.initialize(() => universe.start());
}
