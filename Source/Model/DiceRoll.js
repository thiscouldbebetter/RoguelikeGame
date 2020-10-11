
class DiceRoll
{
	constructor(expression)
	{
		this.expression = expression;
	}

	// static methods

	static roll(randomizer, expression)
	{
		var diceRoll = DiceRoll.Instance;
		diceRoll.overwriteWithExpression(expression)
		var returnValue = diceRoll.roll(randomizer);
		return returnValue;
	}

	// instances

	static Instance = new DiceRoll("1");

	// instance methods

	overwriteWithExpression(expression)
	{
		this.expression = expression;

		return this;
	}

	roll(randomizer)
	{
		var expression = this.expression;

		var totalSoFar = 0;

		var terms =
		(
			expression.indexOf("+") < 0
			? [expression]
			: expression.split("+")
		);

		for (var t = 0; t < terms.length; t++)
		{
			var term = terms[t];

			if (term.indexOf("d") < 0)
			{
				var valueConstant = parseInt(term);
				totalSoFar += valueConstant;
			}
			else
			{
				var tokens = term.split("d");
				var numberOfDice = parseInt(tokens[0]);
				var sidesPerDie = parseInt(tokens[1]);

				for (var i = 0; i < numberOfDice; i++)
				{
					var valueRolledOnDie =
						1
						+ Math.floor
						(
							randomizer.getNextRandom()
							* sidesPerDie
						);

					totalSoFar += valueRolledOnDie;
				}
			}
		}

		return totalSoFar;
	}
}
