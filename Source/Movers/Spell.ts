
class Spell
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: Spell_Instances;
	static Instances()
	{
		if (Spell._instances == null)
		{
			Spell._instances = new Spell_Instances();
		}
		return Spell._instances;
	}
}

class Spell_Instances
{
	DoNothing: Spell;

	_All: Spell[];
	_AllByName: Map<string, Spell>;

	constructor()
	{
		this.DoNothing = new Spell("DoNothing");

		this._All =
		[
			this.DoNothing
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

class SpellCaster implements EntityProperty<SpellCaster>
{
	spellKnowledges: SpellKnowledge[];

	spellKnowledgesByName: Map<string, SpellKnowledge>;

	constructor(spellKnowledges: SpellKnowledge[])
	{
		this.spellKnowledges = spellKnowledges;

		this.spellKnowledgesByName = ArrayHelper.addLookups
		(
			this.spellKnowledges, x => x.spellName
		);
	}

	spellCastByName(u: Universe, w: World, p: Place, e: Entity, spellName: string)
	{
		var spellKnowledge = this.spellKnowledgesByName.get(spellName);

		var message;

		if (spellKnowledge == null)
		{
			message = "You don't know that spell.";
		}
		else
		{
			message = "Spell not yet implemented!";
		}

		var player = (e as Entity2).player();
		var messageLog = player.messageLog;
		messageLog.messageAdd(message);
	}

	spellForgetByName(spellName: string)
	{
		var spellKnowledge = this.spellKnowledgesByName.get(spellName);
		if (spellKnowledge != null)
		{
			ArrayHelper.remove(this.spellKnowledges, spellKnowledge);
			this.spellKnowledgesByName.delete(spellName);
		}
	}

	spellKnowledgeAdd(spellKnowledge: SpellKnowledge)
	{
		this.spellKnowledges.push(spellKnowledge);
		this.spellKnowledgesByName.set(spellKnowledge.spellName, spellKnowledge);
	}

	spellLearnByName(uwpe: UniverseWorldPlaceEntities, spellName: string): void
	{
		var world = uwpe.world as World2;
		var entity = uwpe.entity as Entity2;

		var spellKnowledge = this.spellKnowledgesByName.get(spellName);

		var message;

		if (spellKnowledge == null)
		{
			message = this.spellLearnByName_Try(uwpe, spellName);
		}
		else if (spellKnowledge.isExpired(world) )
		{
			message = "You re-learn the spell."
			spellKnowledge.turnLearned = world.turnsSoFar;
		}
		else
		{
			message = "You already know this spell."
		}

		var player = entity.player();
		var messageLog = player.messageLog;
		messageLog.messageAdd(message);

		//return message;
	}

	spellLearnByName_Try
	(
		uwpe: UniverseWorldPlaceEntities, spellName: string
	): string
	{
		var universe = uwpe.universe;
		var world = uwpe.world as World2;

		var message;

		var chanceOfLearningSpell = 1;
		var randomNumber = universe.randomizer.getNextRandom();
		if (randomNumber >= chanceOfLearningSpell)
		{
			message = "You fail to learn the spell."
			// todo - Consequences.
		}
		else
		{
			message = "You learn the spell '" + spellName + "'.";
			var spellKnowledge = new SpellKnowledge(spellName, world.turnsSoFar);
			this.spellKnowledgeAdd(spellKnowledge);
		}

		return message;
	}

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable.
	equals(other: SpellCaster) { return false; }
}

class SpellKnowledge
{
	spellName: string;
	turnLearned: number;

	static RetentionInTurns = 3000; // todo

	constructor(spellName: string, turnLearned: number)
	{
		this.spellName = spellName;
		this.turnLearned = turnLearned;
	}

	isExpired(w: World)
	{
		var world = w as World2;

		var turnsKnown = world.turnsSoFar - this.turnLearned;
		var isExpired = (turnsKnown >= SpellKnowledge.RetentionInTurns);

		return isExpired;
	}
}
