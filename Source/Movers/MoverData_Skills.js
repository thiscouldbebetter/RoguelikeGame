
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
	MoverData_Skills.prototype.controlUpdate = function(entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerMoverData_Skills",
				pos,
				new Coords(200, 16), // size
				[
					new ControlLabel("labelSkills", new Coords(10, 10), "Skills"),
				]
			);
		}

		return this.control;
	}
}
