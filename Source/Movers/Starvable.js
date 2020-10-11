
class Starvable
{
	constructor(satietyMax)
	{
		this.satietyMax = satietyMax;
		this.satiety = this.satietyMax;
	}

	satietyAdd(world, amountToAdd, moverEntity)
	{
		this.satiety += amountToAdd;

		if (this.satiety <= 0)
		{
			moverEntity.killable.integrity = 0;
		}
		else if (this.satiety >= this.satietyMax)
		{
			this.satiety = this.satietyMax;
		}

		this.controlUpdate(world, moverEntity);
	}

	// controls

	controlUpdate(world, entity, pos)
	{
		if (this.control == null && pos != null) // hack
		{
			this.control = new ControlContainer
			(
				"containerMover_Vitals",
				pos,
				new Coords(160, 32), // size
				[
					ControlLabel.fromPosAndText
					(
						//"labelHealth",
						new Coords(10, 5),
						new DataBinding
						(
							entity.killable,
							function get(c)
							{
								return "Life: " + c.integrity + "/" + c.integrityMax;
							}
						)
					),

					ControlLabel.fromPosAndText
					(
						//"labelSatiety",
						new Coords(10, 15),
						new DataBinding
						(
							this,
							function get(c)
							{
								return "Satiety: " + c.satiety + "/" + c.satietyMax;
							}
						)
					)
				]
			);
		}

		return this.control;
	}
}
