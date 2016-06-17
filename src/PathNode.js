
function PathNode(cellPos, costFromStart, costToGoalEstimated, prev)
{
	this.cellPos = cellPos;
	this.costFromStart = costFromStart;
	this.costToGoalEstimated = costToGoalEstimated;
	this.prev = prev;
}
