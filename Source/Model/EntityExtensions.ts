
class Entity2 extends Entity
{
	constructor(name: string, properties: EntityPropertyBase[])
	{
		super(name, properties);
	}

	static fromNameDefnAndProperties
	(
		name: string, defn: Entity2, properties: EntityPropertyBase[]
	): Entity2
	{
		var returnValue = defn.cloneAsEntity2();
		returnValue.name = name;
		for (var i = 0; i < properties.length; i++)
		{
			var property = properties[i];
			returnValue.properties.push(property);
			var propertyName = property.constructor.name; //.lowercaseFirstCharacter();
			//returnValue[propertyName] = property;
			returnValue.propertiesByName.set(propertyName, property);
		}
		return returnValue;
	}

	cloneAsEntity2(): Entity2
	{
		var nameCloned = this.name; // + IDHelper.Instance().idNext();
		var propertiesCloned = [];
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyAsAny = property as any;
			var propertyCloned =
			(
				propertyAsAny.clone == null
				? propertyAsAny
				: propertyAsAny.clone()
			) as EntityPropertyBase;
			propertiesCloned.push(propertyCloned);
		}
		var returnValue = new Entity2
		(
			nameCloned, propertiesCloned
		);
		return returnValue;
	}

	collidable(): Collidable
	{
		if (this._collidable == null)
		{
			var collider = this.mappable().collider;
			this._collidable = new Collidable(null, collider, null, null);
		}
		return this._collidable;
	}
	private _collidable: Collidable;

	actorData(): ActorData { return this.propertyByName(ActorData.name) as ActorData; }
	actorDefn(): ActorDefn { return this.propertyByName(ActorDefn.name) as ActorDefn; }
	agentData(): AgentData { return this.propertyByName(AgentData.name) as AgentData; }
	armored(): Armored { return this.propertyByName(Armored.name) as Armored; }
	awaitable(): Awaitable { return this.propertyByName(Awaitable.name) as Awaitable; }
	demographics(): Demographics { return this.propertyByName(Demographics.name) as Demographics; }
	effectable2(): Effectable2 { return this.propertyByName(Effectable2.name) as Effectable2; }
	effector(): Effector { return this.propertyByName(Effector.name) as Effector; }
	emplacement(): Emplacement { return this.propertyByName(Emplacement.name) as Emplacement; }
	food(): Food { return this.propertyByName(Food.name) as Food; }
	generatable(): Generatable { return this.propertyByName(Generatable.name) as Generatable; }
	mappable(): Mappable { return this.propertyByName(Mappable.name) as Mappable; }
	mappableDefn(): MappableDefn { return this.propertyByName(MappableDefn.name) as MappableDefn; }
	mover(): Mover { return this.propertyByName(Mover.name) as Mover; }
	moverGenerator(): MoverGenerator { return this.propertyByName(MoverGenerator.name) as MoverGenerator; }
	namable(): Namable2 { return this.propertyByName(Namable2.name) as Namable2; }
	openable(): Openable { return this.propertyByName(Openable.name) as Openable; }
	player(): Player { return this.propertyByName(Player.name) as Player; }
	portal2(): Portal2 { return this.propertyByName(Portal2.name) as Portal2; }
	searchable(): Searchable { return this.propertyByName(Searchable.name) as Searchable; }
	spellCaster(): SpellCaster { return this.propertyByName(SpellCaster.name) as SpellCaster; }
	starvable2(): Starvable2 { return this.propertyByName(Starvable2.name) as Starvable2; }
	traitable(): Traitable { return this.propertyByName(Traitable.name) as Traitable; }
	turnable(): Turnable { return this.propertyByName(Turnable.name) as Turnable; }
	weapon2(): Weapon2 { return this.propertyByName(Weapon2.name) as Weapon2; }
}
