
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

	ItemDefn.UseDevice = function(world, userEntity, deviceEntity, targetEntity)
	{
		deviceEntity.deviceData.use(world, userEntity, deviceEntity, targetEntity);
	}

	ItemDefn.UseDoNothing = function()
	{
		// do nothing
	}

	ItemDefn.UseEquip = function(world, entity, item)
	{
		var itemCategoryNames = item.defn(world).categoryNames;

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
						entity.moverData.controlUpdate(world, entity);
						return;
					}
				}
			}
		}
	}

	// instance methods

	ItemDefn.prototype.name = function() { return "Item"; }

	ItemDefn.prototype.initializeEntityForVenue = function(world, entity)
	{
		entity.itemData = new ItemData();
	}
}
