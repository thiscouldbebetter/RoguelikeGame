
function VenueDefn(name, propertyNamesKnown, terrains, inputBindings, venueGenerate)
{
	this.name = name;
	this.propertyNamesKnown = propertyNamesKnown;
	this.terrains = terrains;
	this.inputBindings = inputBindings;
	this.venueGenerate = venueGenerate;
}

{
	// xml

	VenueDefn.prototype.toXmlElement = function()
	{
		return new XmlElement
		(
			this.constructor.name,
			// attributeNameValuePairs
			[	
				[ "name", this.name ],
			],
			// children
			[
				// todo
			]
		);
	}
}
