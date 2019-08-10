
function RandomizerLCG(multiplier, addend, modulus, firstRandom)
{
	// "LCG" = "Linear Congruential Generator"

	this.multiplier = multiplier;
	this.addend = addend;
	this.modulus = modulus;
	this.currentRandom = firstRandom;
}

{
	RandomizerLCG.prototype.getNextRandom = function()
	{
		this.currentRandom =
		(
			(
				this.multiplier
				* (this.currentRandom * this.modulus)
				+ this.addend
			)
			% this.modulus
		)
		/ this.modulus;

		return this.currentRandom;
	}
}
