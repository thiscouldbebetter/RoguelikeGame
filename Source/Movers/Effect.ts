
class Effect2
{
	start: any;
	update: any;
	finish: any;

	cyclesSoFar: number;
	durationInCycles: number;
	isDone: boolean;

	constructor(start: any, update: any, finish: any)
	{
		this.start = start;
		this.update = update;
		this.finish = finish;
	}

	updateForCycle
	(
		universe: Universe, world: World, place: Place,
		entityEffectable: Entity
	)
	{
		// A "cycle" could be either a tick or a turn.

		if (this.cyclesSoFar == null)
		{
			this.cyclesSoFar = 0;
			this.isDone = false;

			if (this.start != null)
			{
				this.start(universe, world, place, entityEffectable);
			}
		}

		if (this.durationInCycles == null)
		{
			// If no duration was set by start(), it's instantaneous.
			this.isDone = true;
		}
		else
		{
			if (this.update != null)
			{
				this.update(universe, world, place, entityEffectable);
			}

			if (this.cyclesSoFar >= this.durationInCycles)
			{
				this.isDone = true;
				if (this.finish != null)
				{
					this.finish(universe, world, place, entityEffectable);
				}
			}

			this.cyclesSoFar++;
		}
	}

	// Cloneable.

	clone()
	{
		return new Effect2(this.start, this.update, this.finish);
	}
}
