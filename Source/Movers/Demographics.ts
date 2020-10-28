
class Demographics extends EntityProperty
{
	speciesName: any;
	roleName: string;
	rank: number;
	experienceToKill: number;

	experienceEarned: number;

	control: ControlBase;

	constructor(speciesName: string, roleName: string, rank: number, experienceToKill: number)
	{
		super();
		this.speciesName = speciesName;
		this.roleName = roleName;
		this.rank = rank;
		this.experienceToKill = experienceToKill;

		this.experienceEarned = 0;
	}

	experienceAdd(experienceToAdd: number)
	{
		var wasRankIncreased = false;

		this.experienceEarned += experienceToAdd;
		var experienceNeededToGainRank = 20 * Math.pow(2, (this.rank - 1));
		if (this.experienceEarned >= experienceNeededToGainRank)
		{
			this.rank++;
			wasRankIncreased = true;
		}

		return wasRankIncreased;
	}

	// controls

	controlUpdate(world: World, entity: Entity, pos: Coords)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerDemographics",
				pos,
				new Coords(160, 16, 0), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5, 0),
						new DataBinding
						(
							this,
							(c: Demographics) =>
								c.speciesName + " " + c.roleName + ", Rank: " + c.rank,
							null
						)
					),
				],
				null, null
			);
		}

		return this.control;
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Generatable) { return this; }
}
