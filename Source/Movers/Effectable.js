
class Effectable
{
	constructor(effects)
	{
		this.effects = effects || [];
		this.effectsToRemove = [];
	}

	effectorApply(effector)
	{
		var effectsToApply = effector.effects;
		for (var i = 0; i < effectsToApply.length; i++)
		{
			var effectToApply = effectsToApply[i];
			this.effects.add(effectToApply);
		}
	}

	updateForTurn(universe, world, place, entityEffectable)
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
			this.effects.remove(effect);
		}
	}
}
