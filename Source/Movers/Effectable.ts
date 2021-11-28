
class Effectable2 implements EntityProperty<Effectable2>
{
	effects: Effect2[];

	effectsToRemove: Effect2[];

	constructor(effects: Effect2[])
	{
		this.effects = effects || [];
		this.effectsToRemove = [];
	}

	effectApply(effectToApply: Effect2): void
	{
		this.effects.push(effectToApply);
	}

	effectorApply(effector: Effector): void
	{
		effector.effects.forEach(x => this.effectApply(x));
	}

	updateForTurn(uwpe: UniverseWorldPlaceEntities): void
	{
		this.effectsToRemove.length = 0;

		var effects = this.effects;
		for (var i = 0; i < effects.length; i++)
		{
			var effect = effects[i];
			effect.updateForCycle(uwpe);
			if (effect.isDone)
			{
				this.effectsToRemove.push(effect);
			}
		}

		for (var i = 0; i < this.effectsToRemove.length; i++)
		{
			var effect = this.effectsToRemove[i];
			this.effects.splice(this.effects.indexOf(effect), 1);
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Effectable2) { return this; }

	// Equatable.
	equals(other: Effectable2) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
