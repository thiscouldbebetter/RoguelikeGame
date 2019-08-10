
function InputKey(name, systemKey)
{
	this.name = name;
	this.systemKey = systemKey;
}

{
	function InputKey_Instances()
	{
		if (InputKey.Instances != null) { return; }

		InputKey.Instances = this;

		this._All =
		[
			new InputKey("A", "a"),
			new InputKey("B", "b"),
			new InputKey("C", "c"),
			new InputKey("D", "d"),
			new InputKey("E", "e"),
			new InputKey("F", "f"),
			new InputKey("G", "g"),
			new InputKey("H", "h"),
			new InputKey("I", "i"),
			new InputKey("J", "j"),
			new InputKey("K", "k"),
			new InputKey("L", "l"),
			new InputKey("M", "m"),
			new InputKey("N", "n"),
			new InputKey("O", "o"),
			new InputKey("P", "p"),
			new InputKey("Q", "q"),
			new InputKey("R", "r"),
			new InputKey("S", "s"),
			new InputKey("T", "t"),
			new InputKey("U", "u"),
			new InputKey("V", "v"),
			new InputKey("W", "w"),
			new InputKey("X", "x"),
			new InputKey("Y", "y"),
			new InputKey("Z", "z"),

			new InputKey("Num0", "0"),
			new InputKey("Num1", "1"),
			new InputKey("Num2", "2"),
			new InputKey("Num3", "3"),
			new InputKey("Num4", "4"),
			new InputKey("Num5", "5"),
			new InputKey("Num6", "6"),
			new InputKey("Num7", "7"),
			new InputKey("Num8", "8"),
			new InputKey("Num9", "9"),


			new InputKey("BracketClose", "]"),
			new InputKey("BracketOpen", "["),
			new InputKey("Period", "."),
		];

		this.systemKeyToKeyLookup = [];
		for (var i = 0; i < this._All.length; i++)
		{
			var key = this._All[i];
			this[key.name] = key;
			this.systemKeyToKeyLookup[key.systemKey] = key;
		}
	}

	new InputKey_Instances();
}
