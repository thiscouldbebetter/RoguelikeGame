
function ContainerData()
{
	this.items = [];
}

{
	ContainerData.prototype.dropItem = function(actor, itemToDrop)
	{
		var itemsHeld = this.items;

		this.removeItem(actor, itemToDrop);

		itemToDrop.loc.overwriteWith(actor.loc);
		var world = Globals.Instance.world;
		itemToDrop.loc.venue(world).entitiesToSpawn.push(itemToDrop);
	}

	ContainerData.prototype.removeItem = function(actor, itemToDrop)
	{
		var itemsHeld = this.items;

		var world = Globals.Instance.world;
		var actionSelectNext = world.defn.actions["Item_SelectNext"];
		actionSelectNext.perform(world, actor);

		var indexOfItemToDrop = itemsHeld.indexOf(itemToDrop);
		itemsHeld.splice(indexOfItemToDrop, 1);

		if (itemsHeld.length == 0)
		{
			this.itemSelected = null;
		}

		this.controlUpdate(actor);
	}

	ContainerData.prototype.pickUpItem = function(actor, itemToPickUp)
	{
		this.items.push(itemToPickUp);
		var world = Globals.Instance.world;
		itemToPickUp.loc.venue(world).entitiesToRemove.push(itemToPickUp);

		if (this.itemSelected == null)
		{
			this.itemSelected = itemToPickUp;
		}

		this.controlUpdate(actor);
	}

	// control

	ContainerData.prototype.controlUpdate = function(entity, pos)
	{
		if (this.control == null)
		{
			this.control = new ControlContainer
			(
				"containerContainerData",
				pos,
				new Coords(200, 100), // size
				[
					new ControlLabel("labelItems", new Coords(10, 10), "Items"),
					new ControlList
					(
						"listItems",
						new Coords(10, 20), // pos
						new Coords(180, 70), // size
						"defn().Item.appearance", // bindingPath
						this.items
					)
				]
			);
		}

		return this.control;
	}
}
