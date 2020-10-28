
class CoordsHelper
{
	dimensionIndexOfLargest(coords: Coords, indexOfDimensionThatLosesTies: number)
	{
		return CoordsHelper.dimensionIndexOfSmallestOrLargest
		(
			coords, indexOfDimensionThatLosesTies, -1
		);
	}

	static dimensionIndexOfSmallest(coords: Coords, indexOfDimensionThatLosesTies: number)
	{
		return CoordsHelper.dimensionIndexOfSmallestOrLargest
		(
			coords, indexOfDimensionThatLosesTies, 1
		);
	}

	static dimensionIndexOfSmallestOrLargest
	(
		coords: Coords, indexOfDimensionThatLosesTies: number, multiplier: number
	)
	{
		var returnValue;

		var value = ( Math.abs(coords.x) - Math.abs(coords.y) ) * multiplier;

		if (value > 0)
		{
			returnValue = 1;
		}
		else if (value < 0)
		{
			returnValue = 0;
		}
		else if (indexOfDimensionThatLosesTies != null)
		{
			returnValue = indexOfDimensionThatLosesTies;
		}

		return returnValue;
	}
}
