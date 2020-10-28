"use strict";
class Turnable extends EntityProperty {
    constructor(updateForTurn) {
        super();
        this.updateForTurn = updateForTurn;
        this.hasActedThisTurn = false;
    }
    clone() {
        return new Turnable(this.updateForTurn);
    }
    overwriteWith(other) {
        this.updateForTurn = other.updateForTurn;
        this.hasActedThisTurn = other.hasActedThisTurn;
        return this;
    }
}
