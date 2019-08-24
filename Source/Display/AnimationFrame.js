
function AnimationFrame(visual, ticksToHold)
{
	this.visual = visual;
	this.ticksToHold = (ticksToHold == null ? 1 : ticksToHold);
}

{
	AnimationFrame.buildManyFromVisuals = function(visualsForFrames)
	{
		var returnValues = [];

		var numberOfVisuals = visualsForFrames.length;

		for (var i = 0; i < numberOfVisuals; i++)
		{
			var visualForFrame = visualsForFrames[i];
			var visualForFrame = visualForFrame;
			var frame = new AnimationFrame(visualForFrame);
			returnValues.push(frame);
		}

		return returnValues;
	}
}
