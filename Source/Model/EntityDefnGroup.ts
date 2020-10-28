
class EntityDefnGroup
{
	name: string;
	relativeFrequency: number;
	entityDefns: Entity[];

	constructor(name: string, relativeFrequency: number, entityDefns: Entity[])
	{
		this.name = name;
		this.relativeFrequency = relativeFrequency;
		this.entityDefns = entityDefns;
	}
}
