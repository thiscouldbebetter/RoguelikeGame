
function UniverseDefn
(
	name, 
	actions,
	activityDefns,
	itemCategories, 
	entityDefnGroups, 
	venueDefns,
	venueStructure, 
	buildVenues
)
{
	this.name = name;
	this.actions = actions;
	this.activityDefns = activityDefns;
	this.itemCategories = itemCategories;
	this.entityDefnGroups = entityDefnGroups;
	this.venueDefns = venueDefns;
	this.venueStructure = venueStructure;
	this.buildVenues = buildVenues;

	var entityDefnSets = this.entityDefnGroups.elementProperties
	(
		"entityDefns"	
	);

	this.entityDefns = entityDefnSets.elementArraysConcatenate();

	this.actions.addLookups("name");
	this.activityDefns.addLookups("name");
	this.venueDefns.addLookups("name");
	this.entityDefnGroups.addLookups("name");
	this.entityDefns.addLookups("name");
}

{
	// xml

	UniverseDefn.prototype.toXmlElement = function()
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
				new XmlElement("VenueDefns", [], XmlElement.buildManyFromXmlizables(this.venueDefns)),
				new XmlElement("EntityDefnGroups", [], XmlElement.buildManyFromXmlizables(this.entityDefnGroups)),
			]
		);
	}
}
