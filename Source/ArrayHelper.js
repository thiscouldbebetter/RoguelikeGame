
function ArrayHelper()
{
	// do nothing
}

{
	ArrayHelper.concatenateArrays = function(arraysToConcatenate)
	{
		var returnArray = [];

		for (var i = 0; i < arraysToConcatenate.length; i++)
		{
			var arrayToConcatenate = arraysToConcatenate[i];

			for (var j = 0; j < arrayToConcatenate.length; j++)
			{
				returnArray.push(arrayToConcatenate[j]);
			}
		}

		return returnArray;
	}
}
