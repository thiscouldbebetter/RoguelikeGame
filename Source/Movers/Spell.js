"use strict";
class Spell {
    constructor(name) {
        this.name = name;
    }
    static Instances() {
        if (Spell._instances == null) {
            Spell._instances = new Spell_Instances();
        }
        return Spell._instances;
    }
}
class Spell_Instances {
    constructor() {
        this.DoNothing = new Spell("DoNothing");
        this._All =
            [
                this.DoNothing
            ];
        this._AllByName = ArrayHelper.addLookupsByName(this._All);
    }
}
class SpellCaster {
    constructor(spellKnowledges) {
        this.spellKnowledges = spellKnowledges;
        this.spellKnowledgesByName = ArrayHelper.addLookups(this.spellKnowledges, x => x.spellName);
    }
    spellCastByName(u, w, p, e, spellName) {
        var spellKnowledge = this.spellKnowledgesByName.get(spellName);
        var message;
        if (spellKnowledge == null) {
            message = "You don't know that spell.";
        }
        else {
            message = "Spell not yet implemented!";
        }
        var player = e.player();
        var messageLog = player.messageLog;
        messageLog.messageAdd(message);
    }
    spellForgetByName(spellName) {
        var spellKnowledge = this.spellKnowledgesByName.get(spellName);
        if (spellKnowledge != null) {
            ArrayHelper.remove(this.spellKnowledges, spellKnowledge);
            this.spellKnowledgesByName.delete(spellName);
        }
    }
    spellKnowledgeAdd(spellKnowledge) {
        this.spellKnowledges.push(spellKnowledge);
        this.spellKnowledgesByName.set(spellKnowledge.spellName, spellKnowledge);
    }
    spellLearnByName(u, w, p, e, spellName) {
        var spellKnowledge = this.spellKnowledgesByName.get(spellName);
        var message;
        if (spellKnowledge == null) {
            message = this.spellLearnByName_Try(u, w, p, e, spellName);
        }
        else if (spellKnowledge.isExpired(w)) {
            message = "You re-learn the spell.";
            var world = w;
            spellKnowledge.turnLearned = world.turnsSoFar;
        }
        else {
            message = "You already know this spell.";
        }
        var player = e.player();
        var messageLog = player.messageLog;
        messageLog.messageAdd(message);
        return message;
    }
    spellLearnByName_Try(u, w, p, e, spellName) {
        var world = w;
        var message;
        var chanceOfLearningSpell = 1;
        var randomNumber = u.randomizer.getNextRandom();
        if (randomNumber >= chanceOfLearningSpell) {
            message = "You fail to learn the spell.";
            // todo - Consequences.
        }
        else {
            message = "You learn the spell '" + spellName + "'.";
            var spellKnowledge = new SpellKnowledge(spellName, world.turnsSoFar);
            this.spellKnowledgeAdd(spellKnowledge);
        }
        return message;
    }
    // EntityProperty.
    finalize(u, w, p, e) { }
    initialize(u, w, p, e) { }
    updateForTimerTick(u, w, p, e) { }
}
class SpellKnowledge {
    constructor(spellName, turnLearned) {
        this.spellName = spellName;
        this.turnLearned = turnLearned;
    }
    isExpired(w) {
        var world = w;
        var turnsKnown = world.turnsSoFar - this.turnLearned;
        var isExpired = (turnsKnown >= SpellKnowledge.RetentionInTurns);
        return isExpired;
    }
}
SpellKnowledge.RetentionInTurns = 3000; // todo
