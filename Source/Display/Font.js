
function FontRoguelike(charactersAvailable, characterSize, characterImages)
{
	this.charactersAvailable = charactersAvailable;
	this.characterSize = characterSize;
	this.characterImages = characterImages;
}

{
	FontRoguelike.prototype.buildEntityDefnForText = function
	(
		visualForIcon, text, isFloater
	)
	{
		text = text.toUpperCase();

		var visualsForCharacters = [];

		visualsForCharacters.push(visualForIcon);

		for (var i = 0; i < text.length; i++)
		{
			var character = text[i];

			var characterIndex = this.charactersAvailable.indexOf
			(
				character
			);

			if (characterIndex >= 0)
			{
				var characterImage = this.characterImages
				[
					characterIndex
				];

				var visualForCharacter = new VisualOffset
				(
					characterImage,
					new Coords(i * this.characterSize.x, 0)
				);

				visualsForCharacters.push
				(
					visualForCharacter
				);
			}
		};

		var entityDefnProperties =
		[
			new Drawable
			(
				new VisualGroup(visualsForCharacters)
			),
			new EphemeralDefn(100)
		]

		var ticksToLive = (isFloater == true ? 16 : null);

		if (ticksToLive != null)
		{
			entityDefnProperties.push(new EphemeralDefn(ticksToLive));
		}

		var velocity = (isFloater == true ? new Coords(0, -.4) : null);

		if (velocity != null)
		{
			entityDefnProperties.push
			(
				new DynamicDefn(velocity, Coords.Instances().Zeroes)
			);
		}

		var entityDefn = new EntityDefn
		(
			"Message_" + text,
			entityDefnProperties
		);

		return entityDefn;
	};

	FontRoguelike.prototype.spawnMessage = function(world, messageIconName, messageText, loc, isFloater)
	{
		var entityDefns = world.defn.entityDefns;

		var messageIcon =
		(
			messageIconName == null
			? null
			: entityDefns[messageIconName].Drawable.visual
		);

		var entityMessage = Entity.fromDefn
		(
			world.idHelper.idNext(),
			this.buildEntityDefnForText
			(
				messageIcon,
				messageText.toUpperCase(),
				isFloater
			),
			loc.posInCells.clone()
		);

		world.venueCurrent.entitiesToSpawn.push(entityMessage);
	};

	FontRoguelike.prototype.spawnMessageFixed = function(world, messageText, loc)
	{
		this.spawnMessage(world, null, messageText, loc, false);
	};

	FontRoguelike.prototype.spawnMessageFloater = function(world, messageIconName, messageText, loc)
	{
		this.spawnMessage(world, messageIconName, messageText, loc, true);
	};
}
