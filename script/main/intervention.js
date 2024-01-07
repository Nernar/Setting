let windowTransparent = 1,
	windowLength = 0.36,
	windowDynamic = true,
	hintsViaOverlay = false,
	coverOpaqueBlocks = true,
	beautifyJson = false,
	placeAirBeforePaste = false,
	typeface = android.graphics.Typeface.MONOSPACE;

const yxzToProject = function(yxz) {
	let project = {
		sizes: [0, yxz.length, 0],
		blocks: []
	};
	for (let y = 0; y < project.sizes[1]; y++) {
		let m = yxz[y].length;
		for (let x = 0; x < m; x++) {
			let n = yxz[y][x].length;
			for (let z = 0; z < n; z++) {
				let id = typeof yxz[y][x][z] != "number" ? yxz[y][x][z].id : yxz[y][x][z];
				if (id != 0) {
					let data = typeof yxz[y][x][z] != "number" ? (yxz[y][x][z].data || yxz[y][x][z].meta || 0) : 0;
					project.blocks.push({ x: x, y: y, z: z, id: id, data: data });
				}
			}
			project.sizes[2] = Math.max(project.sizes[2], n);
		}
		project.sizes[0] = Math.max(project.sizes[0], m);
	}
	return project;
};

const loadFromProject = function(file) {
	if (file instanceof java.io.File) {
		file = "" + file.getPath();
	}
	eval("file = " + $.FileTools.readFileText(file));
	if (Array.isArray(file)) {
		file = yxzToProject(file);
	}
	if (file.blocks == null || file.blocks.length == 0) {
		return false;
	}
	if (Array.isArray(file.blocks[0])) {
		file = yxzToProject(file.blocks);
	}
	if (file.blocks.length == 0) {
		return false;
	}
	blocks = file.blocks;
	overrideLegacyPasting = typeof blocks[0] != "number";
	if (overrideLegacyPasting) {
		koll_total = blocks.length;
		xkol = file.sizes[0];
		ykol = file.sizes[1];
		zkol = file.sizes[2];
	} else {
		koll_total = file.sizes[0];
		xkol = file.sizes[1];
		ykol = file.sizes[2];
		zkol = file.sizes[3];
		if (file.type != null) {
			operationDirection = file.type;
		}
	}
	return true;
};

const preround = function(number, fixed) {
	typeof fixed == "undefined" && (fixed = 6);
	return parseFloat(Number(number).toFixed(fixed));
};

const stringifyObject = function(obj, beautify, callback) {
	if (callback === undefined) {
		callback = {};
	}

	const recursiveStringify = function(obj, identation, depth) {
		if (callback.onUpdate) {
			callback.onUpdate();
		}

		if (obj === null || obj === undefined) {
			return "null";
		}

		switch (typeof obj) {
			case "string":
				obj = new java.lang.String(obj);
				obj = obj.replaceAll("\"", "\\\\\"");
				obj = obj.replaceAll("\t", "\\\\t");
				obj = obj.replaceAll("\n", "\\\\n");
				return "\"" + obj + "\"";

			case "number":
				return "" + preround(obj);

			case "boolean":
				return "" + obj;

			case "object":
				if (depth > 5) {
					return null;
				}

				let entries = [];
				let newLine = false;
				let insertNewLineNow = false;

				if (Array.isArray(obj)) {
					for (let i = 0; i < obj.length; i++) {
						let result = recursiveStringify(obj[i], identation, depth + 1);
						if (result && result.length > 0) {
							if (beautify) {
								if (result.indexOf("\n") != -1 || result.length > 48 || result.charAt(0) == "{") {
									entries.push((entries.length > 0 ? "\n" + identation.replace("\t", "") : "") + result);
									newLine = insertNewLineNow = true;

								} else if (insertNewLineNow) {
									entries.push("\n" + identation.replace("\t", "") + result);
									insertNewLineNow = false;

								} else if (entries.length > 0) {
									entries.push(" " + result);
								} else {
									entries.push(result);
								}
							} else {
								entries.push(result);
							}
						}
					}

					return "[" + entries.join(",") + "]";
				} else {
					if (obj["class"] !== undefined) {
						return;
					}

					for (let item in obj) {
						let result = recursiveStringify(obj[item], identation + "\t", depth + 1);
						if (result && result.length > 0) {
							if (beautify) {
								if (result.indexOf("\n") != -1 || result.length > 8) {
									entries.push((entries.length > 0 ? "\n" + identation : "") + item + ": " + result);
									newLine = insertNewLineNow = true;

								} else if (insertNewLineNow) {
									entries.push("\n" + identation + item + ": " + result);
									insertNewLineNow = false;

								} else if (entries.length > 0) {
									entries.push(" " + item + ": " + result);
								} else {
									entries.push(item + ": " + result);
								}
							} else {
								entries.push(item + ":" + result);
							}
						}
					}

					if (entries.length == 0) {
						return "{}";
					}

					let before = beautify ? newLine ? "{\n" + identation : "{ " : "{";
					let after = beautify ? newLine ? "\n" + identation.replace("\t", "") + "}" : " }" : "}";
					return before + entries.join(",") + after;
				}

			default:
				if (callback.onPassed) {
					callback.onPassed(obj, typeof obj);
				}
		}
	};

	if (typeof obj == "object" && !Array.isArray(obj)) {
		return recursiveStringify(obj, "\t", 0);
	}
	return recursiveStringify(obj, "", 0);
};

const saveAsProject = function(file) {
	if (file instanceof java.io.File) {
		file = "" + file.getPath();
	}
	if (overrideLegacyPasting) {
		let structure = stringifyObject({
			sizes: [xkol, ykol, zkol],
			blocks: blocks
		}, beautifyJson);
		$.FileTools.writeFileText(file, structure);
	} else {
		let structure = stringifyObject({
			sizes: [koll_total, xkol, ykol, zkol],
			type: operationDirection,
			blocks: blocks
		}, beautifyJson);
		$.FileTools.writeFileText(file, structure);
	}
};

const getProjects = function() {
	let file = new java.io.File(__dir__ + "projects"),
		list = file.listFiles(),
		files = [],
		projects = [];
	for (let i = 0; i < list.length; i++) {
		let name = list[i].getName();
		if (name.endsWith(".json") || name.endsWith(".setp")) {
			files.push(list[i]);
			projects.push(getNameWithoutExtension(name) + " (" + name.substring(name.lastIndexOf(".") + 1) + ")");
		}
	}
	return {
		items: projects,
		files: files
	};
};

const hasAnyProject = function() {
	let file = new java.io.File(__dir__ + "projects"),
		list = file.listFiles();
	for (let i = 0; i < list.length; i++) {
		let name = list[i].getName();
		if (name.endsWith(".json") || name.endsWith(".setp")) {
			return true;
		}
	}
	return false;
};

const getNextProject = function() {
	let extension = overrideLegacyPasting ? ".json" : ".setp";
	for (let i = 1; ; i++) {
		let file = new java.io.File(__dir__ + "projects", "building" + i + extension);
		if (!file.exists()) return file;
	}
	return null;
};

const updateSettings = function() {
	__config__.checkAndRestore({
		blocks_per_tick: 20,
		window_transparent: 1,
		window_length: 0.36,
		window_dynamic: true,
		hints_via_overlay: false,
		operation_direction: 0,
		cover_opaque_blocks: true,
		beautify_json: false,
		place_air_before_paste: false
	});
	blocksPerTick = __config__.getInteger("blocks_per_tick");
	windowTransparent = __config__.getDouble("window_transparent");
	windowLength = __config__.getDouble("window_length");
	windowDynamic = __config__.getBool("window_dynamic");
	hintsViaOverlay = __config__.getBool("hints_via_overlay");
	operationDirection = __config__.getInteger("operation_direction");
	coverOpaqueBlocks = __config__.getBool("cover_opaque_blocks");
	beautifyJson = __config__.getBool("beautify_json");
	placeAirBeforePaste = __config__.getBool("place_air_before_paste");
};

try {
	let file = new java.io.File(__dir__ + "assets", "font.otf");
	typeface = android.graphics.Typeface.createFromFile(file);
} catch (e) {
	reportError(e);
}

try {
	let file = new java.io.File(__dir__ + "projects");
	if (file.isFile()) {
		file.delete();
	}
	file.mkdirs();
} catch (e) {
	reportError(e);
}

const start = function(which) {
	if (clientUid == null) {
		let carried = getPlayerBlockInHand();
		idLocal = carried.id;
		dataLocal = carried.data;
	}
	koll_current = koll_set = 0;
	xxa = yya = zza = 0;
	koll_insert = (xkol + 1) * (ykol + 1) * (zkol + 1);
	if (which == 2 || which == 6) {
		blocks = [];
		overrideLegacyPasting = true;
	} else if (which == 7) {
		covered = [];
	} else if (which == 3 && overrideLegacyPasting) {
		koll_total = blocks.length;
		if (placeAirBeforePaste) {
			koll_total += koll_insert;
		}
	}
	functionNumber = which;
	sendRequest();
};

const stop = function() {
	if (pos1[3] != null && pos2[3] != null) {
		pos1[3] = rule;
		pos2[3] = false;
	}
	if (functionNumber != 5) replace = false;
	sendReply();
	functionNumber = 0;
};

Callback.addCallback(isOutdated ? "tick" : "LocalTick", function() {
	if (leaved) {
		leaved = false;
		if (pos1 == null) {
			let position = getPosition();
			pos1 = [position.x, position.y, position.z, false];
			pos2 = [position.x, position.y, position.z, false];
			updata();
		}

		if (rover) {
			updateSettings();
			handle(function() {
				createButton();
			});
		}
	}
	if (rover) {
		if (pos1[3] == true && pos2[3] == false) {
			let position = getPosition();
			pos2 = [position.x, position.y, position.z, false];
			particle();
		}

		if (pos1[3] == false && pos2[3] == true) {
			let position = getPosition();
			pos1 = [position.x, position.y, position.z, false];
			particle();
		}

		if ((pos1[3] == true && pos2[3] == true) || setsovle[1] == true) {
			particle();
		}

		if (rule == true) {
			particle();
			if (tick > 0) {
				tick--;
			} else {
				handle(function() {
					showHint(xkol + ", " + ykol + ", " + zkol);
				});
				tick = hintsViaOverlay ? 60 : 5;
			}
		}

		if (functionNumber > 0) {
			if (isServer && sovleGoFunctions && !doPrivileged) {
				functions();
			}
			handle(function() {
				updateButton();
			});
		}
	}
});

Callback.addCallback("LevelLeft", function() {
	if (rover) {
		handle(function() {
			removeButton();
			removeMenu();
		});
		if (pos1 != null) {
			pos1[3] = false;
		}
		if (pos2 != null) {
			pos2[3] = false;
		}
		clientUid = null;
		doPrivileged = false;
	}
	leaved = true;
});

Callback.addCallback("NativeCommand", function(cmd) {
	if (cmd == "/start" && !rover) {
		rover = true;
		updateSettings();
		handle(function() {
			createButton();
		});
	}
});

Callback.addCallback("ServerLevelLoaded", function() {
	isServer = false;
});

Callback.addCallback("RemoteLevelLoaded", function() {
	isServer = true;
});
