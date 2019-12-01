
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
			entityOther.Killable.integrity = 0;
		}
	}
}
