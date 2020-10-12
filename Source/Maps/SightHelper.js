
class SightHelper
{
	constructor(distanceFromEyeMax)
	{
		this.entitiesPerceivedTransient = [];

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

	entitiesPerceivedTransientRemoveFromMap(map)
	{
		for (var i = 0; i < this.entitiesPerceivedTransient.length; i++)
		{
			var entity = this.entitiesPerceivedTransient[i];
			var cellPos = entity.locatable().loc.pos;
			var cell = map.cellAtPos(cellPos);
			if (cell == null)
			{
				// todo
			}
			else
			{
				var entityPresent = cell.entitiesPresent.filter(x => x == entity)[0];
				if (entityPresent != null)
				{
					cell.entitiesPresent.remove(entityPresent);
				}
			}
		}
	}

	copyNCellsAtPositionsFromMapToOther
	(
		numberOfCellsToCopy, cellPositionsToCopy, mapFrom, mapTo
	)
	{
		for (var i = 0; i < numberOfCellsToCopy; i++)
		{
			var cellPos = cellPositionsToCopy[i];
			var cellToCopy = mapFrom.cellAtPos(cellPos);
			if (cellToCopy != null)
			{
				var cellToOverwrite = mapTo.cellAtPos(cellPos);
				this.overwriteMapCellWithPerceptsFromOther
				(
					cellToOverwrite, cellToCopy
				);
			}
		}
	}

	overwriteMapCellWithPerceptsFromOther(cellTo, cellFrom)
	{
		cellTo.terrainCode = cellFrom.terrainCode;

		var entitiesActual = cellFrom.entitiesPresent;
		var entitiesPerceived = cellTo.entitiesPresent;
		entitiesPerceived.length = 0;

		for (var i = 0; i < entitiesActual.length; i++)
		{
			var entityActual = entitiesActual[i];
			var entityPerceivedProperties =
			[
				entityActual.drawable().clone(),
				entityActual.locatable().clone()
			];

			if (entityActual.openable() != null)
			{
				entityPerceivedProperties.push(entityActual.openable().clone())
			}

			if (entityActual.searchable() != null)
			{
				entityPerceivedProperties.push(entityActual.searchable().clone())
			}

			var entityPerceived = new Entity
			(
				entityActual.name,
				entityPerceivedProperties
			);

			if (entityActual.mover() != null)
			{
				this.entitiesPerceivedTransient.push(entityPerceived);
			}

			entitiesPerceived.push(entityPerceived);
		}

		return this;
	}

	updatePlaceFromCompleteForViewerPosAndRange
	(
		placeKnown, placeComplete, viewerPos, sightRange
	)
	{
		var cellPositionsVisible = this.cellPositionsVisible
		(
			viewerPos, sightRange, placeComplete.map
		);

		var mapComplete = placeComplete.map;
		var mapKnown = placeKnown.map;

		this.entitiesPerceivedTransientRemoveFromMap(mapKnown);

		this.copyNCellsAtPositionsFromMapToOther
		(
			this.numberOfCellsVisible,
			cellPositionsVisible,
			mapComplete,
			mapKnown
		);
	};

	cellPositionsVisible(eyePos, distanceFromEyeMax, map)
	{
		var rangeInitial = new RangeExtent(0, 1);

		var returnValues = this.cellPositionsVisibleForRange
		(
			eyePos, distanceFromEyeMax, map, rangeInitial
		);

		return returnValues;
	}

	cellPositionsVisibleForRange(eyePos, distanceFromEyeMax, map, rangeInitial)
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
						var cellSpan = new RangeExtent
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
	}

	lineOfSightBetweenPointsOnMap(point0, point1, map)
	{
		// hack - Inefficient.
		var displacementBetweenPoints = point1.clone().subtract(point0);
		var distanceBetweenPoints = displacementBetweenPoints.magnitude() + 1;
		var direction = displacementBetweenPoints.normalize();
		var directionInTurns = new Polar().fromCoords(direction).azimuthInTurns;
		var range = new RangeExtent(directionInTurns, directionInTurns);

		var pointsVisibleFromPoint0 = this.cellPositionsVisible
		(
			point0, distanceBetweenPoints, map
		);
		var returnValue = pointsVisibleFromPoint0.some(x => x.equals(point1));
		return returnValue;
	}

	// helper methods

	static RadiansPerTurn = Math.PI * 2;

	atan3(coordsToFind)
	{
		var returnValue = Math.atan2(coordsToFind.y, coordsToFind.x);

		if (returnValue < 0)
		{
			returnValue += SightHelper.RadiansPerTurn;
		}

		returnValue /= SightHelper.RadiansPerTurn;

		return returnValue;
	}

}
