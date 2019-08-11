
function ProjectileDefn()
{
	// todo
}

{
	ProjectileDefn.prototype.collide = function(world, entityOther)
	{
		var entityOtherDefnProperties = entityOther.defn(world).properties;
		if (entityOtherDefnProperties["Enemy"] != null)
		{
			entityOther.killableData.integrity = 0;
		}
	}
}
