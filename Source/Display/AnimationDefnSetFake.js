
// data

// hack
function AnimationDefnSetFake(image)
{
	this.image = image;
}

{
	AnimationDefnSetFake.buildFromImage = function(image)
	{
		return new AnimationDefnSetFake(new VisualImageImmediate(image));
	}

	AnimationDefnSetFake.prototype.toRun = function()
	{
		return this.image;
	}
}
