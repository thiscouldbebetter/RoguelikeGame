
function SightHelper()
{
	this.fieldOfView = new FieldOfView();
}

{
	SightHelper.prototype.updateVenueFromCompleteForViewerPosAndRange = function
	(
		world,
		venueKnown,
		venueComplete,
		viewerPos,
		sightRange
	)
	{
		var fieldOfView = this.fieldOfView;

		fieldOfView.setRangeAndViewerPos(sightRange, viewerPos);

		fieldOfView.calculateCellPositionsVisible(world, venueComplete);

		var mapComplete = venueComplete.map;
		var mapKnown = venueKnown.map;

		mapComplete.copyNCellsAtPositionsToOther
		(
			fieldOfView.numberOfCellsVisible,
			fieldOfView.cellPositionsVisible,
			mapKnown
		);
	}
}
