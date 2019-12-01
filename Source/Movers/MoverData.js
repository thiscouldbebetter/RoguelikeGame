
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

	MoverData.prototype.controlUpdate = function(world, entity)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData",
				new Coords(0, 0), // pos
				new Coords(180, 272), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 16), "Name: " + entity.name),
					this.demographics.controlUpdate(world, entity, new Coords(10, 32)),
					this.traits.controlUpdate(world, entity, new Coords(10, 48)),
					this.vitals.controlUpdate(world, entity, new Coords(10, 64)),
					this.locus.controlUpdate(world, entity, new Coords(10, 112)),
					this.skills.controlUpdate(world, entity, new Coords(10, 128)),
					this.spells.controlUpdate(world, entity, new Coords(10, 144)),
					//entity.ItemHolder.controlUpdate(world, entity, new Coords(10, 160)),
				]
			);
		}

		return this.control;
	}
}
