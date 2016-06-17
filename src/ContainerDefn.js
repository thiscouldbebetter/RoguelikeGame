
function ContainerDefn()
{
	// do nothing
}

{
	ContainerDefn.prototype.name = function() { return "Container"; }

	ContainerDefn.prototype.initializeEntityForVenue = function(entity, venue)
	{
		entity.containerData = new ContainerData();
	}
}
