
function HTMLHelper()
{}
{
	HTMLHelper.Newline = "<br />";

	HTMLHelper.HandleHideOrShowControlEvent = function(event)
	{
		HTMLHelper.HideOrShowControl(event.target);
	};

	HTMLHelper.HideOrShowControl = function(controlToHideOrShow)
	{
		var htmlElementToHideOrShow = controlToHideOrShow.elementToHideOrShow;

		if (controlToHideOrShow.isExpanded == false)
		{
			controlToHideOrShow.isExpanded = true;
			controlToHideOrShow.innerHTML = "-";
			htmlElementToHideOrShow.style.display = "";
		}
		else
		{
			controlToHideOrShow.isExpanded = false;
			htmlElementToHideOrShow.style.display = "none";
			controlToHideOrShow.innerHTML = "+";
		}
	};
}
