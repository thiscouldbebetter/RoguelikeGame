
function Device(chargesMax, consumedWhenAllChargesUsed, effectsToApply)
{
	this.chargesMax = chargesMax;
	this.consumedWhenAllChargesUsed = consumedWhenAllChargesUsed;
	this.effectsToApply = effectsToApply;

	this.numberOfCharges = this.chargesMax;
}

{
	Device.prototype.use = function(world, userEntity, deviceEntity, targetEntity)
	{
		for (var i = 0; i < this.effectsToApply.length; i++)
		{
			var effect = this.effectsToApply[i];

			effect.applyToEntity(world, deviceEntity, targetEntity);
		}
	};
	
	Device.prototype.clone = function()
	{
		return new Device(this.chargesMax, this.consumedWhenAllChargesUsed, this.effectsToApply);
	};
}
