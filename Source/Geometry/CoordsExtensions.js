
function CoordsExtensions()
{
	// extension class
}
{
	Coords.prototype.dimensionIndexOfLargest = function(indexOfDimensionThatLosesTies)
	{
		return this.dimensionIndexOfSmallestOrLargest
		(
			indexOfDimensionThatLosesTies, -1
		);
	}

	Coords.prototype.dimensionIndexOfSmallest = function(indexOfDimensionThatLosesTies)
	{
		return this.dimensionIndexOfSmallestOrLargest
		(
			indexOfDimensionThatLosesTies, 1
		);
	}

	Coords.prototype.dimensionIndexOfSmallestOrLargest = function
	(
		indexOfDimensionThatLosesTies,
		multiplier
	)
	{
		var returnValue;

		var value = ( Math.abs(this.x) - Math.abs(this.y) ) * multiplier;

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
	};
}
