
function ConstraintDefn(name, methodToRun)
{
	this.name = name;
	this.methodToRun = methodToRun;
}

{
	function ConstraintDefn_Instances()
	{
		if (ConstraintDefn.Instances != null) { return; }

		this.Follow = new ConstraintDefn
		(
			"Follow",
			function (constraint)
			{
				var entityConstrained = constraint.entityConstrained;

				// hack
				var world = Globals.Instance.world;
				var entityToFollow = entityConstrained.loc.venue(world).entitiesByPropertyName
				[
					"Player"
				][0];

				entityConstrained.loc.posInCells.overwriteWith
				(
					entityToFollow.loc.posInCells
				);
			}
		);

		ConstraintDefn.Instances = this;
	}

	new ConstraintDefn_Instances();
}
