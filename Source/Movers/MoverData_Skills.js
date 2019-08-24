
function MoverData_Skills(skillDefns)
{
	this.skills = [];

	for (var i = 0; i < skillDefns.length; i++)
	{
		var skillDefn = skillDefns[i];
		var skill = new Skill(skillDefn, 0);
		this.skills.push(skill);
	}
}

{
	MoverData_Skills.prototype.controlUpdate = function(world, entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Skills",
				pos,
				new Coords(160, 16), // size
				[
					ControlLabel.fromPosAndText(new Coords(10, 10), "Skills"),
				]
			);
		}

		return this.control;
	}
}
