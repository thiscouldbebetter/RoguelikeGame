
function DeviceDefn(chargesMax, consumedWhenAllChargesUsed, effectsToApply)
{
	this.chargesMax = chargesMax;
	this.consumedWhenAllChargesUsed = consumedWhenAllChargesUsed;
	this.effectsToApply = effectsToApply;
}

{
	DeviceDefn.prototype.name = function() { return "Device"; }

	DeviceDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		entity.deviceData = new DeviceData
		(
			entity.defn().Device.chargesMax
		);
	}

	DeviceDefn.prototype.use = function(userEntity, deviceEntity, targetEntity)
	{
		for (var i = 0; i < this.effectsToApply.length; i++)
		{
			var effect = this.effectsToApply[i];

			effect.applyToEntity(deviceEntity, targetEntity);
		}
	}
}
