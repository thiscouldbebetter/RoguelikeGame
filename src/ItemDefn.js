
function ItemDefn(appearance, mass, stackSizeMax, relativeFrequency, categoryNames, initialize, use)
{
	this.appearance = appearance;
	this.mass = mass;
	this.stackSizeMax = stackSizeMax;
	this.relativeFrequency = relativeFrequency;
	this.categoryNames = categoryNames;
	this.initialize = initialize;
	this.use = use;

	if (this.initialize == null)
	{
		this.initialize = ItemDefn.InitializeDoNothing;
	}

	if (this.use == null)
	{
		this.use = ItemDefn.UseDoNothing;
	}
}

{
	ItemDefn.InitializeDevice = function(entity, item)
	{
		alert("[UseDevice]");
	}

	ItemDefn.InitializeDoNothing = function()
	{
		// do nothing
	}

	ItemDefn.UseDevice = function(userEntity, deviceEntity, targetEntity)
	{
		deviceEntity.deviceData.use(userEntity, deviceEntity, targetEntity);
	}

	ItemDefn.UseDoNothing = function()
	{
		// do nothing
	}

	ItemDefn.UseEquip = function(entity, item)
	{
		var itemCategoryNames = item.defn().categoryNames;

		var equippableData = entity.equippableData;
		var socketSet = equippableData.equipmentSocketSet;
		var sockets = socketSet.sockets;

		for (var d = 0; d < itemCategoryNames.length; d++)
		{
			var itemCategoryName = itemCategoryNames[d];

			for (var i = 0; i < sockets.length; i++)
			{
				var socket = sockets[i];

				var namesOfCategoriesAllowed = socket.defn.namesOfCategoriesAllowed;

				for (var c = 0; c < namesOfCategoriesAllowed.length; c++)
				{
					var nameOfCategoryAllowed = namesOfCategoriesAllowed[c];

					if (itemCategoryName == nameOfCategoryAllowed)
					{
						socket.itemEquipped = item;
						entity.moverData.controlUpdate(entity);
						return;
					}
				}
			}
		}
	}

	// instance methods

	ItemDefn.prototype.name = function() { return "Item"; }

	ItemDefn.prototype.initializeEntityForVenue = function(entity)
	{
		entity.itemData = new ItemData();
	}
}
