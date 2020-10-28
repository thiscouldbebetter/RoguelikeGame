
class Activity2
{
	defnName: string;
	target: any;

	constructor(defnName: string, target: any)
	{
		this.defnName = defnName;
		this.target = target;
	}

	// instance methods

	defn(world: World)
	{
		return (world as World2).defn2.activityDefn2sByName.get(this.defnName);
	}

	initialize(universe: Universe, world: World, place: Place, actor: Entity)
	{
		this.defn(world).initialize(universe, world, place, actor, this);
	}

	perform(universe: Universe, world: World, place: Place, actor: Entity)
	{
		this.defn(world).perform(universe, world, place, actor, this);
	}
}
