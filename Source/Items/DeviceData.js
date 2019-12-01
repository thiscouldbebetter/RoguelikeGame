
function DeviceData(numberOfCharges)
{
	this.numberOfCharges = numberOfCharges;
}

{
	DeviceData.prototype.use = function(world, userEntity, deviceEntity, targetEntity)
	{
		var deviceDefn = deviceEntity.defn(world).Device;

		if (this.numberOfCharges > 0)
		{
			this.numberOfCharges--;

			deviceDefn.use
			(
				world, userEntity, deviceEntity, targetEntity
			);
		}

		if (this.numberOfCharges <= 0)
		{
			if (deviceDefn.consumedWhenAllChargesUsed == true)
			{
				userEntity.ItemHolder.removeItem
				(
					world, userEntity, deviceEntity
				);
			}
			else
			{
				Font.spawnMessageFloater
				(
					world,
					deviceEntity.defn(world).name,
					Message.getTextForName("NothingHappens"),
					userEntity.loc
				);
			}
		}
	}
}
