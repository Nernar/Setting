const createButton = function() {
	CurrentButtonLayout = getStyledLayout("menu");
	CurrentButtonLayout.setOrientation(Interface.Orientate.VERTICAL);
	CurrentButtonLayout.setAlpha(alpha);

	button0 = getStyledButton("menu");
	button0.setText(translate("Menu"));
	button0.setTextSize(20);
	button0.setOnClickListener(function(viewarg) {
		createMenu(0);
		removeButton();
	});
	CurrentButtonLayout.addView(button0);

	button24 = getStyledButton("menu");
	button24.setTextSize(20);
	button24.setOnClickListener(function(viewarg) {
		sovleGoFunctions = false;
		removeButton();
		createMenu(0);
	});
	CurrentButtonLayout.addView(button24);

	progress0 = getStyledProgress();
	progress0.setMax(1000);
	CurrentButtonLayout.addView(progress0);

	text15 = getStyledText();
	text15.setGravity(Interface.Gravity.CENTER);
	text15.setPadding(5, 5, 5, 5);
	text15.setTextSize, (14);
	CurrentButtonLayout.addView(text15);

	if (menuCanUpdate) updateButton();

	CurrentButtonWindow = new android.widget.PopupWindow(CurrentButtonLayout, Interface.Display.WRAP, Interface.Display.WRAP);
	CurrentButtonWindow.showAtLocation(Interface.getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const updateButton = function() {
	if (functionNumber == 0) {
		button0.setVisibility(Interface.Visibility.VISIBLE);
		button24.setVisibility(Interface.Visibility.GONE);
		text15.setVisibility(Interface.Visibility.GONE);
		progress0.setVisibility(Interface.Visibility.GONE);
	} else {
		button0.setVisibility(Interface.Visibility.GONE);
		button24.setVisibility(Interface.Visibility.VISIBLE);
		text15.setVisibility(Interface.Visibility.VISIBLE);
		progress0.setVisibility(Interface.Visibility.VISIBLE);
		text15.setText(formatInt(koll_current) + "/" + formatInt(koll_total));
		progress0.setProgress(Math.floor(koll_current / koll_total * 1000));
		button24.setText(sovleGoFunctions ? translate("Interrupt") : translate("Operation"));
	}
};

const showDialog = function() {
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("About"));
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
	let movement = dialog.create();
	movement.show();
	movement.findViewById(android.R.id.message).setMovementMethod
		(android.text.method.LinkMovementMethod.getInstance());
};

const saveDialog = function(type) {
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("Exporting"));
	let file = getNextProject();
	dialog.setMessage(translate("File will be saved as %s, continue?", Files.getNameWithoutExtension(file.getName())));
	dialog.setPositiveButton(translate("OK"), function() {
		try {
			saveAsProject(file);
			if (menuCanUpdate) updateMenu(type);
			showHint(translate("Exported"));
		} catch (e) {
			reportError(e);
			showHint(translate("Temporarily unavailable"));
		}
	});
	dialog.setNegativeButton(translate("Leave"), null);
	dialog.create().show();
};

const loadDialog = function(type) {
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("Importing"));
	let list = getProjects();
	dialog.setItems(list.items, function(d, i) {
		try {
			loadFromProject(list.files[i]);
			setsovle = [true, true];
			if (menuCanUpdate) updateMenu(type);
			showHint(translate("Imported"));
		} catch (e) {
			reportError(e);
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