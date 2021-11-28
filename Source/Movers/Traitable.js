"use strict";
class Traitable {
    constructor(strength, dexterity, constitution, intelligence, wisdom, charisma) {
        this.traitsBase =
            [
                new Trait(Trait.Strength, strength),
                new Trait(Trait.Dexterity, dexterity),
                new Trait(Trait.Constitution, constitution),
                new Trait(Trait.Intelligence, intelligence),
                new Trait(Trait.Wisdom, wisdom),
                new Trait(Trait.Charisma, charisma)
            ];
        this.traitsBaseByName = ArrayHelper.addLookupsByName(this.traitsBase);
    }
    static random(randomizer) {
        var diceRoll = DiceRoll.fromExpression("3d6");
        var traitValues = new Array();
        var traitCount = 6;
        for (var i = 0; i < traitCount; i++) {
            var traitValue = diceRoll.roll(randomizer);
            traitValues.push(traitValue);
        }
        var returnValue = new Traitable(traitValues[0], traitValues[1], traitValues[2], traitValues[3], traitValues[4], traitValues[5]);
        return returnValue;
    }
    traitsAdjusted() {
        if (this._traitsAdjusted == null) {
            this._traitsAdjusted = ArrayHelper.clone(this.traitsBase);
            this._traitsAdjustedByName =
                ArrayHelper.addLookupsByName(this._traitsAdjusted);
        }
        return this._traitsAdjusted;
    }
    traitsAdjustedRecalculate() {
        this._traitsAdjusted = null;
        return this.traitsAdjusted();
    }
    // accessors
    strength() {
        return this._traitsAdjustedByName.get(Trait.Strength).value;
    }
    dexterity() {
        return this._traitsAdjustedByName.get(Trait.Dexterity).value;
    }
    constitution() {
        return this._traitsAdjustedByName.get(Trait.Constitution).value;
    }
    intelligence() {
        return this._traitsAdjustedByName.get(Trait.Intelligence).value;
    }
    wisdom() {
        return this._traitsAdjustedByName.get(Trait.Wisdom).value;
    }
    charisma() {
        return this._traitsAdjustedByName.get(Trait.Charisma).value;
    }
    // controls
    toControl(world, entity, pos) {
        if (this._control == null) {
            this._control = ControlContainer.from4("containerTraits", pos, Coords.fromXY(160, 16), // size
            [
                ControlLabel.fromPosAndText(new Coords(10, 5, 0), DataBinding.fromContextAndGet(this, (c) => c.traitsAdjusted().map((x) => x.toString()).join(" "))),
            ]);
        }
        return this._control;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
    // EntityProperty.
    finalize(uwpe) { }
    initialize(uwpe) { }
    updateForTimerTick(uwpe) { }
    // Equatable.
    equals(other) { return false; }
}
class Trait {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    toString() {
        return this.name.substr(0, 3) + ": " + this.value;
    }
    // Clonable.
    clone() {
        return new Trait(this.name, this.value);
    }
    overwriteWith(other) {
        this.name = other.name;
        this.value = other.value;
        return this;
    }
}
Trait.Strength = "Strength";
Trait.Dexterity = "Dexterity";
Trait.Constitution = "Constitution";
Trait.Intelligence = "Intelligence";
Trait.Wisdom = "Wisdom";
Trait.Charisma = "Charisma";
