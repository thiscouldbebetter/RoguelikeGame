
function ContainerDefn()
{
	// do nothing
}

{
	ContainerDefn.prototype.name = function() { return "Container"; }

	ContainerDefn.prototype.initializeEntityForVenue = function(universe, world, entity, venue)
	{
		entity.containerData = new ContainerData();
	}
}
