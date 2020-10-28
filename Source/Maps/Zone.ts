
class Zone2
{
	bounds: Box;

	zonesConnected: Zone2[];

	constructor(bounds: Box)
	{
		this.bounds = bounds;
		this.zonesConnected = [];
	}
}
