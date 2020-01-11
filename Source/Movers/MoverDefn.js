
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
	entityDefnCorpse,
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
	this.entityDefnCorpse = entityDefnCorpse;
	this.attributeGroups = attributeGroups;

	this.attributeGroups.addLookupsByName();
}

{
	MoverDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		if (entity.MoverData == null)
		{
			entity.MoverData = new MoverData(entity.MoverDefn);
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
