
class MapTerrain
{
	name: string;
	codeChar: string;
	costToTraverse: number;
	blocksVision: boolean;
	color: string;
	visual: VisualBase;

	constructor
	(
		name: string, codeChar: string, costToTraverse: number,
		blocksVision: boolean, color: string, visual: VisualBase
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.costToTraverse = costToTraverse || MapTerrain.AlmostInfinity;
		this.blocksVision = blocksVision;
		this.color = color;
		this.visual = visual
	}

	// Pathfinding seems to take longer using real infinity.
	static AlmostInfinity = 1000000;
}
