
class Searchable implements EntityProperty<Searchable>
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

	// Clonable.

	clone()
	{
		return new Searchable
		(
			this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover
		);
	}

	overwriteWith(other: Searchable) { return this; }

	// Equatable.
	equals(other: Searchable) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}
}
