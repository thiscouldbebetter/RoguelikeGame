
function Color(name, symbol, systemColor)
{
	this.name = name;
	this.symbol = symbol;
	this.systemColor = systemColor;
}

{
	// static methods

	Color.getBySymbol = function(symbolToGet)
	{
		var returnValue = Color.Instances._All[symbolToGet];
		return returnValue;
	}

	// instances

	function Color_Instances()
	{
		if (Color.Instances != null) { return Color.Instances; }

		Color.Instances = this;

		this.Transparent = new Color("Transparent", ".", "rgba(0, 0, 0, 0)");

		this.Black 	= new Color("Black", 	"k", "#000000");
		this.Blue 	= new Color("Blue", 	"b", "#0000ff");
		this.BlueDark 	= new Color("BlueDark", "B", "#000080");
		this.Brown	= new Color("Brown", 	"n", "#804000");
		this.Cyan	= new Color("Cyan", 	"c", "#00ffff");
		this.Gray 	= new Color("Gray", 	"a", "#808080");
		this.GrayDark 	= new Color("GrayDark", "A", "#404040");
		this.Green 	= new Color("Green", 	"g", "#00ff00");
		this.GreenDark 	= new Color("GreenDark","G", "#008000");
		this.Orange 	= new Color("Orange", 	"o", "#ff8000");
		this.Purple 	= new Color("Purple", 	"p", "#ff00ff");
		this.Red 	= new Color("Red", 	"r", "#ff0000");
		this.Tan	= new Color("Tan", 	"t", "#aaaa40");
		this.White 	= new Color("White", 	"w", "#ffffff");
		this.Yellow 	= new Color("Yellow", 	"y", "#ffff00");

		this._All = new Array
		(
			this.Transparent,

			this.Black,
			this.Blue,
			this.BlueDark,
			this.Brown,
			this.Cyan,
			this.Gray,
			this.GrayDark,
			this.Green,
			this.GreenDark,
			this.Orange,
			this.Purple,
			this.Red,
			this.Tan,
			this.White,
			this.Yellow	
		);

		for (var i = 0; i < this._All.length; i++)
		{
			var color = this._All[i];
			this._All[color.symbol] = color;
		}
	}	

	new Color_Instances();
}
