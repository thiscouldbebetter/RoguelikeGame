
function NumberHelper()
{}
{
	NumberHelper.atan3 = function(coordsToFind)
	{
		var returnValue = Math.atan2(coordsToFind.y, coordsToFind.x);

		if (returnValue < 0)
		{
			returnValue += Constants.Tau;
		}

		returnValue /= Constants.Tau;

		return returnValue;
	}

	NumberHelper.trimValueToRangeMax = function(valueToTrim, rangeMin, rangeMax)
	{
		if (valueToTrim > rangeMax)
		{
			valueToTrim = rangeMax;
		}

		return valueToTrim;
	}

	NumberHelper.wrapValueToRangeMax = function(valueToWrap, rangeMax)
	{
		while (valueToWrap < 0)
		{
			valueToWrap += rangeMax;
		}

		while (valueToWrap >= rangeMax)
		{
			valueToWrap -= rangeMax;
		}

		return valueToWrap;
	}
}
