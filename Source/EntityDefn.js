
function EntityDefn
(
	name,
	properties
)
{
	this.name = name;
	this.properties = properties;

	if (this.properties != null)
	{
		for (var i = 0; i < this.properties.length; i++)
		{
			var property = this.properties[i];
			var propertyName = property.name();
			this[propertyName] = property;
			this.properties[propertyName] = property;
		}
	}
}
