
function Bounds(pos, size)
{
	this.pos = pos;
	this.size = size;

	this.max = new Coords();
	this.center = new Coords();
	this.recalculateMaxAndCenter();
}

{
	// static methods

	Bounds.doBoundsOverlap = function(bounds0, bounds1)
	{
		var boundsSet = [bounds0, bounds1];

		var doAllDimensionsOverlapSoFar = true;

		for (var d = 0; d < Coords.NumberOfDimensions; d++)
		{
			var doesDimensionOverlap = Bounds.doBoundsOverlapInDimension
			(
				bounds0, bounds1, d
			);

			if (doesDimensionOverlap == false)
			{
				doAllDimensionsOverlapSoFar = false;
				break;
			}
		}

		return doAllDimensionsOverlapSoFar;
	}

	Bounds.doBoundsOverlapInDimension = function(bounds0, bounds1, dimensionIndex)
	{
		var returnValue =
		(
			bounds0.pos.dimension(dimensionIndex) < bounds1.max.dimension(dimensionIndex)
			&& bounds0.max.dimension(dimensionIndex) > bounds1.pos.dimension(dimensionIndex)
		);

		return returnValue;
	}

	Bounds.doBoundsInSetsOverlap = function(boundsSet0, boundsSet1)
	{
		var returnValue = false;

		var numberOfBoundsInSet0 = ( boundsSet0 == null ? 0 : boundsSet0.length );
		var numberOfBoundsInSet1 = ( boundsSet1 == null ? 0 : boundsSet1.length );

		for (var i = 0; i < numberOfBoundsInSet0; i++)
		{
			var boundsFromSet0 = boundsSet0[i];

			for (var j = 0; j < numberOfBoundsInSet1; j++)
			{
				var boundsFromSet1 = boundsSet1[j];

				var doBoundsOverlap = Bounds.doBoundsOverlap
				(
					boundsFromSet0, boundsFromSet1
				);

				if (doBoundsOverlap)
				{
					returnValue = true;
					break;
				}
			}
		}

		return returnValue;
	}

	// instance methods

	Bounds.prototype.recalculateMaxAndCenter = function()
	{
		this.max.overwriteWith(this.pos).add(this.size);
		this.center.overwriteWith(this.size).divideScalar(2).add(this.pos);
	}
}
