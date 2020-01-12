
function FieldOfView(distanceFromEyeMax)
{
	this._cellPositionsVisible = [];
	var numberOfCellPositionsMax =
		4
		* distanceFromEyeMax
		* distanceFromEyeMax;

	for (var i = 0; i < numberOfCellPositionsMax; i++)
	{
		this._cellPositionsVisible.push(new Coords(0, 0));
	}

	this.numberOfCellsVisible = 0;

	// Helper variables.

	this.directionsForSides =
	[
		new Coords(-1, 1), new Coords(-1, -1),
		new Coords(1, -1), new Coords(1, 1)
	];

	this.cornerAddendsForSides =
	[
		new Coords(0, 0), new Coords(0, -1),
		new Coords(1, 0), new Coords(0, 1)
	];

	this._cellPos = new Coords();
	this._cellPosRelative = new Coords();
	this._eyePosCentered = new Coords();
	this._vertexPositionsRelative =
	[
		new Coords(), new Coords()
	];
}

{
	FieldOfView.prototype.cellPositionsVisible = function(eyePos, distanceFromEyeMax, map)
	{
		var rangeInitial = new Range(0, 1);

		var returnValues = this.cellPositionsVisibleForRange
		(
			eyePos, distanceFromEyeMax, map, rangeInitial
		);

		return returnValues;
	};

	FieldOfView.prototype.cellPositionsVisibleForRange = function(eyePos, distanceFromEyeMax, map, rangeInitial)
	{
		var coordsInstances = Coords.Instances();

		var eyePosCentered = this._eyePosCentered.overwriteWith
		(
			eyePos
		).add
		(
			coordsInstances.HalfHalfZero
		);

		var angleRangeSetNotYetBlocked = new RangeSet([ rangeInitial ]);

		var cellPos = this._cellPos;
		var cellPosRelative = this._cellPosRelative;
		var vertexPositionsRelative = this._vertexPositionsRelative;

		this._cellPositionsVisible[0].overwriteWith(eyePos);
		this.numberOfCellsVisible = 1;

		for (var r = 1; r <= distanceFromEyeMax; r++)
		{
			cellPosRelative.overwriteWithDimensions(r, 0, 0);
			var vertexPosRelative0 = vertexPositionsRelative[0];
			var vertexPosRelative1 = vertexPositionsRelative[1];

			vertexPosRelative0.overwriteWithDimensions(r - .5, -.5, 0);
			vertexPosRelative1.overwriteWithDimensions(r - .5, .5, 0);

			for (var s = 0; s < this.directionsForSides.length; s++)
			{
				var direction = this.directionsForSides[s];
				var cornerAddend = this.cornerAddendsForSides[s];

				vertexPosRelative1.add(cornerAddend);

				for (var d = 0; d < r; d++)
				{
					cellPos.overwriteWith(eyePos).add(cellPosRelative);

					var isCellInMapBounds =
						cellPos.isInRangeMax(map.sizeInCellsMinusOnes);

					if (isCellInMapBounds)
					{
						var cellSpan = new Range
						(
							this.atan3(vertexPosRelative0),
							this.atan3(vertexPosRelative1)
						);

						var cellSpanAsSet = new RangeSet( [ cellSpan ] );

						cellSpanAsSet.splitRangesThatSpanPeriod(1);

						var doesOverlap = cellSpanAsSet.overlapsWith
						(
							angleRangeSetNotYetBlocked
						);

						if (doesOverlap)
						{
							var cellPosVisible = this._cellPositionsVisible
							[
								this.numberOfCellsVisible
							];
							cellPosVisible.overwriteWith(cellPos);
							this.numberOfCellsVisible++;

							var cellAtPos = map.cellAtPos(cellPos);
							var doesCellBlockVision = cellAtPos.blocksVision(map);

							if (doesCellBlockVision)
							{
								angleRangeSetNotYetBlocked.subtract
								(
									cellSpanAsSet
								);
							}
						}
					}

					cellPosRelative.add(direction);
					vertexPosRelative0.overwriteWith(vertexPosRelative1);
					vertexPosRelative1.add(direction);
				}
			}
		}

		return this._cellPositionsVisible;
	};

	FieldOfView.prototype.lineOfSightBetweenPointsOnMap = function(point0, point1, map)
	{
		// hack - Inefficient.
		var displacementBetweenPoints = point1.clone().subtract(point0);
		var distanceBetweenPoints = displacementBetweenPoints.magnitude() + 1;
		var direction = displacementBetweenPoints.normalize();
		var directionInTurns = new Polar().fromCoords(direction).azimuthInTurns;
		var range = new Range(directionInTurns, directionInTurns);

		var pointsVisibleFromPoint0 = this.cellPositionsVisible
		(
			point0, distanceBetweenPoints, map
		);
		var returnValue = pointsVisibleFromPoint0.some(x => x.equals(point1));
		return returnValue;
	};

	// helper methods

	FieldOfView.RadiansPerTurn = Math.PI * 2;

	FieldOfView.prototype.atan3 = function(coordsToFind)
	{
		var returnValue = Math.atan2(coordsToFind.y, coordsToFind.x);

		if (returnValue < 0)
		{
			returnValue += FieldOfView.RadiansPerTurn;
		}

		returnValue /= FieldOfView.RadiansPerTurn;

		return returnValue;
	};
}
