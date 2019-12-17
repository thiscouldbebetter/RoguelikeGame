
function EntityHelper()
{
	throw "Static class!";
}
{
	EntityHelper.new = function(name, defn, properties)
	{
		var returnValue = defn.clone();
		returnValue.name = name;
		for (var i = 0; i < properties.length; i++)
		{
			var property = properties[i];
			returnValue.properties.push(property);
			var propertyName = property.constructor.name;
			returnValue[propertyName] = property;
		}
		return returnValue;
	}
}
