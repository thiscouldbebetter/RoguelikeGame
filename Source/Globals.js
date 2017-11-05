
function Globals()
{
	this.htmlElementLibrary = new HTMLElementLibrary();
	this.idHelper = new IDHelper();
	this.randomizer = new RandomizerLCG
	(
	        1103515245, // multiplier
	        12345, // addend
	        Math.pow(2.0, 31), // modulus
	        0.12345 // firstRandom
	);
}
{
	Globals.prototype.initialize = function
	(
		font,
		realWorldMillisecondsPerTick, 
		viewSizeInPixels, 
		universe
	)	
	{
		this.sightHelper = new SightHelper();

		this.collisionHelper = new CollisionHelper();
		this.font = font;

		this.displayHelper = new DisplayHelper();
		this.displayHelper.initialize(viewSizeInPixels);

		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this.displayHelper);

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();

		this.realWorldMillisecondsPerTick = realWorldMillisecondsPerTick;

		this.universe = universe;

		this.timer = setInterval
		(
			Globals.Instance.processTick.bind(this), 
			this.realWorldMillisecondsPerTick
		);
	}

	Globals.prototype.processTick = function()
	{
		this.universe.update();
	}
}

{
	Globals.Instance = new Globals();
}
