const Dirs = {
	EXTERNAL: android.os.Environment.getExternalStorageDirectory(),
	DATA: android.os.Environment.getDataDirectory() + "/data/" + (isHorizon ? getContext().getPackageName() : "com.zhekasmirnov.innercore") + "/",
	ASSET: __dir__ + "assets/",
	EXPORT: __dir__ + "projects/"
};

tryout(function() {
	for (let item in Dirs) {
		if (item != "EXTERNAL" && item != "DATA") {
			if (!Dirs[item].startsWith(Dirs.EXTERNAL)) {
				Dirs[item] = String(Dirs.EXTERNAL + Dirs[item]);
			}
		}
	}
});

const formatSize = function(size) {
	return size < 100 ? Number(size).toFixed(2) :
		size < 1000 ? Number(size).toFixed(1) :
		size < 1024 ? Number(size).toFixed() : "?";
};

const Files = new Object();

Files.createFile = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	if (!file.exists()) file.createNewFile();
};

Files.createNewWithParent = function(path, name) {
	if (name == undefined) let file = new java.io.File(path);
	else file = new java.io.File(path, name);
	file.getParentFile().mkdirs();
	file.createNewFile();
};

Files.checkFormats = function(list, formats) {
	let formatted = new Array();
	if (!Array.isArray(formats)) {
		formats = [formats];
	}
	for (let item in formats) {
		for (let name in list) {
			if (list[name].endsWith(formats[item])) {
				formatted.push(list[name]);
			}
		}
	}
	return formatted;
};

Files.getNameExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return null;
	return name.substring(index + 1);
};

Files.getNameWithoutExtension = function(name) {
	let index = name.lastIndexOf(".");
	if (index <= 0) return name;
	return name.substring(0, index);
};

Files.getExtension = function(file) {
	let name = file.getName(),
		index = name.lastIndexOf(".");
	if (file.isDirectory() || index <= 0) {
		return null;
	}
	return name.substring(index + 1);
};

Files.prepareSize = function(file) {
	let size = file.length();
	return this.prepareFormattedSize(size);
};

Files.prepareFormattedSize = function(size) {
	return size <= 0 ? translate("Empty") : size < 1024 ? translate("%s bytes", size) :
		size < 1024 * 1024 ? translate("%s KB", formatSize(size / 1024)) :
		size < 1024 * 1024 * 1024 ? translate("%s MB", formatSize(size / (1024 * 1024))) :
		size < 1024 * 1024 * 1024 * 1024 ? translate("%s GB", formatSize(size / (1024 * 1024 * 1024))) :
		translate("%s TB", formatSize(size / (1024 * 1024 * 1024 * 1024)));
};

Files.listFiles = function(path, explore) {
	let files = new Array(),
		file = new java.io.File(path);
	if (file.isFile()) return [file];
	let list = file.listFiles() || new Array();
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(list[i]);
		} else if (explore) {
			files = files.concat(this.listFiles(list[i], explore));
		}
	}
	return files.sort();
};

Files.listDirectories = function(path, explore) {
	let directories = new Array(),
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || new Array();
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(list[i]);
			if (explore) directories = directories.concat(this.listDirectories(list[i], explore));
		}
	}
	return directories.sort();
};

Files.listFileNames = function(path, explore, root) {
	let files = new Array(),
		file = new java.io.File(path);
	if (root === undefined) root = path;
	if (file.isFile()) return [String(path).replace(root, String())];
	if (!String(root).endsWith("/") && String(root).length > 0) {
		root += "/";
	}
	let list = file.listFiles() || new Array();
	for (let i = 0; i < list.length; i++) {
		if (list[i].isFile()) {
			files.push(String(list[i]).replace(root, String()));
		} else if (explore) {
			files = files.concat(this.listFileNames(list[i], explore, root));
		}
	}
	return files.sort();
};

Files.listDirectoryNames = function(path, explore, root) {
	let directories = new Array(),
		file = new java.io.File(path);
	if (file.isFile()) return directories;
	let list = file.listFiles() || new Array();
	if (root === undefined) root = path;
	if (!String(root).endsWith("/") && String(root).length > 0) {
		root += "/";
	}
	for (let i = 0; i < list.length; i++) {
		if (list[i].isDirectory()) {
			directories.push(String(list[i]).replace(root, String()));
			if (explore) directories = directories.concat(this.listDirectoryNames(list[i], explore, root));
		}
	}
	return directories.sort();
};

Files.filesCount = function(path) {
	return new java.io.File(path).list().length;
};

Files.deleteRecursive = function(path, explore) {
	let file = new java.io.File(path);
	if (file.isDirectory()) {
		let list = file.listFiles();
		for (let i = 0; i < list.length; i++) {
			if (explore || !list[i].isDirectory()) {
				this.deleteRecursive(list[i].getPath(), explore);
			}
		}
	}
	file.delete();
};

Files.readKey = function(file, separator) {
	separator = separator || "=";
	let text = this.read(file, true),
		obj = new Object();
	for (let i = 0; i < text.length; i++) {
		let source = text[i].split(separator);
		if (source.length == 2) obj[source[0]] = source[1];
	}
	return obj;
};

Files.writeKey = function(file, obj, separator) {
	separator = separator || "=";
	let result = new Array();
	for (let item in obj) {
		result.push(item + separator + obj[item]);
	}
	this.write(file, result.join("\n"));
};

Files.read = function(file, massive) {
	if (!file.exists()) return massive ? new Array() : null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = new Array(),
		line;
	while (line = reader.readLine()) {
		result.push(line);
	}
	return massive ? result : result.join("\n");
};

Files.readLine = function(file, index) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		count = -1,
		line;
	while (count < index && (line = reader.readLine())) {
		count++;
	}
	return count == index ? line : null;
};

Files.readLines = function(file, startInd, endInd) {
	if (!file.exists()) return null;
	let reader = java.io.BufferedReader(new java.io.FileReader(file)),
		result = new Array(),
		count = -1,
		line;
	while (count <= endInd && (line = reader.readLine())) {
		if (count >= startInd) {
			result.push(line);
		}
		count++;
	}
	return result.length > 0 ? result : null;
};

Files.readBytes = function(file) {
	if (!file.exists()) return null;
	let stream = new java.io.FileInputStream(file);
	let output = new java.io.ByteArrayOutputStream();
	let arr = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
	while (true) {
		let read = stream.read(arr);
		if (read < 0) return output.toByteArray();
		output.write(arr, 0, read);
	}
};

Files.writeBytes = function(file, bytes) {
	file.createNewFile();
	let stream = new java.io.FileOutputStream(file);
	stream.write(bytes);
	stream.close();
};

Files.write = function(file, text) {
	Files.writeBytes(file, java.lang.String(text).getBytes());
};

Files.addText = function(file, text) {
	if (!file.exists()) file.createNewFile();
	Files.write(file, Files.read(file) + text);
};

Files.linesCount = function(file) {
	return Files.read(file, true).length;
};

Files.shrinkPathes = function(source, element) {
	if (source instanceof java.io.File) {
		source = source.getPath();
	}
	if (element instanceof java.io.File) {
		element = element.getPath();
	}
	return String(element).replace(String(source), String());
};

Files.copyRecursive = function(path, output, explore, includeDirectories) {
	let files = this.listFiles(path, explore),
		count = 0;
	if (includeDirectories !== false) {
		let directories = this.listDirectories(path, explore);
		for (let i = 0; i < directories.length; i++) {
			let source = this.shrinkPathes(path, directories[i]);
			if (source.length > 0) {
				let file = new java.io.File(output, source);
				if (!file.exists()) file.mkdirs();
				count++;
			}
		}
	}
	for (let i = 0; i < files.length; i++) {
		let source = this.shrinkPathes(path, files[i]);
			file = new java.io.File(output, source);
		this.copy(files[i], file.getPath());
		count++;
	}
	return count;
};

Files.copy = function(file, path) {
	let result = new java.io.File(path);
	if (!result.exists()) this.createNewWithParent(result);
	this.writeBytes(result, this.readBytes(file));
};

Files.cut = function(file, path) {
	Files.copy(file, path);
	file.delete();
};

Files.asMD5 = function(file, simpleCompare) {
	if (!(file instanceof java.io.File)) {
		file = new java.io.File(file);
	}
	if (simpleCompare) {
		let size = java.lang.String(file.length());
		return Hashable.toMD5(size.getBytes());
	}
	return Hashable.toMD5(this.readBytes(file));
};

Files.compare = function(left, right, simpleCompare) {
	left = this.asMD5(left, simpleCompare);
	right = this.asMD5(right, simpleCompare);
	return left == right;
};

Files.compareRecursive = function(input, target, explore, simpleCompare, includeDirectories) {
	let left = this.listFileNames(input, explore),
		right = this.listFileNames(target, explore),
		changes = new Array();
	if (includeDirectories !== false) {
		let first = this.listDirectoryNames(input, explore),
			second = this.listDirectoryNames(target, explore);
		for (let i = 0; i < second.length; i++) {
			let output = new java.io.File(target, second[i]);
			if (first.indexOf(second[i]) == -1) {
				changes.push(output);
			}
		}
	}
	for (let i = 0; i < right.length; i++) {
		let output = new java.io.File(target, right[i]);
		if (left.indexOf(right[i]) == -1) {
			changes.push(output);
			continue;
		}
		let file = new java.io.File(input, left[i])
		if (!this.compare(output, file, simpleCompare)) {
			changes.push(output);
		}
	}
	return changes;
};

Files.isCompared = function(input, target, explore, simpleCompare, includeDirectories) {
	return this.compareRecursive(input, target, explore, simpleCompare, includeDirectories).length == 0;
};

Files.isIdentical = function(left, right, explore, simpleCompare, includeDirectories) {
	return this.isCompared(left, right, explore, simpleCompare, includeDirectories) &&
		this.isCompared(right, left, explore, simpleCompare, includeDirectories);
};

Files.copyAndCompare = function(from, to, explore, simpleCompare, includeDirectories) {
	this.copyRecursive(from, to, explore, includeDirectories);
	return this.isCompared(to, from, explore, simpleCompare, includeDirectories);
};