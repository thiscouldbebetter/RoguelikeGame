
function DeviceData(numberOfCharges)
{
	this.numberOfCharges = numberOfCharges;
}

{
	DeviceData.prototype.use = function(userEntity, deviceEntity, targetEntity)
	{
		if (this.numberOfCharges > 0)
		{
			this.numberOfCharges--;

			deviceEntity.defn().Device.use
			(
				userEntity, deviceEntity, targetEntity
			);
		}

		if (this.numberOfCharges <= 0)
		{
			var deviceDefn = deviceEntity.defn().Device;	
			if (deviceDefn.consumedWhenAllChargesUsed == true)
			{
				userEntity.containerData.removeItem
				(
					userEntity, deviceEntity
				);
			}
			else
			{
				Font.spawnMessageFloater
				(
					deviceEntity.defn().name, 
					Message.getTextForName("NothingHappens"), 
					userEntity.loc
				);
			} 
		}
	}
}
