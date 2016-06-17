
function HTMLElementLibrary()
{
	this.idNext = 0;
	this.elements = [];
}

{
	HTMLElementLibrary.Instance = new HTMLElementLibrary();

	HTMLElementLibrary.prototype.createElement = function(tagName)
	{
		var returnValue = document.createElement(tagName);
		returnValue.id = "_" + this.idNext;
		this.idNext++;

		this.elements[returnValue.id] = returnValue;

		return returnValue;
	}

	HTMLElementLibrary.prototype.getElementByID = function(idToGet)
	{
		return this.elements[idToGet];
	}

}
