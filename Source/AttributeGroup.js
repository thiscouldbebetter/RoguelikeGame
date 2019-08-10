
function AttributeGroup(name, attributes)
{
	this.name = name;
	this.attributes = attributes;

	this.attributes.addLookupsByName();
}
