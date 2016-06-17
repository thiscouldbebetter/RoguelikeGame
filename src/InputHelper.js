
function InputHelper()
{
	this.mousePos = new Coords(0, 0);

	this.bindings = [];
	this.keyCodeToBindingLookup = [];

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
		this.bindings = new Array();
		this.keyCodeToBindingLookup = new Array();

		var numberOfBindings = bindingsToRegister.length;
		for (var b = 0; b < numberOfBindings; b++)
		{
			var binding = bindingsToRegister[b];

			this.bindings.push(binding);
			this.keyCodeToBindingLookup[binding.key.systemKeyCode] = binding;
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
		var keycode = "_" + event.which;
		var binding = this.keyCodeToBindingLookup[keycode];
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
		var binding = this.keyCodeToBindingLookup["_" + event.which];

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

		var keycode = "Mouse";
		var binding = this.keyCodeToBindingLookup[keycode];
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
