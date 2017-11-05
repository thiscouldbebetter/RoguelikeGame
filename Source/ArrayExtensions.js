function ArrayExtensions()
{
	// extension class
}
{
	Array.prototype.addLookups = function(keyName)
	{
		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			this[item[keyName]] = item;
		}
	}

	Array.prototype.getPropertyWithNameFromEachItem = function(propertyName)
	{
		var returnValues = [];
	
		for (var i = 0; i < this.length; i++)
		{
			var item = this[i];
			returnValues.push(item[propertyName]);
		}

		return returnValues;
	}
}
