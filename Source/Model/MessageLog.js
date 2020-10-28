"use strict";
class MessageLog {
    constructor() {
        this.messagesMax = 20;
        this.messages =
            [
                "You enter the dungeon."
            ];
    }
    messageAdd(messageToAdd) {
        this.messages.push(messageToAdd);
        if (this.messages.length > this.messagesMax) {
            var messagesToDelete = this.messages.length - this.messagesMax;
            this.messages.splice(0, messagesToDelete);
        }
    }
    // controls
    controlUpdate(world) {
        if (this.control == null) {
            var controlForMessages = ControlList.fromPosSizeAndItems(new Coords(10, 15, 0), // pos
            new Coords(160, 260, 0), // size
            DataBinding.fromContext(this.messages));
            controlForMessages.name = "listMessages";
            this.control = new ControlContainer("containerMessageLog", new Coords(10, 10, 0), new Coords(180, 280, 0), // size
            [
                ControlLabel.fromPosAndText(new Coords(10, 5, 0), "Message Log:"),
                controlForMessages
            ], null, null);
        }
        return this.control;
    }
}
