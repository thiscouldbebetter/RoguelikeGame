
function AnimationRun(animationDefnSet)
{
	this.animationDefnSet = animationDefnSet;

	var animationDefns= this.animationDefnSet.animationDefns;
	this.animationDefnNameCurrent = animationDefns[0].name;
	this.frameIndexCurrent = 0;
	this.ticksOnFrameCurrent = 0;

	this.visualForFrameCurrent = this.frameCurrent().visual.cloneAsVisual();
}

{
	AnimationRun.prototype.advance = function()
	{
		var frameCurrent = this.frameCurrent();

		this.ticksOnFrameCurrent++;

		if (this.ticksOnFrameCurrent >= frameCurrent.ticksToHold)
		{
			this.ticksOnFrameCurrent = 0;

			this.frameIndexCurrent++;

			var animationDefnCurrent = this.animationDefnCurrent();

			if (this.frameIndexCurrent >= animationDefnCurrent.frames.length)
			{
				this.animationDefnNameCurrent_Set
				(
					animationDefnCurrent.animationDefnNameNext
				);
				this.frameIndexCurrent = 0;
			}
		}
	}

	AnimationRun.prototype.animationDefnCurrent = function()
	{
		return this.animationDefnSet.animationDefns[this.animationDefnNameCurrent];
	}

	AnimationRun.prototype.animationDefnNameCurrent_Set = function(value)
	{
		if (this.animationDefnNameCurrent != value)
		{
			this.animationDefnNameCurrent = value;
			this.frameIndexCurrent = 0;
		}
	}

	AnimationRun.prototype.clone = function()
	{
		return new AnimationRun(this.animationDefnSet);
	}

	AnimationRun.prototype.cloneAsVisual = function()
	{
		return this.clone();
	}

	AnimationRun.prototype.frameCurrent = function()
	{
		return this.animationDefnCurrent().frames[this.frameIndexCurrent];
	}

	AnimationRun.prototype.drawToGraphicsAtPos = function(graphics, drawPos)
	{
		this.visualForFrameCurrent.drawToGraphicsAtPos(graphics, drawPos);
	}

	AnimationRun.prototype.updateForVenue = function(entity)
	{
		this.advance();
	}
}
