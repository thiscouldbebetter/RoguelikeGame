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
    spellLearnByName(uwpe, spellName) {
        var world = uwpe.world;
        var entity = uwpe.entity;
        var spellKnowledge = this.spellKnowledgesByName.get(spellName);
        var message;
        if (spellKnowledge == null) {
            message = this.spellLearnByName_Try(uwpe, spellName);
        }
        else if (spellKnowledge.isExpired(world)) {
            message = "You re-learn the spell.";
            spellKnowledge.turnLearned = world.turnsSoFar;
        }
        else {
            message = "You already know this spell.";
        }
        var player = entity.player();
        var messageLog = player.messageLog;
        messageLog.messageAdd(message);
        //return message;
    }
    spellLearnByName_Try(uwpe, spellName) {
        var universe = uwpe.universe;
        var world = uwpe.world;
        var message;
        var chanceOfLearningSpell = 1;
        var randomNumber = universe.randomizer.getNextRandom();
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
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
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
