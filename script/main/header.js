/*

   Copyright 2015 Dmitry Medvedev (vk.com/id305567723)
   Copyright 2018-2023 Nernar (github.com/nernar)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

IMPORT("Retention");

let $ = new JavaImporter();
$.importPackage(Packages.android.graphics);
$.importPackage(Packages.android.view);
$.importPackage(Packages.android.widget);
$.importPackage(Packages.zhekasmirnov.launcher.utils);
$.importPackage(com.zhekasmirnov.innercore.utils);

if (this.isOutdated === undefined) {
	this.isOutdated = false;
}

const getPlayerUid = function() {
	if (Player.getServer != null) {
		let playerUid = Player.getServer();
		if (playerUid == -1) {
			playerUid = Player.getLocal();
		}
		return playerUid;
	}
	return Player.get();
};

const getPosition = function() {
	let position = Entity.getPosition(getPlayerUid());
	return {
		x: Math.floor(position.x),
		y: Math.floor(position.y - 1),
		z: Math.floor(position.z),
	};
};

const getPlayerBlockInHand = function() {
	let item = Entity.getCarriedItem(getPlayerUid());
	if (item.id > 255 && item.id < 8192) {
		Logger.Log("Setting: You are holding item " + item.id + ":" + item.data + ", but block is required!", "WARNING");
		return { id: 0, data: 0, holdingItem: true };
	}
	return {
		id: item.id < 0 ? 255 - item.id : item.id,
		data: item.data
	};
};

const getBlockIdUniversal = function(x, y, z) {
	if (region != null) {
		return region.getBlockId(x, y, z);
	}
	return World.getBlockID(x, y, z);
};

const getBlockDataUniversal = function(x, y, z) {
	if (region != null) {
		return region.getBlockData(x, y, z);
	}
	return World.getBlockData(x, y, z);
};

const getBlockUniversal = function(x, y, z) {
	if (region != null) {
		return region.getBlock(x, y, z);
	}
	return {
		id: getBlockIdUniversal(x, y, z),
		data: getBlockDataUniversal(x, y, z)
	};
};

const getExtraBlockUniversal = function(x, y, z) {
	if (region != null) {
		return region.getExtraBlock(x, y, z);
	}
	return { id: 0, data: 0 };
};

const getBlockEntityUniversal = function(x, y, z) {
	if (region != null) {
		return region.getBlockEntity(x, y, z);
	}
	return Level.getTileEntity(x, y, z);
};

const getTileEntityUniversal = function(x, y, z) {
	if (region != null) {
		return TileEntity.getTileEntity(x, y, z, region);
	}
	return TileEntity.getTileEntity(x, y, z);
};

const setBlockUniversal = function(x, y, z, block) {
	let id = typeof block.id == "string" ? BlockID[block.id] : block.id;
	if (id == null) {
		Logger.Log("Setting: Invalid ID " + block.id + ", skipping block " + x + ", " + y + ", " + z, "WARNING");
		return;
	}
	if (region != null) {
		let state = new BlockState(id, block.data);
		if (block.states) {
			state = state.addStates(block.states);
		}
		region.setBlock(x, y, z, state);
		return;
	}
	World.setBlock(x, y, z, id, block.data);
};

const setExtraBlockUniversal = function(x, y, z, block) {
	let id = typeof block.id == "string" ? BlockID[block.id] : block.id;
	if (id == null) {
		Logger.Log("Setting: Invalid ID " + block.id + ", skipping block " + x + ", " + y + ", " + z, "WARNING");
		return;
	}
	if (region != null) {
		let state = new BlockState(id, block.data);
		if (block.states) {
			state = state.addStates(block.states);
		}
		region.setExtraBlock(x, y, z, state);
		return;
	}
	let cover = getBlockUniversal(x, y, z);
	if (cover.id == 0 || (coverOpaqueBlocks && canTileBeReplaced(cover.id, cover.data))) {
		World.setBlock(x, y, z, id, block.data);
	}
};

const setBlockIdDataUniversal = function(x, y, z, id, data) {
	let toId = typeof id == "string" ? BlockID[id] : id;
	if (toId == null) {
		Logger.Log("Setting: Invalid ID " + id + ", skipping block " + x + ", " + y + ", " + z, "WARNING");
		return;
	}
	if (region != null) {
		region.setBlock(x, y, z, toId, data || 0);
		return;
	}
	World.setBlock(x, y, z, toId, data || 0);
};

const setExtraBlockIdDataUniversal = function(x, y, z, id, data) {
	let toId = typeof id == "string" ? BlockID[id] : id;
	if (toId == null) {
		Logger.Log("Setting: Invalid ID " + id + ", skipping block " + x + ", " + y + ", " + z, "WARNING");
		return;
	}
	if (region != null) {
		region.setExtraBlock(x, y, z, toId, data || 0);
		return;
	}
	let cover = getBlockUniversal(x, y, z);
	if (cover.id == 0 || (coverOpaqueBlocks && canTileBeReplaced(cover.id, cover.data))) {
		World.setBlock(x, y, z, toId, data || 0);
	}
};

const formatInt = function(number) {
	if (number < 1000) {
		return number;
	} else if (number >= 1000000) {
		return Math.floor(number / 1000000) + Math.floor(number % 1000000 / 100000) + "M";
	} else if (number >= 100000) {
		return Math.floor(number / 1000) + "K";
	} else if (number >= 1000) {
		return Math.floor(number / 1000) + "." + Math.floor(number % 1000 / 100) + "K";
	}
	return "NaN";
};

const placeholderNameByID = {};

const getNameByID = function(id) {
	if (IDRegistry.getNameByID != null) {
		return IDRegistry.getNameByID(id);
	}
	if (placeholderNameByID.hasOwnProperty(id)) {
		return placeholderNameByID[id];
	}
	return null;
};

Callback.addCallback("PostLoaded", function() {
	if (IDRegistry.getNameByID != null) {
		return;
	}
	placeholderNameByID = {};
	for (let key in BlockID) {
		placeholderNameByID[BlockID[key]] = key;
	}
});
