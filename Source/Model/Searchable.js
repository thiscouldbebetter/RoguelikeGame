
function Searchable(chanceOfDiscoveryPerSearch, isDiscovered)
{
	this.chanceOfDiscoveryPerSearch = chanceOfDiscoveryPerSearch;
	this.isDiscovered = isDiscovered || false;
}
{
	Searchable.prototype.clone = function()
	{
		return new Searchable(this.chanceOfDiscoveryPerSearch, this.isDiscovered);
	};
}
