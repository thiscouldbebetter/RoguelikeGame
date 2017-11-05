
function EquipmentSocketSet(equipmentSocketDefnSet)
{
	this.equipmentSocketDefnSet = equipmentSocketDefnSet;
	this.sockets = [];

	var socketDefns = equipmentSocketDefnSet.socketDefns;

	for (var i = 0; i < socketDefns.length; i++)
	{
		var socketDefn = socketDefns[i];

		var socket = new EquipmentSocket(socketDefn, null);

		this.sockets.push(socket);
	}	
}
