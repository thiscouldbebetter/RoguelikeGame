
function Font(charactersAvailable, characterSize, characterImages)
{
	this.charactersAvailable = charactersAvailable;
	this.characterSize = characterSize;
	this.characterImages = characterImages;
}

{
	Font.prototype.buildEntityDefnForText = function
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
			new DrawableDefn
			(
				new VisualSet(text, visualsForCharacters),
				null, // sizeInPixels
				2 // zIndex
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

	Font.spawnMessage = function(world, messageIconName, messageText, loc, isFloater)
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
			Globals.Instance.idHelper.idNext(),
			Globals.Instance.font.buildEntityDefnForText
			(
				messageIcon,
				messageText.toUpperCase(),
				isFloater
			),
			loc.posInCells.clone()
		);

		//entityMessage.drawableData.isVisible = true;

		world.venueCurrent.entitiesToSpawn.push(entityMessage);
	};

	Font.spawnMessageFixed = function(world, messageText, loc)
	{
		Font.spawnMessage(world, null, messageText, loc, false);
	};

	Font.spawnMessageFloater = function(world, messageIconName, messageText, loc)
	{
		Font.spawnMessage(world, messageIconName, messageText, loc, true);
	};
}
