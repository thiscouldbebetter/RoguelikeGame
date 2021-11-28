
class Effect2
{
	start: (uwpe: UniverseWorldPlaceEntities) => void;
	update: (uwpe: UniverseWorldPlaceEntities) => void;
	finish: (uwpe: UniverseWorldPlaceEntities) => void;

	cyclesSoFar: number;
	durationInCycles: number;
	isDone: boolean;

	constructor
	(
		start: (uwpe: UniverseWorldPlaceEntities) => void,
		update: (uwpe: UniverseWorldPlaceEntities) => void,
		finish: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.start = start;
		this.update = update;
		this.finish = finish;
	}

	updateForCycle(uwpe: UniverseWorldPlaceEntities): void
	{
		// A "cycle" could be either a tick or a turn.

		if (this.cyclesSoFar == null)
		{
			this.cyclesSoFar = 0;
			this.isDone = false;

			if (this.start != null)
			{
				this.start(uwpe);
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
				this.update(uwpe);
			}

			if (this.cyclesSoFar >= this.durationInCycles)
			{
				this.isDone = true;
				if (this.finish != null)
				{
					this.finish(uwpe);
				}
			}

			this.cyclesSoFar++;
		}
	}

	// Cloneable.

	clone(): Effect2
	{
		return new Effect2(this.start, this.update, this.finish);
	}
}
