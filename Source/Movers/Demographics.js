
function Demographics(species, role, rank, experienceToKill)
{
	this.species = species;
	this.role = role;
	this.rank = rank;
	this.experienceToKill = experienceToKill;

	this.experienceEarned = 0;
}

{
	Demographics.prototype.experienceAdd = function(experienceToAdd)
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
	};

	// controls

	Demographics.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerDemographics",
				pos,
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText
					(
						new Coords(10, 5),
						new DataBinding
						(
							this,
							function get(c) { return c.species + " " + c.role + ", Rank: " + c.rank; }
						)
					),
				]
			);
		}

		return this.control;
	};
}
