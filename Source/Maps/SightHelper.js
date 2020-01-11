
function SightHelper()
{
	this.fieldOfView = new FieldOfView();
}

{
	SightHelper.prototype.updatePlaceFromCompleteForViewerPosAndRange = function
	(
		world,
		placeKnown,
		placeComplete,
		viewerPos,
		sightRange
	)
	{
		var fieldOfView = this.fieldOfView;

		fieldOfView.setRangeAndViewerPos(sightRange, viewerPos);

		fieldOfView.calculateCellPositionsVisible(world, placeComplete);

		var mapComplete = placeComplete.map;
		var mapKnown = placeKnown.map;

		mapComplete.copyNCellsAtPositionsToOther
		(
			fieldOfView.numberOfCellsVisible,
			fieldOfView.cellPositionsVisible,
			mapKnown
		);
	}
}
