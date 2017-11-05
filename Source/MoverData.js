
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

{
	// controls

	MoverData.prototype.controlUpdate = function(entity)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData",
				new Coords(0, 0), // pos
				new Coords(220, 240), // size
				[
					new ControlLabel("labelName", new Coords(10, 16), "Name: " + entity.name),
					this.demographics.controlUpdate(entity, new Coords(10, 32)),
					this.traits.controlUpdate(entity, new Coords(10, 48)),
					this.vitals.controlUpdate(entity, new Coords(10, 64)),
					this.locus.controlUpdate(entity, new Coords(10, 80)),
					this.skills.controlUpdate(entity, new Coords(10, 96)),
					this.spells.controlUpdate(entity, new Coords(10, 112)),
					entity.containerData.controlUpdate(entity, new Coords(10, 128)),
				]
			);
		}

		return this.control;				
	}
}
