
class MessageLog
{
	constructor()
	{
		this.messagesMax = 20;
		this.messages =
		[
			"You enter the dungeon."
		];
	}

	messageAdd(messageToAdd)
	{
		this.messages.push(messageToAdd);
		if (this.messages.length > this.messagesMax)
		{
			var messagesToDelete = this.messages.length - this.messagesMax;
			this.messages.splice(0, messagesToDelete);
		}
	}

	// controls

	controlUpdate(world)
	{
		if (this.control == null)
		{
			var controlForMessages = ControlList.fromPosSizeAndItems
			(
				new Coords(10, 15), // pos
				new Coords(160, 260), // size
				this.messages // items
			);
			controlForMessages.name = "listMessages";

			this.control = new ControlContainer
			(
				"containerMessageLog",
				new Coords(10, 10),
				new Coords(180, 280), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5),
						"Message Log:"
					),
					controlForMessages
				]
			);
		}

		return this.control;
	}
}
