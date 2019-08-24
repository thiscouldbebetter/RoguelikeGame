
function MoverData_Vitals(defn)
{
	this.defn = defn;
	this.energy = defn.energyMax;
	this.satiety = defn.satietyMax;
}

{
	MoverData_Vitals.prototype.addSatietyToMover = function(world, amountToAdd, moverEntity)
	{
		this.satiety += amountToAdd;

		if (this.satiety <= 0)
		{
			moverEntity.killableData.integrity = 0;
		}
		else if (this.satiety >= moverEntity.defn(world).Mover.vitals.satietyMax)
		{
			// todo
		}

		this.controlUpdate(world, moverEntity);
	};

	// controls

	MoverData_Vitals.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null && pos != null) // hack
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Vitals",
				pos,
				new Coords(160, 48), // size
				[
					ControlLabel.fromPosAndText
					(
						//"labelHealth",
						new Coords(10, 10),
						"Life:^/^",
						//[ entity.killableData, entity.killableData.defn ],
						//[ "integrity", "integrityMax" ]
					),

					ControlLabel.fromPosAndText
					(
						//"labelEnergy",
						new Coords(10, 20),
						"Power:" + this.energy + "/" + this.defn.energyMax
					),
					ControlLabel.fromPosAndText
					(
						//"labelSatiety",
						new Coords(10, 30),
						"Satiety: " + this.satiety + "/" + this.defn.satietyMax
					),
				]
			);
		}

		return this.control;
	};
}
