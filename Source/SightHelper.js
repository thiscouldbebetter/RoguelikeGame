
function SightHelper()
{
	this.fieldOfView = new FieldOfView();
}

{
	SightHelper.prototype.updateVenueFromCompleteForViewerPosAndRange = function
	(
		venueKnown,
		venueComplete,
		viewerPos,
		sightRange
	)
	{
		var fieldOfView = this.fieldOfView;

		fieldOfView.setVenueAndRangeAndViewerPos
		(
			venueComplete,
			sightRange,
			viewerPos
		);

		fieldOfView.calculateCellPositionsVisible();

		venueComplete.map.copyNCellsAtPositionsToOther
		(
			fieldOfView.numberOfCellsVisible,
			fieldOfView.cellPositionsVisible,
			mapKnown
		);
	}
}
