
function AnimationDefn(name, animationDefnNameNext, frames)
{
	this.name = name;
	this.animationDefnNameNext = animationDefnNameNext;
	this.frames = frames;
}

{
	AnimationDefn.buildManyFromImageSets = function(imageSetsForFrames)
	{
		var returnValues = [];

		var numberOfImageSets = imageSetsForFrames.length;

		for (var i = 0; i < numberOfImageSets; i++)
		{
			var imageSet = imageSetsForFrames[i];

			var animationDefn = new AnimationDefn
			(
				"" + i,
				"" + i,
				AnimationFrame.buildManyFromImages(imageSet)
			);

			returnValues.push(animationDefn);
		}

		return returnValues;
	}
}
