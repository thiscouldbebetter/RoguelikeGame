
class Searchable implements EntityProperty
{
	chanceOfDiscoveryPerSearch: number;
	isHidden: boolean;
	discover: any;

	constructor(chanceOfDiscoveryPerSearch: number, isHidden: boolean, discover: any)
	{
		this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
		this.isHidden = isHidden || false;
		this.discover = discover;
	}

	clone()
	{
		return new Searchable
		(
			this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover
		);
	}

	overwriteWith(other: Searchable) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}
