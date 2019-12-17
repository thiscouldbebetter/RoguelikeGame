
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
				var venue = entityConstrained.LocatableRoguelike.venue(world);
				var entityToFollow = venue.entitiesByPropertyName
				[
					"Player"
				][0];

				entityConstrained.LocatableRoguelike.pos.overwriteWith
				(
					entityToFollow.LocatableRoguelike.pos
				);
			}
		);

		ConstraintDefn.Instances = this;
	}

	new ConstraintDefn_Instances();
}
