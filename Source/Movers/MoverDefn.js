
function MoverDefn
(
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
	MoverDefn.prototype.name = function() { return "Mover"; }

	MoverDefn.prototype.initializeEntityForVenue = function(world, entity, venue)
	{
		entity.moverData = new MoverData(entity.defn(world).Mover);
	}

	MoverDefn.prototype.updateEntityForVenue = function(world, entity, venue)
	{
		var entityLoc = entity.loc;

		entityLoc.posInCells.trimToRangeMax
		(
			venue.map.sizeInCellsMinusOnes
		);
	}
}
