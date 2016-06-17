
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
		for (var i = 0; i < this.ranges.length; i++)
		{
			var rangeThis = this.ranges[i];

			for (var j = 0; j < other.ranges.length; j++)
			{
				var rangeOther = other.ranges[j];

				if (rangeThis.overlaps(rangeOther) == true)
				{
					if (rangeOther.min > rangeThis.min)
					{
						if (rangeOther.max < rangeThis.max)
						{
							var rangeNew = new Range
							(
								rangeOther.max,
								rangeThis.max
							);

							this.ranges.splice
							(
								i + 1, 0, rangeNew
							);
							i++;
						}

						if (rangeThis.min < rangeOther.min)
						{
							rangeThis.max = rangeOther.min;
						}
						else
						{
							this.ranges.splice(i, 1);
							i--;
						}
					}		
					else if (rangeOther.max < rangeThis.max)
					{
						rangeThis.min = rangeOther.max;
					}
					else
					{
						this.ranges.splice(i, 1);
						i--;
					}
				}
			}
		}		
	}
}
