"use strict";
class Effectable2 extends EntityProperty {
    constructor(effects) {
        super();
        this.effects = effects || [];
        this.effectsToRemove = [];
    }
    effectorApply(effector) {
        var effectsToApply = effector.effects;
        for (var i = 0; i < effectsToApply.length; i++) {
            var effectToApply = effectsToApply[i];
            this.effects.push(effectToApply);
        }
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
}
