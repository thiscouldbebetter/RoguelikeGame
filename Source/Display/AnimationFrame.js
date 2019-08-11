
function AnimationFrame(visual, ticksToHold)
{
	this.visual = visual;
	this.ticksToHold = ticksToHold;
}

{
	AnimationFrame.buildManyFromImages = function(imagesForFrames)
	{
		var returnValues = [];

		var numberOfImages = imagesForFrames.length;

		for (var i = 0; i < numberOfImages; i++)
		{
			var imageForFrame = imagesForFrames[i];
			var visualForFrame = new VisualImageImmediate(imageForFrame);
			var frame = new AnimationFrame
			(
				visualForFrame,
				1 // ticksToHold
			);

			returnValues.push(frame);
		}

		return returnValues;
	}
}
