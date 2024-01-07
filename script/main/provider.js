const createButton = function() {
	CurrentButtonLayout = getStyledLayout("menu");
	CurrentButtonLayout.setOrientation($.LinearLayout.VERTICAL);
	CurrentButtonLayout.setAlpha(windowTransparent);

	button0 = getStyledButton("menu");
	button0.setText(translate("Setting"));
	button0.setTextSize(20);
	button0.setOnClickListener(function(viewarg) {
		createMenu(0);
		removeButton();
	});
	CurrentButtonLayout.addView(button0);

	button24 = getStyledButton("menu");
	button24.setText(translate("Setting"));
	button24.setTextSize(20);
	button24.setOnClickListener(function(viewarg) {
		if (!doPrivileged) {
			sovleGoFunctions = false;
			removeButton();
			createMenu(0);
		}
	});
	CurrentButtonLayout.addView(button24);

	progress0 = getStyledProgress();
	progress0.setMax(1000);
	progress0.setVisibility($.View.GONE);
	CurrentButtonLayout.addView(progress0);

	text15 = getStyledText();
	text15.setGravity($.Gravity.CENTER);
	text15.setPadding(5, 5, 5, 5);
	text15.setTextSize(14);
	text15.setVisibility($.View.GONE);
	CurrentButtonLayout.addView(text15);

	if (windowDynamic) updateButton();

	CurrentButtonWindow = new android.widget.PopupWindow(CurrentButtonLayout, $.ViewGroup.LayoutParams.WRAP_CONTENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
	CurrentButtonWindow.showAtLocation(getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const updateButton = function() {
	if (this.CurrentButtonLayout) {
		if (functionNumber == 0) {
			button0.setVisibility($.View.VISIBLE);
			button24.setVisibility($.View.GONE);
			text15.setVisibility($.View.GONE);
			progress0.setVisibility($.View.GONE);
		} else {
			button0.setVisibility($.View.GONE);
			button24.setVisibility($.View.VISIBLE);
			progress0.setVisibility($.View.VISIBLE);
			progress0.setIndeterminate(doPrivileged);
			if (doPrivileged) {
				text15.setVisibility($.View.GONE);
				button24.setText(translate("Awaiting"));
			} else {
				text15.setVisibility($.View.VISIBLE);
				text15.setText(formatInt(koll_current) + "/" + formatInt(koll_total));
				progress0.setProgress(Math.floor(koll_current / koll_total * 1000));
				button24.setText(sovleGoFunctions ? translate("Interrupt") : translate("Setting"));
			}
		}
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

const getNameWithoutExtension = function(name) {
	if (name instanceof java.io.File) {
		name = "" + name.getName();
	}
	let index = name.lastIndexOf(".");
	return index > 0 ? name.substring(0, index) : name;
};

const saveDialog = function(type) {
	let dialog = new android.app.AlertDialog.Builder(getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
	dialog.setTitle(translate("Exporting"));
	let file = getNextProject();
	dialog.setMessage(translate("File will be saved as %s, continue?", getNameWithoutExtension(file)));
	dialog.setPositiveButton(translate("OK"), function() {
		try {
			saveAsProject(file);
			if (windowDynamic) updateMenu(type);
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
			if (loadFromProject(list.files[i])) {
				setsovle = [true, true];
				if (windowDynamic) updateMenu(type);
				showHint(translate("Imported"));
			} else {
				showHint(translate("Format is not supported or outdated"));
			}
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
