
function EntityExtensions()
{
	// Extension class.
}
{
	Entity.prototype.actorData = function() { return this.propertyByName(ActorData.name); }
	Entity.prototype.actorDefn = function() { return this.propertyByName(ActorDefn.name); }
	Entity.prototype.awaitable = function() { return this.propertyByName(Awaitable.name); }
	Entity.prototype.demographics = function() { return this.propertyByName(Demographics.name); }
	Entity.prototype.collidable = function() { return this.mappable(); }
	Entity.prototype.emplacement = function() { return this.propertyByName(Emplacement.name); }
	Entity.prototype.generatable = function() { return this.propertyByName(Generatable.name); }
	Entity.prototype.mappable = function() { return this.propertyByName(Mappable.name); }
	Entity.prototype.mappableDefn = function() { return this.propertyByName(MappableDefn.name); }
	Entity.prototype.mover = function() { return this.propertyByName(Mover.name); }
	Entity.prototype.moverGenerator = function() { return this.propertyByName(MoverGenerator.name); }
	Entity.prototype.namable = function() { return this.propertyByName(Namable.name); }
	Entity.prototype.openable = function() { return this.propertyByName(Openable.name); }
	Entity.prototype.player = function() { return this.propertyByName(Player.name); }
	Entity.prototype.searchable = function() { return this.propertyByName(Searchable.name) };
	Entity.prototype.turnable = function() { return this.propertyByName(Turnable.name); }
}
