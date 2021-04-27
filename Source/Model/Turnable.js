"use strict";
class Turnable {
    constructor(updateForTurn) {
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
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
