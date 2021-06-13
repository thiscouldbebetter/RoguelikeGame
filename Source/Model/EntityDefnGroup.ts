
class EntityDefnGroup
{
	name: string;
	relativeFrequency: number;
	entityDefns: Entity2[];

	_entityDefnsByName: Map<string, Entity2>;

	constructor(name: string, relativeFrequency: number, entityDefns: Entity2[])
	{
		this.name = name;
		this.relativeFrequency = relativeFrequency;
		this.entityDefns = entityDefns;

		this._entityDefnsByName = ArrayHelper.addLookupsByName(entityDefns);
	}

	entityDefnByName(entityDefnName: string): Entity2
	{
		return this._entityDefnsByName.get(entityDefnName);
	}
}
