
function KillableData(defn)
{
	this.defn = defn;
	this.integrity = this.defn.integrityMax;
}

{
	KillableData.prototype.integrityAdd = function(amountToAdd)
	{
		this.integrity += amountToAdd;
		this.integrity = this.integrity.trimToRangeMax
		(
			this.defn.integrityMax
		);
	}
}
