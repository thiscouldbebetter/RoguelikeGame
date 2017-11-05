
function Heading()
{}
{
	// constants

	Heading.numberOfHeadings = 8;

	// static methods

	Heading.fromCoords = function(coordsToConvert)
	{
		var returnValue = Math.floor
		(
			Math.atan2
			(
				coordsToConvert.y, 
				coordsToConvert.x
			)
			* Heading.numberOfHeadings
			/ (2 * Math.PI)
		);

		if (returnValue < 0)
		{
			returnValue += Heading.numberOfHeadings;
		}

		return returnValue;
	}
}
