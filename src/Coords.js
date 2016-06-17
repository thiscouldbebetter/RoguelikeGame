
function Coords(x, y)
{
	this.x = x;
	this.y = y;
}

	// instances

	function Coords_Instances()
	{
		if (Coords.Instances != null) { return Coords.Instances; }

		Coords.Instances = this;

		this.Ones 	= new Coords(1, 1);
		this.Twos 	= new Coords(2, 2);
		this.Zeroes 	= new Coords(0, 0);

		this.DirectionE 	= new Coords(1, 0);
		this.DirectionN 	= new Coords(0, -1);
		this.DirectionNE 	= new Coords(1, -1);
		this.DirectionNW 	= new Coords(-1, -1);
		this.DirectionS 	= new Coords(0, 1);
		this.DirectionSE 	= new Coords(1, 1);
		this.DirectionSW 	= new Coords(-1, 1);
		this.DirectionW 	= new Coords(-1, 0);

		this._DirectionsByHeading = 
		[
			this.DirectionE,
			this.DirectionSE,
			this.DirectionS,
			this.DirectionSW,
			this.DirectionW,
			this.DirectionNW,
			this.DirectionN,
			this.DirectionNE,
		];

		this.Temp = new Coords(0, 0);
	}

	new Coords_Instances();

{
	// constants

	Coords.NumberOfDimensions = 2;

	// instance methods

	Coords.prototype.absolute = function()
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);

		return this;
	}

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;

		return this;
	}

	Coords.prototype.clear = function()
	{
		this.x = 0;
		this.y = 0;

		return this;
	}

	Coords.prototype.clone = function()
	{
		var returnValue = new Coords(this.x, this.y);

		return returnValue;
	}

	Coords.prototype.dimension = function(dimensionIndex)
	{
		var returnValue;

		if (dimensionIndex == 0)
		{
			returnValue = this.x;
		}
		else
		{
			returnValue = this.y;
		}

		return returnValue;
	}

	Coords.prototype.dimension_Set = function(dimensionIndex, valueToSet)
	{
		if (dimensionIndex == 0)
		{
			this.x = valueToSet;
		}
		else
		{
			this.y = valueToSet;
		}

		return this;
	}

	Coords.prototype.dimensionIndexOfLargest = function(indexOfDimensionThatLosesTies)
	{
		return this.dimensionIndexOfSmallestOrLargest
		(
			indexOfDimensionThatLosesTies, -1
		);
	}

	Coords.prototype.dimensionIndexOfSmallest = function(indexOfDimensionThatLosesTies)
	{
		return this.dimensionIndexOfSmallestOrLargest
		(
			indexOfDimensionThatLosesTies, 1
		);
	}

	Coords.prototype.dimensionIndexOfSmallestOrLargest = function
	(
		indexOfDimensionThatLosesTies, 
		multiplier
	)
	{
		var returnValue;

		var value = ( Math.abs(this.x) - Math.abs(this.y) ) * multiplier;

		if (value > 0)
		{
			returnValue = 1;
		}
		else if (value < 0)
		{
			returnValue = 0;
		}
		else if (indexOfDimensionThatLosesTies != null)
		{
			returnValue = indexOfDimensionThatLosesTies;
		}

		return returnValue;
	}

	Coords.prototype.directions = function()
	{
		if (this.x > 0)
		{
			this.x = 1;
		}
		else if (this.x < 0)
		{
			this.x = -1;
		}

		if (this.y > 0)
		{
			this.y = 1;
		}
		else if (this.y < 0)
		{
			this.y = -1;
		}

		return this;
	}

	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;

		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;

		return this;
	}

	Coords.prototype.equals = function(other)
	{
		return (this.x == other.x && this.y == other.y);
	}

	Coords.prototype.floor = function()
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

		return this;
	}

	Coords.prototype.invert = function(scalar)
	{
		this.x = 0 - this.x;
		this.y = 0 - this.y;

		return this;
	}

	Coords.prototype.isWithinRange = function(range)
	{
		var returnValue = 
		(
			this.x >= 0 
			&& this.x <= range.x
			&& this.y >= 0
			&& this.y <= range.y
		);

		return returnValue;
	}

	Coords.prototype.magnitude = function()
	{
		var returnValue = Math.sqrt(this.x * this.x + this.y * this.y);

		return returnValue;
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;

		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	Coords.prototype.normalize = function()
	{
		var returnValue;

		var magnitude = this.magnitude();
		if (magnitude == 0)
		{
			returnValue = this;
		}
		{
			returnValue = this.divideScalar(magnitude);
		}

		return returnValue;
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;

		return this;
	}

	Coords.prototype.overwriteWithDimensions = function(x, y)
	{
		this.x = x;
		this.y = y;

		return this;
	}

	Coords.prototype.random = function()
	{
		var randomizer = Globals.Instance.randomizer;

		this.x = Math.floor(this.x * randomizer.getNextRandom());
		this.y = Math.floor(this.y * randomizer.getNextRandom());

		return this;
	}

	Coords.prototype.round = function()
	{
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);

		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;

		return this;
	}

	Coords.prototype.sumOfXAndY = function()
	{
		return this.x + this.y;
	}

	Coords.prototype.toString = function()
	{
		return "(" + this.x + "," + this.y + ")";
	}

	Coords.prototype.trimToRange = function(rangeToTrimTo)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > rangeToTrimTo.x)
		{
			this.x = rangeToTrimTo.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > rangeToTrimTo.y)
		{
			this.y = rangeToTrimTo.y;
		}

		return this;
	}
}
