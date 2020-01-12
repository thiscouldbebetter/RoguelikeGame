
function MoverData(moverDefn)
{
	this.movesThisTurn = moverDefn.movesPerTurn;
	this.demographics = moverDefn.demographics;
	this.locus = new MoverData_Locus();
	this.traits = moverDefn.traits;
	this.skills = moverDefn.skills;
	this.spells = moverDefn.spells;
	this.vitals = new MoverData_Vitals(moverDefn.vitals);
	this.attributes = moverDefn.attributes;
}
