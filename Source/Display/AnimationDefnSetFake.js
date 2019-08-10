
// data

// hack
function AnimationDefnSetFake(image)
{
	this.image = image;
}

{
	AnimationDefnSetFake.buildFromImage = function(image)
	{
		return new AnimationDefnSetFake(image);
	}

	AnimationDefnSetFake.prototype.toRun = function()
	{
		return this.image;
	}
}
