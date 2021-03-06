"use strict";
class RangeSet {
    constructor(ranges) {
        this.ranges = ranges;
    }
    overlapsWith(other) {
        var returnValue = false;
        for (var i = 0; i < this.ranges.length; i++) {
            var rangeThis = this.ranges[i];
            for (var j = 0; j < other.ranges.length; j++) {
                var rangeOther = other.ranges[j];
                if (rangeThis.overlapsWith(rangeOther) == true) {
                    returnValue = true;
                    i = this.ranges.length;
                    break;
                }
            }
        }
        return returnValue;
    }
    splitRangesThatSpanPeriod(period) {
        for (var i = 0; i < this.ranges.length; i++) {
            var range = this.ranges[i];
            if (range.min > range.max) {
                var rangePart0 = new RangeExtent(0, range.max);
                var rangePart1 = new RangeExtent(range.min, period);
                this.ranges.splice(i, 1, rangePart0, rangePart1);
                i++;
            }
        }
    }
    subtract(other) {
        var rangesCurrent = this.ranges;
        var doAnyRangesOverlap = true;
        while (doAnyRangesOverlap == true) {
            doAnyRangesOverlap = false;
            for (var i = 0; i < rangesCurrent.length; i++) {
                var rangeThis = rangesCurrent[i];
                for (var j = 0; j < other.ranges.length; j++) {
                    var rangeOther = other.ranges[j];
                    if (rangeThis.overlapsWith(rangeOther) == true) {
                        doAnyRangesOverlap = true;
                        var rangesSubtracted = rangeThis.subtract(rangeOther);
                        rangesCurrent.splice(i, 1);
                        for (var k = rangesSubtracted.length - 1; k >= 0; k--) {
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
