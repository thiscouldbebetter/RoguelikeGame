
function Effect(defn)
{
	this.defn = defn;
}

{
	Effect.prototype.applyToEntity = function(actingEntity, targetEntity)
	{
		this.defn.apply(actingEntity, targetEntity);
	}

	Effect.prototype.clone = function()
	{
		return new Effect(this.defn);
	}
}
