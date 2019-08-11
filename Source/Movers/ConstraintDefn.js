
function ConstraintDefn(name, apply)
{
	this.name = name;
	this.apply = apply;
}

{
	function ConstraintDefn_Instances()
	{
		if (ConstraintDefn.Instances != null) { return; }

		this.Follow = new ConstraintDefn
		(
			"Follow",
			function apply(world, constraint)
			{
				var entityConstrained = constraint.entityConstrained;

				// hack
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
