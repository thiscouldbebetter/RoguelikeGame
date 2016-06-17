
function Range(min, max)
{
	this.min = min;
	this.max = max;
}

{
	Range.prototype.clone = function()
	{
		return new Range(this.min, this.max);
	}

	Range.prototype.overlaps = function(other)
	{
		var returnValue =
		(
			this.min < other.max
			&& this.max > other.min
		);

		return returnValue;
	}

	Range.prototype.random = function()
	{
		return this.min + (this.max - this.min) * Globals.Instance.randomizer.getNextRandom();
	}
}
