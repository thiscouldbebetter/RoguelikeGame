
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

	Range.prototype.subtract = function(other)
	{
		var returnValues = [];

		if (this.overlaps(other) == true)
		{
			if (this.min <= other.min)
			{
				var segment = new Range(this.min, other.min);
				returnValues.push(segment);
			}

			if (this.max >= other.max)
			{
				var segment = new Range(other.max, this.max);
				returnValues.push(segment);
			}
		}
		else
		{
			returnValues.push(this);
		}

		return returnValues;
	}

}
