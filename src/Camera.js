
function Camera(name, viewSizeInPixels)
{
	this.name = name;
	this.viewSizeInPixels = viewSizeInPixels;

	this.viewSizeInPixelsHalf = this.viewSizeInPixels.clone().divideScalar(2);

	this.entity = new Entity
	(
		this.name + "_CameraEntity",
		Camera.EntityDefn.name,
		new Coords(0, 0)
	);
}

{
	// constants

	Camera.initializeStatic = function()
	{
		Camera.ViewSizeStandard = new Coords(480, 480);

		Camera.EntityDefn = new EntityDefn
		(
			"CameraEntity",
			[ new CameraDefn() ]
		);
	}
}
