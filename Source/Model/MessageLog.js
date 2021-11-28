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
            var controlForMessages = ControlList.fromPosSizeItemsAndBindingForItemText(Coords.fromXY(10, 15), // pos
            Coords.fromXY(160, 260), // size
            DataBinding.fromContextAndGet(this, (c) => c.messages), // items
            DataBinding.fromGet((c) => c) // bindingForItemText
            );
            controlForMessages.name = "listMessages";
            this.control = new ControlContainer("containerMessageLog", Coords.fromXY(10, 10), Coords.fromXY(180, 280), // size
            [
                ControlLabel.fromPosAndText(Coords.fromXY(10, 5), DataBinding.fromContext("Message Log:")),
                controlForMessages
            ], null, null);
        }
        return this.control;
    }
}
