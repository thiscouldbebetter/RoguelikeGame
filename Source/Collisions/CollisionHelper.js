
function CollisionHelper()
{}
{
	CollisionHelper.prototype.collideEntities = function(world, collision, entity0, entity1)
	{
		var entity0DefnProperties = entity0.defn(world).properties;

		for (var c = 0; c < entity0DefnProperties.length; c++)
		{
			var property = entity0DefnProperties[c];

			// hack
			if (property != null)
			{
				var methodForCollision = property.collide;
				if (methodForCollision != null)
				{
					methodForCollision(entity0, entity1);
				}
			}
		}
	}

	CollisionHelper.prototype.doEntitiesCollide = function(entity0, entity1)
	{
		var returnValue = entity0.loc.posInCells.equals
		(
			entity1.loc.posInCells
		);

		return returnValue;
	}

	CollisionHelper.prototype.findCollisionsBetweenEntitiesInSets = function
	(
		entitySet0, entitySet1
	)
	{
		var returnValues = [];

		var numberOfEntitiesInSet0 = entitySet0 == null ? 0 : entitySet0.length;
		var numberOfEntitiesInSet1 = entitySet1 == null ? 0 : entitySet1.length;

		for (var i = 0; i < numberOfEntitiesInSet0; i++)
		{
			var entityFromSet0 = entitySet0[i];

			for (var j = 0; j < numberOfEntitiesInSet1; j++)
			{
				var entityFromSet1 = entitySet1[j];

				if (this.doEntitiesCollide(entityFromSet0, entityFromSet1) == true)
				{
					var collision = new Collision
					(
						[entityFromSet0, entityFromSet1]
					);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	}
}
