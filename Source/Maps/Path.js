
function Path(map, startPos, goalPos)
{
	this.map = map;
	this.startPos = startPos;
	this.goalPos = goalPos;

	this.tempPos = new Coords();
}

{
	Path.prototype.calculate = function()
	{
		var map = this.map;
		var startPos = this.startPos.clone();
		var goalPos = this.goalPos.clone();

		var openList = [];
		var openLookup = [];
		var closedLookup = [];

		var tempPos = this.tempPos;

		var startNode = new PathNode
		(
			startPos,
			0,
			tempPos.overwriteWith
			(
				goalPos
			).subtract
			(
				startPos
			).absolute().clearZ().sumOfDimensions(),
			null
		);

		openList.push(startNode);
		var startIndex =
			"_" +
			(
				startNode.cellPos.y
				* map.sizeInCells.x
				+ startNode.cellPos.x
			);

		openLookup[startIndex] = startNode;

		while (openList.length > 0)
		{
			var current = openList[0];

			if (current.cellPos.equalsXY(goalPos) == true)
			{
				this.nodes = [];

				while (current != null)
				{
					this.nodes.splice(0, 0, current);
					current = current.prev;
				}
				break;
			}

			openList.splice(0, 1);
			var currentIndex =
				"_" +
				(
					current.cellPos.y
					* map.sizeInCells.x
					+ current.cellPos.x
				);

			delete openLookup[currentIndex];

			closedLookup[currentIndex] = current;

			var neighbors = this.getNeighborsForNode(map, current, goalPos);

			for (var n = 0; n < neighbors.length; n++)
			{
				var neighbor = neighbors[n];
				var neighborPos = neighbor.cellPos;

				var neighborIndex =
					"_" +
					(
						neighborPos.y
						* map.sizeInCells.x
						+ neighborPos.x
					);

				if (closedLookup[neighborIndex] == null && openLookup[neighborIndex] == null)
				{
					var i;
					for (i = 0; i < openList.length; i++)
					{
						var nodeFromOpenList = openList[i];
						if (neighbor.costFromStart < nodeFromOpenList.costFromStart)
						{
							break;
						}
					}

					openList.splice(i, 0, neighbor);
					openLookup[neighborIndex] = neighbor;
				}
			}
		}
	}

	Path.prototype.getNeighborsForNode = function(map, node, goalPos)
	{
		var returnValues = [];
		var originalPos = node.cellPos;
		var neighborPos = originalPos.clone();

		var neighborPositions = [];

		var mapSizeInCellsMinusOnes = map.sizeInCellsMinusOnes;
		var directions = Direction.Instances()._ByHeading;

		for (var i = 0; i < directions.length; i++)
		{
			var direction = directions[i];
			neighborPos.overwriteWith(originalPos).add(direction);

			if (neighborPos.isInRangeMax(mapSizeInCellsMinusOnes) == true)
			{
				neighborPositions.push(neighborPos.clone());
			}
		}

		var tempPos = this.tempPos;

		for (var i = 0; i < neighborPositions.length; i++)
		{
			var neighborPos = neighborPositions[i];

			var costToTraverse = map.cellAtPos
			(
				neighborPos
			).terrain(map).costToTraverse;

			costToTraverse *= tempPos.overwriteWith
			(
				neighborPos
			).subtract
			(
				originalPos
			).magnitude();

			var neighborNode = new PathNode
			(
				neighborPos,
				node.costFromStart + costToTraverse,
				costToTraverse + tempPos.overwriteWith
				(
					goalPos
				).subtract
				(
					neighborPos
				).absolute().clearZ().sumOfDimensions(),
				node
			);

			returnValues.push(neighborNode);
		}

		return returnValues;
	}
}
