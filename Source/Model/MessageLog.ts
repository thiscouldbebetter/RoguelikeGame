
class MessageLog
{
	messagesMax: number;
	messages: string[];

	control: ControlBase;

	constructor()
	{
		this.messagesMax = 20;
		this.messages =
		[
			"You enter the dungeon."
		];
	}

	messageAdd(messageToAdd: string)
	{
		this.messages.push(messageToAdd);
		if (this.messages.length > this.messagesMax)
		{
			var messagesToDelete = this.messages.length - this.messagesMax;
			this.messages.splice(0, messagesToDelete);
		}
	}

	// controls

	controlUpdate(world: World): ControlBase
	{
		if (this.control == null)
		{
			var controlForMessages = ControlList.fromPosSizeItemsAndBindingForItemText
			(
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(160, 260), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: MessageLog) => c.messages
				), // items
				DataBinding.fromGet
				(
					(c: string) => c
				) // bindingForItemText
			);
			controlForMessages.name = "listMessages";

			this.control = new ControlContainer
			(
				"containerMessageLog",
				Coords.fromXY(10, 10),
				Coords.fromXY(180, 280), // size
				[
					ControlLabel.fromPosAndText
					(
						Coords.fromXY(10, 5),
						DataBinding.fromContext("Message Log:")
					),
					controlForMessages
				],
				null, null
			);
		}


		return this.control;
	}
}
