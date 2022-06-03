let menuWidth = 0.26,
	typeface = android.graphics.Typeface.MONOSPACE;

let menuCanUpdate = true,
	coordsButtonShow = false,
	parseAir = true;

const loadFromProject = function(file) {
	eval("parsed = " + Files.read(file));
	koll_total = parsed.sizes[0];
	xkol = parsed.sizes[1];
	ykol = parsed.sizes[2];
	zkol = parsed.sizes[3];
	blocks = parsed.blocks;
	build = parsed.type;
};

const saveAsProject = function(file) {
	let obj = JSON.stringify({
		type: build,
		sizes: [koll_total, xkol, ykol, zkol],
		blocks: blocks
	});
	Files.write(file, obj);
};

const getProjects = function() {
	let file = new java.io.File(Dirs.EXPORT),
		list = file.listFiles(),
		files = [],
		projects = [];
	for (let i = 0; i < list.length; i++) {
		let name = list[i].getName();
		if (name.endsWith(".setp")) {
			files.push(list[i]);
			projects.push(name.replace(".setp", ""));
		}
	}
	return {
		items: projects,
		files: files
	};
};

const getNextProject = function() {
	for (let i = 1;; i++) {
		let file = new java.io.File(Dirs.EXPORT, "building" + i + ".setp");
		if (!file.exists()) return file;
	}
};

const updateSettings = function() {
	gran = 10;
	alpha = 1;
	build = 0;
};

tryout(function() {
	let file = new java.io.File(Dirs.ASSET, "font.ttf");
	typeface = android.graphics.Typeface.createFromFile(file);
});

tryout(function() {
	let file = new java.io.File(Dirs.EXPORT);
	if (file.isFile()) {
		file.delete();
	}
	file.mkdirs();
});

const start = function() {
	let carried = Player.getCarriedItem();
	idLocal = carried.id;
	dataLocal = carried.data;
	koll_current = 0;
	tick = 0;
	xxa = yya = zza = 0;
	removeMenu();
	createButton();
};

const stop = function() {
	if (pos1[3] != null && pos2[3] != null) {
		pos1[3] = rule;
		pos2[3] = false;
	}
	if (functionNumber !== 5) replace = false;
	functionNumber = 0;
	if (menuCanUpdate) updateButton();
};

Callback.addCallback("tick", function() {
	if (leaved) {
		leaved = false;
		if (pos1 == null) {
			pos1 = [getX(), getY(), getZ(), false];
			pos2 = pos1;
			updata();
		}

		updateSettings();
		if (rover) {
			handle(function() {
				createButton();
			});
		}
	}
	if (rover) {
		if (pos1[3] == true && pos2[3] == false) {
			pos2 = [getX(), getY(), getZ(), false];
			particle();
		}

		if (pos1[3] == false && pos2[3] == true) {
			pos1 = [getX(), getY(), getZ(), false];
			particle();
		}

		if ((pos1[3] == true && pos2[3] == true) || setsovle[1] == true) {
			particle();
		}

		if (rule == true) {
			particle();
			if (this.tick > 0) {
				tick--;
			} else {
				Game.tipMessage("x: " + xkol + ", y: " + ykol + ", z: " + zkol);
				tick = 5;
			}
		}

		if (functionNumber > 0) {
			if (sovleGoFunctions) {
				functions();
			}
			handle(function() {
				updateButton();
			});
		}
	}
});

Callback.addCallback("LevelLeft", function() {
	handle(function() {
		removeButton();
		removeMenu();
		leaved = true;
	});
});

Callback.addCallback("NativeCommand", function(cmd) {
	if (cmd == "/start" && !rover) {
		handle(function() {
			createButton();
			rover = true;
		});
	}
});