
function FieldOfView()
{
	// do nothing
}

{
	FieldOfView.prototype.setRangeAndViewerPos = function
	(
		distanceFromEyeMax, eyePos
	)
	{
		this.distanceFromEyeMax = distanceFromEyeMax;
		this.eyePos = eyePos;
	}

	FieldOfView.prototype.calculateCellPositionsVisible = function(world, venue)
	{
		var numberOfCellPositionsMax =
			4
			* this.distanceFromEyeMax
			* this.distanceFromEyeMax;

		if
		(
			this.cellPositionsVisible == null
			|| this.cellPositionsVisible.length < numberOfCellPositionsMax
		)
		{
			this.cellPositionsVisible = [];

			for (var i = 0; i < numberOfCellPositionsMax; i++)
			{
				this.cellPositionsVisible.push(new Coords(0, 0));
			}
		}

		var eyePosCentered = this.eyePos.clone().add(new Coords(.5, .5));

		var angleRangeSetNotYetBlocked = new RangeSet
		([
			new Range(0, 1)
		]);

		var displacementFromEyeToCell = new Coords(0, 0);

		var directionsForSides =
		[
			new Coords(-1, 1),
			new Coords(-1, -1),
			new Coords(1, -1),
			new Coords(1, 1),
		];

		var cornerAddendsForSides =
		[
			new Coords(0, 0),
			new Coords(0, -1),
			new Coords(1, 0),
			new Coords(0, 1),
		];

		var cellPos = new Coords(0, 0, 0);
		var cellPosRelative = new Coords(0, 0, 0);
		var vertexPositionsRelative = [ new Coords(0, 0, 0), new Coords(0, 0, 0) ];

		this.cellPositionsVisible[0] = this.eyePos.clone();
		this.numberOfCellsVisible = 1;

		var map = venue.map;

		for (var r = 1; r <= this.distanceFromEyeMax; r++)
		{
			cellPosRelative.overwriteWithDimensions(r, 0, 0);

			vertexPositionsRelative[0].overwriteWith(new Coords(r - .5, -.5));
			vertexPositionsRelative[1].overwriteWith(new Coords(r - .5, .5));

			for (var s = 0; s < directionsForSides.length; s++)
			{
				var direction = directionsForSides[s];

				vertexPositionsRelative[1].add(cornerAddendsForSides[s]);

				for (var d = 0; d < r; d++)
				{
					cellPos.overwriteWith(this.eyePos).add(cellPosRelative);

					if (cellPos.isInRangeMax(map.sizeInCellsMinusOnes) == true)
					{
						var cellSpan = new Range
						(
							this.atan3(vertexPositionsRelative[0]),
							this.atan3(vertexPositionsRelative[1])
						);

						var cellSpanAsSet = new RangeSet( [ cellSpan ] );

						cellSpanAsSet.splitRangesThatSpanPeriod(1);

						if (cellSpanAsSet.overlaps(angleRangeSetNotYetBlocked) == true)
						{
							var cellPosVisible = this.cellPositionsVisible
							[
								this.numberOfCellsVisible
							];

							cellPosVisible.overwriteWith
							(
								cellPos
							);

							this.numberOfCellsVisible++;

							var cellAtPos = map.cellAtPos(cellPos);
							if (cellAtPos.terrain.blocksVision == true)
							{
								angleRangeSetNotYetBlocked.subtract
								(
									cellSpanAsSet
								);
							}
							else
							{
								var entitiesPresent = map.cellAtPos
								(
									cellPos
								).entitiesPresent;

								for (var b = 0; b < entitiesPresent.length; b++)
								{
									var entityPresent = entitiesPresent[b];
									if (entityPresent.defn(world).Collidable.blocksView == true)
									{
										angleRangeSetNotYetBlocked.subtract(cellSpanAsSet);
									}
								}
							}
						}
					}

					cellPosRelative.add(direction);
					vertexPositionsRelative[0].overwriteWith(vertexPositionsRelative[1]);
					vertexPositionsRelative[1].add(direction);
				}
			}
		}
	}

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
	}
}
