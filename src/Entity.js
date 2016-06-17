
function Entity(name, defnName, pos, propertyValues)
{
	this.name = name;
	this.defnName = defnName;
	this.loc = new Location
	(
		null, // venueName
		pos
	);

	if (propertyValues != null)
	{
		for (var i = 0; i < propertyValues.length; i++)
		{
			var propertyValue = propertyValues[i];
			var propertyName = propertyValue.constructor.name;
			propertyName = 
				propertyName.substring(0, 1).toLowerCase() 
				+ propertyName.substring(1);

			this[propertyName] = propertyValue;
		}
	}
}

{
	Entity.EntityText = "Entity";

	Entity.fromDefn = function(name, defn, pos, propertyValues)
	{
		var returnValue = new Entity(name, null, pos, propertyValues);
		returnValue._defn = defn;
		return returnValue;
	}

	Entity.prototype.defn = function()
	{
		var returnValue;

		if (this._defn == null)
		{
			returnValue = Globals.Instance.universe.defn.entityDefns[this.defnName];
		}
		else
		{
			returnValue = this._defn;
		}

		return returnValue;
	}
}
