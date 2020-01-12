
function MoverDefn
(
	name,
	difficulty,
	movesPerTurn,
	demographics,
	traits,
	skills,
	spells,
	vitals,
	itemDefnCorpse,
	die,
	attributeGroups
)
{
	this.name = name;
	this.difficulty = difficulty;
	this.movesPerTurn = movesPerTurn;
	this.demographics = demographics;
	this.traits = traits;
	this.skills = skills;
	this.spells = spells;
	this.vitals = vitals;
	this.itemDefnCorpse = itemDefnCorpse;
	this.die = die;
	this.attributeGroups = attributeGroups.addLookupsByName();
}

{
	MoverDefn.prototype.initializeEntityForPlace = function(universe, world, place, entity)
	{
		if (entity.MoverData == null)
		{
			entity.MoverData = new MoverData(entity.MoverDefn);
		}

		if (entity.Turnable == null)
		{
			entity.Turnable = new Turnable
			(
				function updateForTurn(universe, world, place, entity)
				{
					entity.MoverData.movesThisTurn += entity.MoverDefn.movesPerTurn;
					entity.Turnable.hasActedThisTurn = false;
				}
			);
		}
	};

	MoverDefn.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		var entityLoc = entity.Locatable.loc;

		entityLoc.pos.trimToRangeMax
		(
			place.map.sizeInCellsMinusOnes
		);
	};
}
