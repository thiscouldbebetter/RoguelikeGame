"use strict";
class Entity2 extends Entity {
    constructor(name, properties) {
        super(name, properties);
    }
    static fromNameDefnAndProperties(name, defn, properties) {
        var returnValue = defn.cloneAsEntity2();
        returnValue.name = name;
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            returnValue.properties.push(property);
            var propertyName = property.constructor.name; //.lowercaseFirstCharacter();
            //returnValue[propertyName] = property;
            returnValue.propertiesByName.set(propertyName, property);
        }
        return returnValue;
    }
    cloneAsEntity2() {
        var nameCloned = this.name; // + IDHelper.Instance().idNext();
        var propertiesCloned = [];
        for (var i = 0; i < this.properties.length; i++) {
            var property = this.properties[i];
            var propertyAsAny = property;
            var propertyCloned = (propertyAsAny.clone == null ? propertyAsAny : propertyAsAny.clone());
            propertiesCloned.push(propertyCloned);
        }
        var returnValue = new Entity2(nameCloned, propertiesCloned);
        return returnValue;
    }
    collidable() {
        if (this._collidable == null) {
            var collider = this.mappable().collider;
            this._collidable = new Collidable(null, collider, null, null);
        }
        return this._collidable;
    }
    actorData() { return this.propertyByName(ActorData.name); }
    actorDefn() { return this.propertyByName(ActorDefn.name); }
    agentData() { return this.propertyByName(AgentData.name); }
    armored() { return this.propertyByName(Armored.name); }
    awaitable() { return this.propertyByName(Awaitable.name); }
    demographics() { return this.propertyByName(Demographics.name); }
    effectable2() { return this.propertyByName(Effectable2.name); }
    effector() { return this.propertyByName(Effector.name); }
    emplacement() { return this.propertyByName(Emplacement.name); }
    food() { return this.propertyByName(Food.name); }
    generatable() { return this.propertyByName(Generatable.name); }
    mappable() { return this.propertyByName(Mappable.name); }
    mappableDefn() { return this.propertyByName(MappableDefn.name); }
    mover() { return this.propertyByName(Mover.name); }
    moverGenerator() { return this.propertyByName(MoverGenerator.name); }
    namable() { return this.propertyByName(Namable2.name); }
    openable() { return this.propertyByName(Openable.name); }
    player() { return this.propertyByName(Player.name); }
    portal2() { return this.propertyByName(Portal2.name); }
    searchable() { return this.propertyByName(Searchable.name); }
    spellCaster() { return this.propertyByName(SpellCaster.name); }
    starvable2() { return this.propertyByName(Starvable2.name); }
    traitable() { return this.propertyByName(Traitable.name); }
    turnable() { return this.propertyByName(Turnable.name); }
    weapon2() { return this.propertyByName(Weapon2.name); }
}
