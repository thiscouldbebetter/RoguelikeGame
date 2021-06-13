
class Traitable implements EntityProperty
{
	traitsBase: Trait[];
	traitsBaseByName: Map<string, Trait>;

	_traitsAdjusted: Trait[];
	_traitsAdjustedByName: Map<string, Trait>;

	_control: ControlBase;

	constructor
	(
		strength: number, dexterity: number, constitution: number, 
		intelligence: number, wisdom: number, charisma: number
	)
	{
		this.traitsBase =
		[
			new Trait(Trait.Strength, strength),
			new Trait(Trait.Dexterity, dexterity),
			new Trait(Trait.Constitution, constitution),
			new Trait(Trait.Intelligence, intelligence),
			new Trait(Trait.Wisdom, wisdom),
			new Trait(Trait.Charisma, charisma)
		];
		this.traitsBaseByName = ArrayHelper.addLookupsByName(this.traitsBase);
	}

	static random(randomizer: Randomizer): Traitable
	{
		var diceRoll = DiceRoll.fromExpression("3d6");
		var traitValues = new Array<number>();
		var traitCount = 6;
		for (var i = 0; i < traitCount; i++)
		{
			var traitValue = diceRoll.roll(randomizer);
			traitValues.push(traitValue);
		}
		var returnValue = new Traitable
		(
			traitValues[0], traitValues[1], traitValues[2],
			traitValues[3], traitValues[4], traitValues[5]
		);
		return returnValue;
	}

	traitsAdjusted(): Trait[]
	{
		if (this._traitsAdjusted == null)
		{
			this._traitsAdjusted = ArrayHelper.clone(this.traitsBase);
			this._traitsAdjustedByName =
				ArrayHelper.addLookupsByName(this._traitsAdjusted);
		}
		return this._traitsAdjusted;
	}
	
	traitsAdjustedRecalculate(): Trait[]
	{
		this._traitsAdjusted = null;
		return this.traitsAdjusted();
	}

	// accessors

	strength(): number
	{
		return this._traitsAdjustedByName.get(Trait.Strength).value;
	}

	dexterity(): number
	{
		return this._traitsAdjustedByName.get(Trait.Dexterity).value;
	}

	constitution(): number
	{
		return this._traitsAdjustedByName.get(Trait.Constitution).value;
	}

	intelligence(): number
	{
		return this._traitsAdjustedByName.get(Trait.Intelligence).value;
	}

	wisdom(): number
	{
		return this._traitsAdjustedByName.get(Trait.Wisdom).value;
	}

	charisma(): number
	{
		return this._traitsAdjustedByName.get(Trait.Charisma).value;
	}

	// controls

	toControl(world: World, entity: Entity, pos: Coords)
	{
		if (this._control == null)
		{
			this._control = ControlContainer.from4
			(
				"containerTraits",
				pos,
				Coords.fromXY(160, 16), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5, 0),
						DataBinding.fromContextAndGet
						(
							this,
							(c: Traitable) =>
							{
								c.traitsAdjusted().map
								(
									(x: Trait) => x.toString()
								).join(" ");
							}
						)
					),
				]
			);
		}

		return this._control;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

class Trait
{
	name: string;
	value: number;

	static Strength: string = "Strength";
	static Dexterity: string = "Dexterity";
	static Constitution: string = "Constitution";
	static Intelligence: string = "Intelligence";
	static Wisdom: string = "Wisdom";
	static Charisma: string = "Charisma";

	constructor(name: string, value: number)
	{
		this.name = name;
		this.value = value;
	}

	toString(): string
	{
		return this.name.substr(0, 3) + ": " + this.value;
	}
}
