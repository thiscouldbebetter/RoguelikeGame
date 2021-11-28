"use strict";
class Turnable {
    constructor(updateForTurn) {
        this.updateForTurn = updateForTurn;
        this.hasActedThisTurn = false;
    }
    // Clonable.
    clone() {
        return new Turnable(this.updateForTurn);
    }
    overwriteWith(other) {
        this.updateForTurn = other.updateForTurn;
        this.hasActedThisTurn = other.hasActedThisTurn;
        return this;
    }
    // Equatable.
    equals(other) { return false; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
}
