
function InputKey(name, systemKeyCode)
{
	this.name = name;
	this.systemKeyCode = systemKeyCode;
}

{
	function InputKey_Instances()
	{
		if (InputKey.Instances != null) { return; }

		InputKey.Instances = this;

		this._All = 
		[
			new InputKey("A", "_65"),
			new InputKey("B", "_66"),
			new InputKey("C", "_67"),
			new InputKey("D", "_68"),
			new InputKey("E", "_69"),
			new InputKey("F", "_70"),
			new InputKey("G", "_71"),
			new InputKey("H", "_72"),
			new InputKey("I", "_73"),
			new InputKey("J", "_74"),
			new InputKey("K", "_75"),
			new InputKey("K", "_76"),
			new InputKey("M", "_77"),
			new InputKey("N", "_78"),
			new InputKey("O", "_79"),
			new InputKey("P", "_80"),
			new InputKey("Q", "_81"),
			new InputKey("R", "_82"),
			new InputKey("S", "_83"),
			new InputKey("T", "_84"),
			new InputKey("U", "_85"),
			new InputKey("V", "_86"),
			new InputKey("W", "_87"),
			new InputKey("X", "_88"),
			new InputKey("Y", "_89"),
			new InputKey("Z", "_90"),

			new InputKey("BracketClose", "_221"),
			new InputKey("BracketOpen", "_219"),
			new InputKey("Period", "_190"),
		];

		this.systemKeyCodeToKeyLookup = [];
		for (var i = 0; i < this._All.length; i++)
		{
			var key = this._All[i];
			this[key.name] = key;
			this.systemKeyCodeToKeyLookup[key.systemKeyCode] = key;
		}
	}

	new InputKey_Instances();
}
