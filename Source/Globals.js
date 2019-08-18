
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
		font, realWorldMillisecondsPerTick, display, world
	)
	{
		this.sightHelper = new SightHelper();

		this.collisionHelper = new CollisionHelper();
		this.font = font;

		world.display = display;

		var platformHelper = new PlatformHelper();
		world.platformHelper = platformHelper;
		platformHelper.initialize(world);

		display.initialize(world);
		this.display = display;
		platformHelper.platformableAdd(this.display);

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(world);

		this.realWorldMillisecondsPerTick = realWorldMillisecondsPerTick;

		this.world = world;

		this.timer = setInterval
		(
			Globals.Instance.processTick.bind(this),
			this.realWorldMillisecondsPerTick
		);
	}

	Globals.prototype.processTick = function()
	{
		this.world.update();
	}
}

{
	Globals.Instance = new Globals();
}
