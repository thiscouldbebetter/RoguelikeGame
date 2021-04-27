"use strict";
class Effectable2 {
    constructor(effects) {
        this.effects = effects || [];
        this.effectsToRemove = [];
    }
    effectApply(effectToApply) {
        this.effects.push(effectToApply);
    }
    effectorApply(effector) {
        effector.effects.forEach(x => this.effectApply(x));
    }
    updateForTurn(universe, world, place, entityEffectable) {
        this.effectsToRemove.length = 0;
        var effects = this.effects;
        for (var i = 0; i < effects.length; i++) {
            var effect = effects[i];
            effect.updateForCycle(universe, world, place, entityEffectable);
            if (effect.isDone) {
                this.effectsToRemove.push(effect);
            }
        }
        for (var i = 0; i < this.effectsToRemove.length; i++) {
            var effect = this.effectsToRemove[i];
            this.effects.splice(this.effects.indexOf(effect), 1);
        }
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
