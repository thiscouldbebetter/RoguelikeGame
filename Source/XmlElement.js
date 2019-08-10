
function XmlElement(tagName, attributeNameValuePairs, children)
{
	this.tagName = tagName;
	this.attributeNameValuePairs = attributeNameValuePairs;
	this.children = children;
}

{
	XmlElement.buildManyFromXmlizables = function(xmlizablesToBuildFrom)
	{
		var returnValues = [];

		for (var i = 0; i < xmlizablesToBuildFrom.length; i++)
		{
			var xmlizable = xmlizablesToBuildFrom[i];

			var xmlElement = xmlizable.toXmlElement();

			returnValues.push(xmlElement);
		}

		return returnValues;
	}

	XmlElement.prototype.toString = function()
	{
		var returnValue = "<" + this.tagName;

		for (var i = 0; i < this.attributeNameValuePairs.length; i++)
		{
			var attributeNameValuePair = this.attributeNameValuePairs[i];
			returnValue +=
				" "
				+ attributeNameValuePair[0]
				+ "='"
				+ attributeNameValuePair[1]
				+ "'";
		}

		if (this.children.length == 0)
		{
			returnValue += "/>";
		}
		else
		{
			returnValue += ">";

			for (var i = 0; i < this.children.length; i++)
			{
				var child = this.children[i];

				returnValue += child.toString();
			}

			returnValue += "</" + this.tagName +">";
		}

		return returnValue;
	}
}
