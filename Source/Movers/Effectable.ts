
class Effectable2 implements EntityProperty
{
	effects: Effect2[];

	effectsToRemove: Effect2[];

	constructor(effects: Effect2[])
	{
		this.effects = effects || [];
		this.effectsToRemove = [];
	}

	effectApply(effectToApply: Effect2)
	{
		this.effects.push(effectToApply);
	}

	effectorApply(effector: Effector)
	{
		effector.effects.forEach(x => this.effectApply(x));
	}

	updateForTurn(universe: Universe, world: World, place: Place, entityEffectable: Entity)
	{
		this.effectsToRemove.length = 0;

		var effects = this.effects;
		for (var i = 0; i < effects.length; i++)
		{
			var effect = effects[i];
			effect.updateForCycle(universe, world, place, entityEffectable);
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

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
