
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
			moverEntity.Killable.integrity = 0;
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
						new Coords(10, 5),
						new DataBinding
						(
							entity.Killable,
							function get(c)
							{
								return "Life: " + c.integrity + "/" + c.integrityMax;
							}
						)
					),

					ControlLabel.fromPosAndText
					(
						//"labelEnergy",
						new Coords(10, 15),
						"Power:" + this.energy + "/" + this.defn.energyMax
					),
					ControlLabel.fromPosAndText
					(
						//"labelSatiety",
						new Coords(10, 25),
						new DataBinding
						(
							this,
							function get(c)
							{
								return "Satiety: " + c.satiety + "/" + c.defn.satietyMax;
							}
						)
					)
				]
			);
		}

		return this.control;
	};
}
