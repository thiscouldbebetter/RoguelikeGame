
function Message(name, textsForLanguages)
{
	this.name = name;
	this.textsForLanguages = textsForLanguages;
}

{
	Message.getTextForName = function(messageName)
	{
		return Message.Instances()._All[messageName].textsForLanguages[0];
	};

	// instances

	function Message_Instances()
	{
		this._All =
		[
			new Message("NothingHappens", [ "Nothing happens." ])
		];

		this._All.addLookupsByName();
	}

	Message.Instances = function()
	{
		if (Message._instances == null)
		{
			Message._instances = new Message_Instances();
		}

		return Message._instances
	};
}
