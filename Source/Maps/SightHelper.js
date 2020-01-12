
function SightHelper(fieldOfView)
{
	this.fieldOfView = fieldOfView;
}

{
	SightHelper.prototype.updatePlaceFromCompleteForViewerPosAndRange = function
	(
		placeKnown, placeComplete, viewerPos, sightRange
	)
	{
		var cellPositionsVisible = this.fieldOfView.cellPositionsVisible
		(
			viewerPos, sightRange, placeComplete.map
		);

		var mapComplete = placeComplete.map;
		var mapKnown = placeKnown.map;

		mapComplete.copyNCellsAtPositionsToOther
		(
			this.fieldOfView.numberOfCellsVisible,
			cellPositionsVisible,
			mapKnown
		);
	};
}
