
class Emplacement implements EntityProperty
{
	appearance: string;
	_collide: (u: Universe, w: World, p: Place, eColliding: Entity, eCollidedWith: Entity) => void
	_use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => void;

	constructor
	(
		appearance: string,
		collide: (u: Universe, w: World, p: Place, eColliding: Entity, eCollidedWith: Entity) => void,
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => void
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
		collide: (u: Universe, w: World, p: Place, eColliding: Entity, eCollidedWith: Entity) => void
	): Emplacement
	{
		return new Emplacement(appearance, collide, null);
	}

	static fromAppearanceAndUse
	(
		appearance: string,
		use: (u: Universe, w: World, p: Place, eUsing: Entity, eUsed: Entity) => void
	): Emplacement
	{
		return new Emplacement(appearance, null, use);
	}

	collide
	(
		universe: Universe, world: World, place: Place,
		entityColliding: Entity, entityCollidedWith: Entity
	): void
	{
		if (this._collide != null)
		{
			this._collide(universe, world, place, entityColliding, entityCollidedWith);
		}
	}

	use
	(
		universe: Universe, world: World, place: Place,
		entityUsing: Entity, entityUsed: Entity
	): void
	{
		if (this._use == null)
		{
			(entityUsing as Entity2).player().messageLog.messageAdd("Nothing happens.");
		}
		else
		{
			this._use(universe, world, place, entityUsing, entityUsed);
		}
	}

	// Clonable.
	clone() { return this; }
	overwriteWith(other: Emplacement) { return this; }

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}
