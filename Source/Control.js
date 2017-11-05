
function Control()
{
	// static class
}

{
	Control.getValueFromObjectAtBindingPath = function(object, bindingPath)
	{
		if (bindingPath != null)
		{
			var bindingAncestry = bindingPath.split(".");
			for (var i = 0; i < bindingAncestry.length; i++)
			{
				var bindingPath = bindingAncestry[i];
				if (bindingPath.endsWith("()") == true)
				{
					bindingPath = bindingPath.substr
					(
						0, bindingPath.indexOf("()")
					);
					var methodToCall = object[bindingPath];
					object = methodToCall.call(object);
				}
				else
				{
					object = object[bindingPath];
				}
			}
		}
	
		return object;
	}

	Control.posAbsoluteOfControl = function(control)
	{
		var returnValue = new Coords(0, 0);

		while (control != null)
		{	
			returnValue.add(control.pos);
			control = control.parent;
		}

		return returnValue;
	}
}
