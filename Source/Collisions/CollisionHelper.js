
function CollisionHelper()
{}
{
	CollisionHelper.prototype.collideEntities = function(world, collision, entity0, entity1)
	{
		var entity0DefnProperties = entity0.properties;

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
	};

	CollisionHelper.prototype.doCollidablesCollide = function(entity0, entity1)
	{
		var returnValue = entity0.LocatableRoguelike.pos.equals
		(
			entity1.LocatableRoguelike.pos
		);

		return returnValue;
	};

	CollisionHelper.prototype.collisionsOfCollidablesInSets = function(entitySet0, entitySet1)
	{
		var returnValues = [];

		for (var i = 0; i < entitySet0.length; i++)
		{
			var entityFromSet0 = entitySet0[i];

			for (var j = 0; j < entitySet1.length; j++)
			{
				var entityFromSet1 = entitySet1[j];

				if (this.doCollidablesCollide(entityFromSet0, entityFromSet1))
				{
					var collision = new Collision();
					collision.collidables.push(entityFromSet0);
					collision.collidables.push(entityFromSet1);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	};
}
