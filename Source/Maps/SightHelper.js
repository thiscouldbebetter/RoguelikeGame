
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

		venueComplete.map.copyNCellsAtPositionsToOther
		(
			fieldOfView.numberOfCellsVisible,
			fieldOfView.cellPositionsVisible,
			mapKnown
		);
	}
}
