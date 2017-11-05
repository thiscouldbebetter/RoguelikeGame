
function ProjectileDefn()
{
	// todo
}

{
	ProjectileDefn.prototype.collide = function(entityOther)
	{
		var entityOtherDefnProperties = entityOther.defn().properties;
		if (entityOtherDefnProperties["Enemy"] != null)
		{
			entityOther.killableData.integrity = 0;
		}
	}
}
