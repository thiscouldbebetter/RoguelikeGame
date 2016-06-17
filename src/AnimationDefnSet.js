
function AnimationDefnSet(name, animationDefns)
{
	this.name = name;
	this.animationDefns = animationDefns;

	this.animationDefns.addLookups("name");
}

{
	AnimationDefnSet.buildFromImage = function(image)
	{
		var imageAsImageSets = 
		[
			[
				image
			]
		];

		var returnValue = new AnimationDefnSet
		(
			image.name, 
			AnimationDefn.buildManyFromImageSets
			(
				imageAsImageSets
			)
		);

		return returnValue;
	}

	AnimationDefnSet.buildFromImageForHeadings = function(image, numberOfHeadings)
	{
		var imageAsImageSet = [];
		imageAsImageSet.push(image);
		var imageAsImageSets = [];

		for (var i = 0; i < numberOfHeadings; i++)
		{
			imageAsImageSets.push(imageAsImageSet);
		}

		var returnValue = new AnimationDefnSet
		(
			image.id, 
			AnimationDefn.buildManyFromImageSets
			(
				imageAsImageSets
			)
		);

		return returnValue;
	}

	// instance methods

	AnimationDefnSet.prototype.toRun = function()
	{
		return new AnimationRun(this);
	}

}
