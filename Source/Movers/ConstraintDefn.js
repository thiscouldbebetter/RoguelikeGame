
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
				var entityLoc = entityConstrained.Locatable.loc;
				var venue = entityLoc.place(world);
				var entityToFollow = venue.entitiesByPropertyName
				[
					Player.name
				][0];

				entityLoc.pos.overwriteWith
				(
					entityToFollow.Locatable.loc.pos
				);
			}
		);

		ConstraintDefn.Instances = this;
	}

	new ConstraintDefn_Instances();
}
