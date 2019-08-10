
function KillableData(defn)
{
	this.defn = defn;
	this.integrity = this.defn.integrityMax;
}

{
	KillableData.prototype.integrityAdd = function(amountToAdd)
	{
		this.integrity = NumberHelper.trimValueToRangeMax
		(
			this.integrity + amountToAdd,
			0,
			this.defn.integrityMax
		);
	}
}
