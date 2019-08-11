
function ProjectileDefn()
{
	// todo
}

{
	ProjectileDefn.prototype.collide = function(entityOther)
	{
		var world = Globals.Instance.world;
		var entityOtherDefnProperties = entityOther.defn(world).properties;
		if (entityOtherDefnProperties["Enemy"] != null)
		{
			entityOther.killableData.integrity = 0;
		}
	}
}
