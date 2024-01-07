if (!isOutdated) {
	Network.getServer().addOnClientConnectedListener(function(client) {
		let actor = new PlayerActor(client.getPlayerUid());
		client.send("setting.connect", {
			privileged: actor.isOperator ? actor.isOperator() : false
		});
	});
	Network.addClientPacket("setting.connect", function(obj, str, cls) {
		if (Network.inRemoteWorld() && obj.privileged != null) {
			doPrivileged = obj.privileged;
		}
	});
	Network.addClientPacket("setting.complete", function(obj, str, cls) {
		if (functionNumber <= 0) {
			Logger.Log("Setting: Received dead operation status, ignoring it!", "WARNING");
			return;
		}
		koll_current = obj.current;
		koll_set = obj.set;
		if (obj.blocks != null) {
			blocks = obj.blocks;
		}
		checkForCompletion(functionNumber);
	});
	Network.addClientPacket("setting.busy", function(obj, str, cls) {
		if (functionNumber <= 0) {
			Logger.Log("Setting: Received dead busy operation, ignoring it!", "WARNING");
			return;
		}
		stop();
		handle(function() {
			if (windowDynamic) updateButton();
		});
	});
	Network.addServerPacket("setting.perform", function(client, obj, str, cls) {
		let actor = new PlayerActor(client.getPlayerUid());
		if (actor.isOperator == null || !actor.isOperator()) {
			client.disconnect();
			return;
		}
		if (clientUid != null || functionNumber > 0 || !rover) {
			client.send("setting.busy", {
				progress: koll_total > 0 ? koll_current / koll_total : 0
			});
			return;
		}
		clientUid = client.getPlayerUid();
		region = BlockSource.getDefaultForActor(clientUid);
		pos1 = [obj.x1, obj.y1, obj.z1, false];
		pos2 = [obj.x2, obj.y2, obj.z2, false];
		updata();
		if (obj.blocksPerTick != null) {
			blocksPerTick = obj.blocksPerTick;
		}
		if (obj.operationDirection != null) {
			operationDirection = obj.operationDirection;
		}
		if (obj.coverTransparentBlocks != null) {
			coverTransparentBlocks = obj.coverTransparentBlocks;
		}
		if (obj.placeAirBeforePaste != null) {
			placeAirBeforePaste = obj.placeAirBeforePaste;
		}
		if (obj.overrideLegacyPasting != null) {
			overrideLegacyPasting = obj.overrideLegacyPasting;
		}
		if (obj.blocks != null) {
			blocks = obj.blocks;
		}
		if (obj.id != null) {
			idLocal = obj.id;
			dataLocal = obj.data;
		}
		if (obj.replaceId != null) {
			id = obj.replaceId;
			data = obj.replaceData;
		}
		start(obj.operation);
		handle(function() {
			removeMenu();
			createButton();
		});
	});
}

const sendRequest = function() {
	if (functionNumber < 0 || !doPrivileged) {
		return;
	}
	let prototype = {
		operation: functionNumber,
		x1: x1, y1: y1, z1: z1,
		x2: x1 + xkol, y2: y1 + ykol, z2: z1 + zkol,
		blocksPerTick: blocksPerTick,
		operationDirection: operationDirection,
		coverTransparentBlocks: coverTransparentBlocks,
		placeAirBeforePaste: placeAirBeforePaste,
		overrideLegacyPasting: overrideLegacyPasting
	};
	if (functionNumber == 3) {
		prototype.blocks = blocks;
	} else if (functionNumber != 2 && functionNumber != 6) {
		prototype.id = Network.localToServerId(idLocal);
		prototype.data = dataLocal;
		if (functionNumber == 5) {
			prototype.replaceId = Network.localToServerId(id);
			prototype.replaceData = data;
		}
	}
	Network.sendToServer("setting.perform", prototype);
};

const sendReply = function() {
	if (functionNumber <= 0 || clientUid == null) {
		return;
	}
	let client = Network.getClientForPlayer(clientUid);
	if (client != null) {
		let prototype = {
			current: koll_current,
			set: koll_set
		};
		if (functionNumber == 2 || functionNumber == 6) {
			prototype.blocks = blocks;
		}
		client.send("setting.complete", prototype);
	}
	clientUid = null;
};
