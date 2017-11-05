
function InputHelper()
{
	this.mousePos = new Coords(0, 0);

	this.bindings = [];
	this.systemKeyToBindingLookup = [];

	this.actionsBeingPerformed = [];
}

{
	// instance methods

	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.processKeyDownEvent.bind(this);
		document.body.onkeyup = this.processKeyUpEvent.bind(this);
		document.body.onmousedown = this.processMouseDownEvent.bind(this);
	}

	InputHelper.prototype.bindingsRegister = function(bindingsToRegister)
	{
		this.bindings = [];
		this.systemKeyToBindingLookup = [];

		var numberOfBindings = bindingsToRegister.length;
		for (var b = 0; b < numberOfBindings; b++)
		{
			var binding = bindingsToRegister[b];

			this.bindings.push(binding);
			this.systemKeyToBindingLookup[binding.key.systemKey] = binding;
		}
	}

	InputHelper.prototype.updateForTick = function()
	{
		var inputHelper = Globals.Instance.inputHelper;
		var actionsBeingPerformed = inputHelper.actionsBeingPerformed;	

		var actionsToEnd = [];

		for (var i = 0; i < actionsBeingPerformed.length; i++)
		{
			var actionBeingPerformed = actionsBeingPerformed[i];

			actionBeingPerformed.ticksSoFar++;
		}	
	}

	// event handlers

	InputHelper.prototype.processKeyDownEvent = function(event)
	{
		var systemKey = event.key;
		var binding = this.systemKeyToBindingLookup[systemKey];
		if (binding != null)
		{
			var action = binding.action();

			var actionsBeingPerformed = this.actionsBeingPerformed;
			if (actionsBeingPerformed[action.name] == null)
			{
				action.ticksSoFar = 0;
				actionsBeingPerformed[action.name] = action;
				actionsBeingPerformed.push(action);
			}
		}
	}

	InputHelper.prototype.processKeyUpEvent = function(event)
	{
		var systemKey = event.key;
		var binding = this.systemKeyToBindingLookup[systemKey];

		if (binding != null)
		{
			var action = binding.action();

			var actionsBeingPerformed = this.actionsBeingPerformed;
			if (actionsBeingPerformed[action.name] != null)
			{
				delete actionsBeingPerformed[action.name];

				var indexToDeleteAt = actionsBeingPerformed.indexOf
				(
					action
				);
				actionsBeingPerformed.splice(indexToDeleteAt, 1);
			}
		}
	}

	InputHelper.prototype.processMouseDownEvent = function(event)
	{
		this.mousePos.overwriteWithDimensions(event.x, event.y);

		var systemKey = "Mouse";
		var binding = this.systemKeyToBindingLookup[systemKey];
		if (binding != null)
		{
			var action = binding.action();

			var actionsBeingPerformed = this.actionsBeingPerformed;
			if (actionsBeingPerformed[action.name] == null)
			{
				action.ticksSoFar = 0;
				actionsBeingPerformed[action.name] = action;
				actionsBeingPerformed.push(action);
			}
		}
	}

}
