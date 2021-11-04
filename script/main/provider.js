const createButton = function() {
	CurrentButtonLayout = getStyledLayout("menu");
	CurrentButtonLayout.setOrientation(Interface.Orientate.VERTICAL);
	CurrentButtonLayout.setAlpha(alpha);

	button0 = getStyledButton("menu");
	button0.setText(translate("Menu").toUpperCase());
	button0.setTextSize(20);
	button0.setOnClickListener(function(viewarg) {
		createMenu(0);
		removeButton();
	});
	button0.setOnLongClickListener(function(viewarg) {
		let edit = new android.widget.EditText(getContext());
		lastCode && edit.setText(lastCode);
		edit.setHint(translate("// your code"));
		edit.setTextColor(Interface.Color.BLACK);
		edit.setHintTextColor(Interface.Color.DKGRAY);
		edit.setBackgroundDrawable(null);

		let builder = new android.app.AlertDialog.Builder(getContext());
		builder.setTitle(translate("Enter required code"));
		builder.setPositiveButton(translate("Launch"), function() {
			try {
				lastCode = edit.getText().toString();
				eval(String(lastCode));
			} catch (e) {
				showHint(e.message);
			}
		});
		builder.setNegativeButton(translate("Cancel"), null);
		builder.setView(edit);

		builder.create().show();
		return true;
	});
	CurrentButtonLayout.addView(button0);

	if (locationInfo) {
		text17 = getStyledText();
		text17.setGravity(Interface.Gravity.CENTER);
		text17.setPadding(5, 5, 5, 0);
		text17.setTextSize, (14);
		CurrentButtonLayout.addView(text17);

		text18 = getStyledText();
		text18.setGravity(Interface.Gravity.CENTER);
		text18.setPadding(5, 0, 5, 5);
		text18.setTextSize(14);
		CurrentButtonLayout.addView(text18);
	}

	CurrentButtonWindow = new android.widget.PopupWindow(CurrentButtonLayout, Interface.Display.WRAP, Interface.Display.WRAP);
	CurrentButtonWindow.showAtLocation(Interface.getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const createStop = function() {
	CurrentStopLayout = getStyledLayout("menu");
	CurrentStopLayout.setOrientation(Interface.Orientate.VERTICAL);
	CurrentStopLayout.setAlpha(alpha);

	button24 = getStyledButton("menu");
	button24.setText(translate("Interrupt").toUpperCase());
	button24.setTextSize(20);
	button24.setOnClickListener(function(viewarg) {
		sovleGoFunctions = false;
		removeStop();
		createMenu(0);
	});
	CurrentStopLayout.addView(button24);

	text15 = getStyledText();
	text15.setGravity(Interface.Gravity.CENTER);
	text15.setPadding(5, 5, 5, 0);
	text15.setTextSize, (14);
	CurrentStopLayout.addView(text15);

	text16 = getStyledText();
	text16.setGravity(Interface.Gravity.CENTER);
	text16.setPadding(5, 0, 5, 5);
	text16.setTextSize(14);
	CurrentStopLayout.addView(text16);

	updateStop();

	CurrentStopWindow = new android.widget.PopupWindow(CurrentStopLayout, Interface.getX(360), Interface.Display.WRAP);
	CurrentStopWindow.showAtLocation(Interface.getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const updateStop = function() {
	text15.setText(formatInt(koll_current) + "/" + formatInt(koll_total));
	text16.setText(Math.floor(koll_current / koll_total * 1000) / 10 + "%");
};

const updateButton = function() {
	let position = Player.getPosition(),
		angle = Entity.getLookAngle(Player.get());
	for (let i in angle) {
		if (typeof angle[i] == "number") {
			angle[i] = Math.round(angle[i] * 100) / 100;
		}
	}
	for (let i in position) {
		if (typeof position[i] == "number") {
			position[i] = Math.round(position[i] * 10) / 10;
		}
	}
	text17.setText("x: " + position.x + ", y: " + position.y + ", z: " + position.z);
	text18.setText("yaw: " + angle.yaw + ", pitch: " + angle.pitch);
};

const showDialog = function() {
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("setting"));
	dialog.setMessage(android.text.Html.fromHtml(translate("Modification allows you to fully manage world, " +
		"build, fill, replace, copy blocks and much more. Construction " +
		"takes place in background, you can create your masterpieces right during process. " +
		"Use modification for any purpose, because main thing is your imagination!" +
		"<br/><br/>Project participants:" +
		"<br/><a href=\"vk.com/id268478382\">Max Korablev</a> - chief developer" +
		"<br/><a href=\"vk.com/id305567723\">Dmitry Medvedev</a> - implementation author" +
		"<br/><br/>Important links:" +
		"<br/><a href=\"vk.com/club148880110\">Group</a> - news, help and documentation")));
	dialog.setPositiveButton(translate("Leave"), null);
	dialog.create().show();
};

const saveDialog = function(type) {
	let file = getNextProject();
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("Exporting"));
	dialog.setMessage(translate("File will be saved as %s, continue?", Files.getNameWithoutExtension(file.getName())));
	dialog.setPositiveButton(translate("OK"), function() {
		try {
			saveAsProject(file);
			if (menuCanUpdate) updateMenu(type);
			showHint(translate("Exported"));
		} catch (e) {
			showHint(translate("Temporarily unavailable"));
		}
	});
	dialog.setNegativeButton(translate("Leave"), null);
	dialog.create().show();
};

const loadDialog = function(type) {
	let list = getProjects();
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("Importing"));
	dialog.setItems(list.items, function(d, i) {
		try {
			loadFromProject(list.files[i]);
			setsovle = [true, true];
			if (menuCanUpdate) updateMenu(type);
			showHint(translate("Imported"));
		} catch (e) {
			showHint(translate("Temporarily unavailable"));
		}
	});
	dialog.setNegativeButton(translate("Leave"), null);
	dialog.create().show();
};

const removeButton = function() {
	if (this.CurrentButtonWindow) {
		CurrentButtonWindow.dismiss();
		CurrentButtonWindow = null;
	}
};

const removeStop = function() {
	if (this.CurrentStopWindow) {
		CurrentStopWindow.dismiss();
		CurrentStopWindow = null;
	}
};