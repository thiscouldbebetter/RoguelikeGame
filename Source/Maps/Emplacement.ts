
class Emplacement implements EntityProperty<Emplacement>
{
	appearance: string;
	_collide: (uwpe: UniverseWorldPlaceEntities) => void;
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		appearance: string,
		collide: (uwpe: UniverseWorldPlaceEntities) => void,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.appearance = appearance;
		this._collide = collide
		this._use = use;
	}

	static fromAppearance(appearance: string): Emplacement
	{
		return new Emplacement(appearance, null, null);
	}

	static fromAppearanceAndCollide
	(
		appearance: string,
		collide: (uwpe: UniverseWorldPlaceEntities) => void
	): Emplacement
	{
		return new Emplacement(appearance, collide, null);
	}

	static fromAppearanceAndUse
	(
		appearance: string,
		use: (uwpe: UniverseWorldPlaceEntities) => void
	): Emplacement
	{
		return new Emplacement(appearance, null, use);
	}

	collide(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._collide != null)
		{
			this._collide(uwpe);
		}
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._use == null)
		{
			(uwpe.entity as Entity2).player().messageLog.messageAdd("Nothing happens.");
		}
		else
		{
			this._use(uwpe);
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Emplacement) { return this; }

	// Equatable.
	equals(other: Emplacement) { return false; }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

}
