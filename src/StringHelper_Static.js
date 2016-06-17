
function StringHelper()
{}
function StringHelper_Static()
{
	StringHelper.toStringNullable = function(objectToConvertToString)
	{
		if (objectToConvertToString == null)
		{
			objectToConvertToString = "null";
		}

		return objectToConvertToString.toString();
	}
}
