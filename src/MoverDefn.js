
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

	this.attributeGroups.addLookups("name");
}

{
	MoverDefn.prototype.name = function() { return "Mover"; }

	MoverDefn.prototype.initializeEntityForVenue = function(entity)
	{
		entity.moverData = new MoverData(entity.defn().Mover);
	}

	MoverDefn.prototype.updateEntityForVenue = function(entity, venue)
	{
		var entityLoc = entity.loc;

		entityLoc.posInCells.trimToRange
		(
			venue.map.sizeInCellsMinusOnes
		);
	}
}