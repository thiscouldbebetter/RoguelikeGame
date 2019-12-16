
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
	MoverDefn.prototype.name = function() { return "Mover"; };

	MoverDefn.prototype.initializeEntityForVenue = function(universe, world, venue, entity)
	{
		if (entity.moverData == null)
		{
			entity.moverData = new MoverData(entity.defn(world).Mover);
		}
	};

	MoverDefn.prototype.updateEntityForVenue = function(universe, world, venueIgnored, entity)
	{
		var entityLoc = entity.loc;
		venue = entityLoc.venue(world);

		entityLoc.posInCells.trimToRangeMax
		(
			venue.map.sizeInCellsMinusOnes
		);
	};
}
