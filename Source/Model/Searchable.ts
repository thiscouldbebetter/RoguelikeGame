
class Searchable extends EntityProperty
{
	chanceOfDiscoveryPerSearch: number;
	isHidden: boolean;
	discover: any;

	constructor(chanceOfDiscoveryPerSearch: number, isHidden: boolean, discover: any)
	{
		super();
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
}
