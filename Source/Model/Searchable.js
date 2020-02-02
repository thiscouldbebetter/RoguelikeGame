
function Searchable(chanceOfDiscoveryPerSearch, isHidden, discover)
{
	this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
	this.isHidden = isHidden || false;
	this.discover = discover;
}
{
	Searchable.prototype.clone = function()
	{
		return new Searchable
		(
			this.chanceOfDiscoveryPerSearch, this.isHidden, this.discover
		);
	};
}
