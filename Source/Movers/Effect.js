
function Effect(defn)
{
	this.defn = defn;
}

{
	Effect.prototype.applyToEntity = function(world, actingEntity, targetEntity)
	{
		this.defn.apply(world, actingEntity, targetEntity);
	}

	Effect.prototype.clone = function()
	{
		return new Effect(this.defn);
	}
}
