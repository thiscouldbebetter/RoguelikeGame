// Can't use "() =>" notation here, because then "this" doesn't work.
Entity.prototype.actorDefn = function() { return this.propertiesByName.get(ActorDefn.name) };
Entity.prototype.demographics = function() { return this.propertiesByName.get(Demographics.name) };
Entity.prototype.effectable = function() { return this.propertiesByName.get(Effectable.name) };
Entity.prototype.emplacement = function() { return this.propertiesByName.get(Emplacement.name) };
Entity.prototype.generatable = function() { return this.propertiesByName.get(Generatable.name) };
Entity.prototype.itemDefn = function() { return this.propertiesByName.get(ItemDefn.name) };
Entity.prototype.mappable = function() { return this.propertiesByName.get(Mappable.name) };
Entity.prototype.mappableDefn = function() { return this.propertiesByName.get(MappableDefn.name) };
Entity.prototype.mover = function() { return this.propertiesByName.get(Mover.name) };
Entity.prototype.moverGenerator = function() { return this.propertiesByName.get(MoverGenerator.name) };
Entity.prototype.namable = function() { return this.propertiesByName.get(Namable.name) };
Entity.prototype.openable = function() { return this.propertiesByName.get(Openable.name) };
Entity.prototype.player = function() { return this.propertiesByName.get(Player.name) };
Entity.prototype.searchable = function() { return this.propertiesByName.get(Searchable.name) };
Entity.prototype.starvable = function() { return this.propertiesByName.get(Starvable.name) };
Entity.prototype.turnable = function() { return this.propertiesByName.get(Turnable.name) };

