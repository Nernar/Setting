const createMenu = function(type) {
	CurrentMenuLayout = getStyledLayout("menu");
	CurrentMenuLayout.setOrientation(Interface.Orientate.VERTICAL);
	CurrentMenuLayout.setAlpha(alpha);

	let layout = getStyledLayout();
	layout.setGravity(Interface.Gravity.RIGHT);
	CurrentMenuLayout.addView(layout);

	title = getStyledText("title");
	title.setGravity(Interface.Gravity.CENTER);
	title.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(Interface.Display.WIDTH * menuWidth - Interface.Display.WIDTH / 14, Interface.Display.MATCH));
	title.setText(translate("setting"));
	layout.addView(title);

	button23 = getStyledButton("transparent");
	button23.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(Interface.Display.WIDTH / 13, Interface.Display.WIDTH / 13));
	button23.setText(translate("|"));
	button23.setTextSize(30);
	button23.setOnClickListener(function(viewarg) {
		if (type == 0) {
			removeMenu();
			createButton();
		} else {
			removeMenu();
			createMenu(0);
		}
	});
	layout.addView(button23);

	let scroll = new android.widget.ScrollView(getContext());
	CurrentMenuLayout.addView(scroll);
	layout = getStyledLayout();
	layout.setOrientation(Interface.Orientate.VERTICAL);
	scroll.addView(layout);

	if (type == 0) {
		if (sovleGoFunctions) {
			text8 = getStyledText("group");
			text8.setText(translate("Measuring"));
			layout.addView(text8);

			button10 = getStyledButton("menu");
			button10.setText(translate("Conclude"));
			button10.setOnClickListener(function(viewarg) {
				rule = false;
				pos1[3] = pos2[3];
				if (menuCanUpdate) updateMenu(type);
			});
			layout.addView(button10);

			text1 = getStyledText("group");
			text1.setText(translate("Location"));
			layout.addView(text1);

			button1 = getStyledButton("menu");
			button1.setText(translate("Point %s", 1));
			button1.setOnClickListener(function(viewarg) {
				pos1 = [getX(), getY(), getZ(), true];
				setsovle = [false, false];
				updata();
				if (menuCanUpdate) updateMenu(type);
				showHint(translate("First point is set"));
			});
			layout.addView(button1);

			button2 = getStyledButton("menu");
			button2.setText(translate("Point %s", 2));
			button2.setOnClickListener(function(viewarg) {
				pos2 = [getX(), getY(), getZ(), true];
				setsovle = [false, false];
				updata();
				rule = false;
				if (menuCanUpdate) updateMenu(type);
				showHint(translate("Second point is set"));
			});
			layout.addView(button2);

			text2 = getStyledText("group");
			text2.setText(translate("Operation"));
			layout.addView(text2);

			button3 = getStyledButton("menu");
			button3.setText(translate("Fill"));
			button3.setOnClickListener(function(viewarg) {
				start();
				functionNumber = 1;
			});
			layout.addView(button3);

			button7 = getStyledButton("menu");
			button7.setText(translate("Pour"));
			button7.setOnClickListener(function(viewarg) {
				start();
				functionNumber = 4;
				koll_set = 0;
			});
			layout.addView(button7);

			button8 = getStyledButton("menu");
			button8.setText(translate("Replace"));
			button8.setOnClickListener(function(viewarg) {
				if (replace) {
					start();
					functionNumber = 5;
					koll_set = 0;
				} else {
					showHint(translate("Select block to replace"));
				}
			});
			layout.addView(button8);

			text3 = getStyledText("group");
			text3.setText(translate("Toolbox"));
			layout.addView(text3);

			button11 = getStyledButton("menu");
			button11.setText(translate("Out of hand"));
			button11.setOnClickListener(function(viewarg) {
				let carried = Player.getCarriedItem();
				id = carried.id;
				data = carried.data;
				replace = true;
				if (menuCanUpdate) updateMenu(type);
				showHint(translate("Replacement block is selected"));
			});
			layout.addView(button11);

			button9 = getStyledButton("menu");
			button9.setText(translate("Measure"));
			button9.setOnClickListener(function(viewarg) {
				pos1 = [getX(), getY(), getZ(), true];
				if (pos2[3] == null) pos2 = [getX(), getY(), getZ(), false];
				rule = true;
				if (menuCanUpdate) updateMenu(type);
			});
			layout.addView(button9);

			button13 = getStyledButton("menu");
			button13.setText(translate("Locate"));
			button13.setOnClickListener(function(viewarg) {
				Game.message("x: " + getX() + ", y: " + getY() + ", z: " + getZ());
			});
			layout.addView(button13);

			text4 = getStyledText("group");
			text4.setText(translate("Clipboard"));
			layout.addView(text4);

			button5 = getStyledButton("menu");
			button5.setText(translate("Copy"));
			button5.setOnClickListener(function(viewarg) {
				start();
				functionNumber = 2;
				blocks = new Array();
			});
			layout.addView(button5);

			button32 = getStyledButton("menu");
			button32.setText(translate("Cut out"));
			button32.setOnClickListener(function(viewarg) {
				start();
				functionNumber = 6;
				blocks = new Array();
			});
			layout.addView(button32);

			button6 = getStyledButton("menu");
			button6.setText(translate("Paste"));
			button6.setOnClickListener(function(viewarg) {
				start();
				functionNumber = 3;
			});
			layout.addView(button6);

			button19 = getStyledButton("menu");
			button19.setText(translate("Load"));
			button19.setOnClickListener(function(viewarg) {
				loadDialog(type);
			});
			layout.addView(button19);

			button18 = getStyledButton("menu");
			button18.setText(translate("Backup"));
			button18.setOnClickListener(function(viewarg) {
				saveDialog(type);
			});
			layout.addView(button18);

			text5 = getStyledText("group");
			text5.setText(translate("Management"));
			layout.addView(text5);

			button4 = getStyledButton("menu");
			button4.setText(translate("Restore"));
			button4.setOnClickListener(function(viewarg) {
				rule = false;
				stop();
				setsovle[1] = false;
				if (menuCanUpdate) updateMenu(type);
			});
			layout.addView(button4);

			button16 = getStyledButton("menu");
			button16.setText(translate("Config"));
			button16.setOnClickListener(function(viewarg) {
				removeMenu();
				createMenu(1);
			});
			layout.addView(button16);

			button17 = getStyledButton("menu");
			button17.setText(translate("Quit"));
			button17.setOnClickListener(function(viewarg) {
				rover = false;
				removeMenu();
			});
			layout.addView(button17);
		} else {
			text6 = getStyledText("group");
			text6.setText(translate("Operation"));
			layout.addView(text6);

			button14 = getStyledButton("menu");
			button14.setText(translate("Continue"));
			button14.setOnClickListener(function(viewarg) {
				removeMenu();
				createButton();
				sovleGoFunctions = true;
			});
			layout.addView(button14);

			button15 = getStyledButton("menu");
			button15.setText(translate("Interrupt"));
			button15.setOnClickListener(function(viewarg) {
				sovleGoFunctions = true;
				removeMenu();
				createButton();
				stop();
			});
			layout.addView(button15);

			text10 = getStyledText("group");
			text10.setText(translate("Management"));
			layout.addView(text10);

			button29 = getStyledButton("menu");
			button29.setText(translate("Config"));
			button29.setOnClickListener(function(viewarg) {
				removeMenu();
				createMenu(1);
			});
			layout.addView(button29);
		}
	} else if (type == 1) {
		text7 = getStyledText("group");
		text7.setText(translate("Management"));
		layout.addView(text7);

		goned0 = true;
		button20 = getStyledButton("menu");
		button20.setText(translate("Speed"));
		button20.setOnClickListener(function(viewarg) {
			if (goned0) layout0.setVisibility(Interface.Visibility.VISIBLE);
			else layout0.setVisibility(Interface.Visibility.GONE);
			goned0 = !goned0;
		});
		layout.addView(button20);

		layout0 = getStyledLayout("setting");
		layout0.setOrientation(Interface.Orientate.VERTICAL);
		layout0.setVisibility(Interface.Visibility.GONE);
		layout0.setGravity(Interface.Gravity.CENTER);
		layout.addView(layout0);

		let updateConstructionSpeed = function() {
			if (gran == 0) {
				text14.setText(translate("Step by step"));
			} else {
				text14.setText(translate("%s blocks/sec.", gran * 20));
			}
		};

		seek1 = getStyledSeek("transparent");
		seek1.setMax(25);
		seek1.setProgress(gran);
		seek1.setOnSeekBarChangeListener({
			onProgressChanged: function() {
				gran = seek1.getProgress();
				updateConstructionSpeed();
			}
		});
		layout0.addView(seek1);

		text14 = getStyledText();
		text14.setGravity(Interface.Gravity.CENTER);
		text14.setPadding(0, 25, 0, 0);
		updateConstructionSpeed();
		text14.setTextSize(10);
		layout0.addView(text14);

		goned1 = true;
		button21 = getStyledButton("menu");
		button21.setText(translate("Transparency"));
		button21.setOnClickListener(function(viewarg) {
			if (goned1) layout4.setVisibility(Interface.Visibility.VISIBLE);
			else layout4.setVisibility(Interface.Visibility.GONE);
			goned1 = !goned1;
		});
		layout.addView(button21);

		layout4 = getStyledLayout("setting");
		layout4.setOrientation(Interface.Orientate.VERTICAL);
		layout4.setVisibility(Interface.Visibility.GONE);
		layout4.setGravity(Interface.Gravity.CENTER);
		layout.addView(layout4);

		seek0 = getStyledSeek("transparent");
		seek0.setMax(9);
		seek0.setProgress(alpha * 10 - 1);
		seek0.setOnSeekBarChangeListener({
			onProgressChanged: function() {
				alpha = 0.1 + seek0.getProgress() / 10;
				CurrentMenuLayout.setAlpha(alpha);
			}
		});
		layout4.addView(seek0);

		goned2 = true;
		button30 = getStyledButton("menu");
		button30.setText(translate("Crossing"));
		button30.setOnClickListener(function(viewarg) {
			if (goned2) layout5.setVisibility(Interface.Visibility.VISIBLE);
			else layout5.setVisibility(Interface.Visibility.GONE);
			goned2 = !goned2;
		});
		layout.addView(button30);

		layout5 = getStyledLayout("setting");
		layout5.setOrientation(Interface.Orientate.VERTICAL);
		layout5.setVisibility(Interface.Visibility.GONE);
		layout5.setGravity(Interface.Gravity.CENTER);
		layout.addView(layout5);

		group0 = new android.widget.RadioGroup(getContext());
		group0.setOrientation(Interface.Orientate.VERTICAL);
		layout5.addView(group0);

		radio0 = getStyledRadio("setting");
		radio0.setText(translate("%s > %s", [translate("Length"), translate("Height")]));
		group0.addView(radio0);

		radio1 = getStyledRadio("setting");
		radio1.setText(translate("%s > %s", [translate("Width"), translate("Height")]));
		group0.addView(radio1);

		radio2 = getStyledRadio("setting");
		radio2.setText(translate("%s > %s", [translate("Width"), translate("Length")]));
		group0.addView(radio2);

		group0.check(radio0.getId() + build);
		group0.setOnCheckedChangeListener(function(group, item) {
			build = item - radio0.getId();
		});

		goned3 = true;
		button31 = getStyledButton("menu");
		button31.setText(translate("Adjustment"));
		button31.setOnClickListener(function(viewarg) {
			if (goned3) layout6.setVisibility(Interface.Visibility.VISIBLE);
			else layout6.setVisibility(Interface.Visibility.GONE);
			goned3 = !goned3;
		});
		layout.addView(button31);

		layout6 = getStyledLayout("setting");
		layout6.setOrientation(Interface.Orientate.VERTICAL);
		layout6.setVisibility(Interface.Visibility.GONE);
		layout6.setGravity(Interface.Gravity.CENTER);
		layout.addView(layout6);

		check0 = getStyledCheck("setting");
		check0.setText(translate("Static interface"));
		check0.setChecked(!menuCanUpdate);
		check0.setOnCheckedChangeListener(function(group, bool) {
			menuCanUpdate = !bool;
			if (!bool) updateMenu(type);
		});
		layout6.addView(check0);

		check1 = getStyledCheck("setting");
		check1.setText(translate("Locate operation"));
		check1.setChecked(coordsButtonShow);
		check1.setOnCheckedChangeListener(function(group, bool) {
			coordsButtonShow = bool;
			if (bool) updateMenu(type);
		});
		layout6.addView(check1);

		check2 = getStyledCheck("setting");
		check2.setText(translate("Insert air"));
		check2.setChecked(parseAir);
		check2.setOnCheckedChangeListener(function(group, bool) {
			parseAir = bool;
		});
		layout6.addView(check2);

		text9 = getStyledText("group");
		text9.setText(translate("Community"));
		layout.addView(text9);

		button22 = getStyledButton("menu");
		button22.setText(translate("About"));
		button22.setOnClickListener(function(viewarg) {
			showDialog();
		});
		layout.addView(button22);
	}

	debug = getStyledText("debug");
	debug.setText(translate("development version"));
	layout.addView(debug);

	if (menuCanUpdate) updateMenu(type);

	CurrentMenuWindow = new android.widget.PopupWindow(CurrentMenuLayout, Interface.Display.WIDTH * menuWidth, Interface.Display.MATCH);
	CurrentMenuWindow.showAtLocation(Interface.getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const updateMenu = function(type) {
	if (this.CurrentMenuLayout) {
		if (type == 0) {
			if (pos1[3] && !pos2[3] && !setsovle[1]) {
				button2.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button2.setVisibility(Interface.Visibility.GONE);
			}
			if (pos1[3] && pos2[3] && !setsovle[1]) {
				text2.setVisibility(Interface.Visibility.VISIBLE);
				button3.setVisibility(Interface.Visibility.VISIBLE);
				button7.setVisibility(Interface.Visibility.VISIBLE);
				button8.setVisibility(Interface.Visibility.VISIBLE);
				button5.setVisibility(Interface.Visibility.VISIBLE);
				button32.setVisibility(Interface.Visibility.VISIBLE);
				button2.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				text2.setVisibility(Interface.Visibility.GONE);
				button3.setVisibility(Interface.Visibility.GONE);
				button7.setVisibility(Interface.Visibility.GONE);
				button8.setVisibility(Interface.Visibility.GONE);
				button5.setVisibility(Interface.Visibility.GONE);
				button32.setVisibility(Interface.Visibility.GONE);
			}
			let count = getProjects().items.length;
			if ((pos1[3] && pos2[3]) || setsovle[1] || count > 0) {
				text4.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				text4.setVisibility(Interface.Visibility.GONE);
			}
			if (count > 0) {
				button19.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button19.setVisibility(Interface.Visibility.GONE);
			}
			if (setsovle[1]) {
				button6.setVisibility(Interface.Visibility.VISIBLE);
				button18.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button6.setVisibility(Interface.Visibility.GONE);
				button18.setVisibility(Interface.Visibility.GONE);
			}
			if (rule) {
				button1.setVisibility(Interface.Visibility.GONE);
				text8.setVisibility(Interface.Visibility.VISIBLE);
				button9.setVisibility(Interface.Visibility.GONE);
				button10.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button1.setVisibility(Interface.Visibility.VISIBLE);
				text8.setVisibility(Interface.Visibility.GONE);
				button9.setVisibility(Interface.Visibility.VISIBLE);
				button10.setVisibility(Interface.Visibility.GONE);
			}
			if (coordsButtonShow) {
				button13.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button13.setVisibility(Interface.Visibility.GONE);
			}
		} else if (type == 1) {
			if (functionNumber == 0) {
				button30.setVisibility(Interface.Visibility.VISIBLE);
			} else {
				button30.setVisibility(Interface.Visibility.GONE);
			}
		}
	}
};

const removeMenu = function() {
	if (this.CurrentMenuWindow) {
		CurrentMenuWindow.dismiss();
		CurrentMenuWindow = null;
	}
};