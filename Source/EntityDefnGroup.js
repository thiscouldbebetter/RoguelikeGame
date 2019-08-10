
function EntityDefnGroup(name, relativeFrequency, entityDefns)
{
	this.name = name;
	this.relativeFrequency = relativeFrequency;
	this.entityDefns = entityDefns;
}

{
	EntityDefnGroup.prototype.toXmlElement = function()
	{
		return new XmlElement
		(
			this.constructor.name,
			// attributeNameValuePairs
			[
				[ "name", this.name ],
				[ "relativeFrequency", this.relativeFrequency ],
			],
			// children
			[
				new XmlElement("EntityDefns", [], XmlElement.buildManyFromXmlizables(this.entityDefns)),
			]
		);
	};
}
