"use strict";
class Starvable2 extends EntityProperty {
    constructor(satietyMax) {
        super();
        this.satietyMax = satietyMax;
        this.satiety = this.satietyMax;
    }
    satietyAdd(world, amountToAdd, moverEntity) {
        this.satiety += amountToAdd;
        if (this.satiety <= 0) {
            moverEntity.killable().integrity = 0;
        }
        else if (this.satiety >= this.satietyMax) {
            this.satiety = this.satietyMax;
        }
        this.controlUpdate(world, moverEntity, null);
    }
    // controls
    controlUpdate(world, entity, pos) {
        if (this.control == null && pos != null) {
            this.control = new ControlContainer("containerMover_Vitals", pos, new Coords(160, 32, 0), // size
            [
                ControlLabel.fromPosAndText(
                //"labelHealth",
                new Coords(10, 5, 0), new DataBinding(entity.killable(), (c) => {
                    return "Life: " + c.integrity + "/" + c.integrityMax;
                }, null)),
                ControlLabel.fromPosAndText(
                //"labelSatiety",
                new Coords(10, 15, 0), new DataBinding(this, (c) => {
                    return "Satiety: " + c.satiety + "/" + c.satietyMax;
                }, null))
            ], null, null);
        }
        return this.control;
    }
    // Clonable.
    clone() { return this; }
    overwriteWith(other) { return this; }
}
