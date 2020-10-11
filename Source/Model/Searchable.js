
class Searchable
{
	constructor(chanceOfDiscoveryPerSearch, isHidden, discover)
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
}
