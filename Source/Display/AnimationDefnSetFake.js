
// data

// hack
function AnimationDefnSetFake(visual)
{
	this.visual = visual;
}

{
	AnimationDefnSetFake.prototype.toRun = function()
	{
		return this.visual;
	}
}
