function RangeSet(ranges)
{
	this.ranges = ranges;
}
{
	RangeSet.prototype.overlaps = function(other)
	{
		var returnValue = false;

		for (var i = 0; i < this.ranges.length; i++)
		{
			var rangeThis = this.ranges[i];

			for (var j = 0; j < other.ranges.length; j++)
			{
				var rangeOther = other.ranges[j];

				if (rangeThis.overlaps(rangeOther) == true)
				{
					returnValue = true;
					i = this.ranges.length;
					break;
				}
			}
		}		

		return returnValue;
	}

	RangeSet.prototype.splitRangesThatSpanPeriod = function(period)
	{
		for (var i = 0; i < this.ranges.length; i++)
		{
			var range = this.ranges[i];

			if (range.min > range.max)
			{
				var rangePart0 = new Range(0, range.max);
				var rangePart1 = new Range(range.min, period);

				this.ranges.splice(i, 1, rangePart0, rangePart1);	
				i++;
			}
		}
	}

	RangeSet.prototype.subtract = function(other)
	{
		var rangesCurrent = this.ranges;

		var doAnyRangesOverlap = true;

		while (doAnyRangesOverlap == true)
		{
			doAnyRangesOverlap = false;

			for (var i = 0; i < rangesCurrent.length; i++)
			{
				var rangeThis = rangesCurrent[i];
	
				for (var j = 0; j < other.ranges.length; j++)
				{
					var rangeOther = other.ranges[j];
	
					if (rangeThis.overlaps(rangeOther) == true)
					{
						doAnyRangesOverlap = true;
						var rangesSubtracted = rangeThis.subtract
						(
							rangeOther
						);
						rangesCurrent.splice(i, 1);
						for (var k = rangesSubtracted.length - 1; k >= 0; k--)
						{
							rangesCurrent.splice(i, 0, rangesSubtracted[k]);
						}
						break;
					}
				}
			}
		}

		this.ranges = rangesCurrent;
	}
}
