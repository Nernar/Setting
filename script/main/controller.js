const createMenu = function(type) {
	CurrentMenuLayout = getStyledLayout("menu");
	CurrentMenuLayout.setOrientation($.LinearLayout.VERTICAL);
	CurrentMenuLayout.setAlpha(windowTransparent);
	if (isHorizon) {
		CurrentMenuLayout.setSystemUiVisibility(5894);
		CurrentMenuLayout.setFitsSystemWindows(true);
	}

	let layout = getStyledLayout();
	layout.setGravity($.Gravity.RIGHT);
	CurrentMenuLayout.addView(layout);

	title = getStyledText("title");
	title.setGravity($.Gravity.CENTER);
	title.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(getDisplayWidth() * windowLength - getDisplayWidth() / 13 - 120, $.ViewGroup.LayoutParams.MATCH_PARENT));
	title.setText(translate("setting"));
	layout.addView(title);

	button23 = getStyledButton("transparent");
	button23.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(getDisplayWidth() / 13, getDisplayWidth() / 13));
	button23.setText(translate(type == 0 ? "x" : "<"));
	button23.setTextSize(28);
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
	layout.setOrientation($.LinearLayout.VERTICAL);
	scroll.addView(layout);

	if (type == 0) {
		if (sovleGoFunctions) {
			text1 = getStyledText("group");
			text1.setText(translate("Location"));
			layout.addView(text1);

			button1 = getStyledButton("menu");
			button1.setText(translate("Point %s", 1));
			button1.setOnClickListener(function(viewarg) {
				let position = getPosition();
				pos1 = [position.x, position.y, position.z, true];
				setsovle = [false, false];
				updata();
				if (windowDynamic) updateMenu(type);
				showHint(translate("First point is set"));
			});
			layout.addView(button1);

			button2 = getStyledButton("menu");
			button2.setText(translate("Point %s", 2));
			button2.setOnClickListener(function(viewarg) {
				let position = getPosition();
				pos2 = [position.x, position.y, position.z, true];
				setsovle = [false, false];
				updata();
				rule = false;
				if (windowDynamic) updateMenu(type);
				showHint(translate("Second point is set"));
			});
			layout.addView(button2);

			button9 = getStyledButton("menu");
			button9.setText(translate("Measure"));
			button9.setOnClickListener(function(viewarg) {
				let position = getPosition();
				pos1 = [position.x, position.y, position.z, true];
				if (pos2[3] == null) pos2 = [position.x, position.y, position.z, false];
				rule = true;
				setsovle[1] = false;
				tick = 0;
				if (windowDynamic) updateMenu(type);
			});
			layout.addView(button9);

			text8 = getStyledText("group");
			text8.setText(translate("Measuring"));
			layout.addView(text8);

			button10 = getStyledButton("menu");
			button10.setText(translate("Conclude"));
			button10.setOnClickListener(function(viewarg) {
				rule = false;
				pos1[3] = pos2[3];
				if (windowDynamic) updateMenu(type);
			});
			layout.addView(button10);

			text2 = getStyledText("group");
			text2.setText(translate("Operations"));
			layout.addView(text2);

			button3 = getStyledButton("menu");
			button3.setText(translate("Fill"));
			button3.setOnClickListener(function(viewarg) {
				removeMenu();
				start(1);
				createButton();
			});
			layout.addView(button3);

			button7 = getStyledButton("menu");
			button7.setText(translate("Pour"));
			button7.setOnClickListener(function(viewarg) {
				removeMenu();
				start(4);
				createButton();
			});
			layout.addView(button7);

			button13 = getStyledButton("menu");
			button13.setText(translate("Cover"));
			button13.setOnClickListener(function(viewarg) {
				removeMenu();
				start(7);
				createButton();
			});
			layout.addView(button13);

			text3 = getStyledText("group");
			text3.setText(translate("Scanning"));
			layout.addView(text3);

			button11 = getStyledButton("menu");
			button11.setText(translate("Block to replace"));
			button11.setOnClickListener(function(viewarg) {
				let carried = getPlayerBlockInHand();
				if (!carried.holdingItem) {
					id = carried.id;
					data = carried.data;
					replace = true;
					if (windowDynamic) updateMenu(type);
					showHint(translate("Replacement block is selected"));
				}
			});
			layout.addView(button11);

			button8 = getStyledButton("menu");
			button8.setText(translate("Replace"));
			button8.setOnClickListener(function(viewarg) {
				if (replace) {
					removeMenu();
					start(5);
					createButton();
				} else {
					showHint(translate("Select block to replace"));
				}
			});
			layout.addView(button8);

			text4 = getStyledText("group");
			text4.setText(translate("Clipboard"));
			layout.addView(text4);

			button5 = getStyledButton("menu");
			button5.setText(translate("Copy"));
			button5.setOnClickListener(function(viewarg) {
				removeMenu();
				start(2);
				createButton();
			});
			layout.addView(button5);

			button32 = getStyledButton("menu");
			button32.setText(translate("Cut out"));
			button32.setOnClickListener(function(viewarg) {
				removeMenu();
				start(6);
				createButton();
			});
			layout.addView(button32);

			button6 = getStyledButton("menu");
			button6.setText(translate("Paste"));
			button6.setOnClickListener(function(viewarg) {
				removeMenu();
				start(3);
				createButton();
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
				rule = replace = false;
				if (setsovle[0] == false) {
					pos1[3] = true;
					pos2[3] = true;
				} else {
					setsovle[1] = true;
				}
				if (windowDynamic) {
					updateButton();
					updateMenu(type);
				}
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
				removeMenu();
				stop();
				sovleGoFunctions = true;
				createButton();
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
			if (goned0) layout0.setVisibility($.View.VISIBLE);
			else layout0.setVisibility($.View.GONE);
			goned0 = !goned0;
		});
		layout.addView(button20);

		layout0 = getStyledLayout("setting");
		layout0.setOrientation($.LinearLayout.VERTICAL);
		layout0.setVisibility($.View.GONE);
		layout0.setGravity($.Gravity.CENTER);
		layout.addView(layout0);

		let updateConstructionSpeed = function() {
			if (blocksPerTick == 0) {
				text14.setText(translate("Instantly"));
			} else {
				text14.setText(translate("%s blocks/sec.", blocksPerTick * 20));
			}
		};

		seek1 = getStyledSeek("transparent");
		seek1.setMax(50);
		seek1.setProgress(blocksPerTick);
		seek1.setOnSeekBarChangeListener({
			onProgressChanged: function(bar, progress) {
				blocksPerTick = progress;
				updateConstructionSpeed();
			},
			onStopTrackingTouch: function(bar) {
				__config__.set("blocks_per_tick", blocksPerTick);
				__config__.save();
			}
		});
		layout0.addView(seek1);

		text14 = getStyledText();
		text14.setGravity($.Gravity.CENTER);
		text14.setPadding(0, 25, 0, 0);
		updateConstructionSpeed();
		text14.setTextSize(10);
		layout0.addView(text14);

		goned1 = true;
		button21 = getStyledButton("menu");
		button21.setText(translate("Transparency"));
		button21.setOnClickListener(function(viewarg) {
			if (goned1) layout4.setVisibility($.View.VISIBLE);
			else layout4.setVisibility($.View.GONE);
			goned1 = !goned1;
		});
		layout.addView(button21);

		layout4 = getStyledLayout("setting");
		layout4.setOrientation($.LinearLayout.VERTICAL);
		layout4.setVisibility($.View.GONE);
		layout4.setGravity($.Gravity.CENTER);
		layout.addView(layout4);

		seek0 = getStyledSeek("transparent");
		seek0.setMax(9);
		seek0.setProgress(windowTransparent * 10 - 1);
		seek0.setOnSeekBarChangeListener({
			onProgressChanged: function(bar, progress) {
				windowTransparent = 0.1 + progress / 10;
				CurrentMenuLayout.setAlpha(windowTransparent);
			},
			onStopTrackingTouch: function(bar) {
				__config__.set("window_transparent", windowTransparent);
				__config__.save();
			}
		});
		layout4.addView(seek0);

		goned4 = true;
		button12 = getStyledButton("menu");
		button12.setText(translate("Stretch"));
		button12.setOnClickListener(function(viewarg) {
			if (goned4) layout3.setVisibility($.View.VISIBLE);
			else layout3.setVisibility($.View.GONE);
			goned4 = !goned4;
		});
		layout.addView(button12);

		layout3 = getStyledLayout("setting");
		layout3.setOrientation($.LinearLayout.VERTICAL);
		layout3.setVisibility($.View.GONE);
		layout3.setGravity($.Gravity.CENTER);
		layout.addView(layout3);

		seek2 = getStyledSeek("transparent");
		seek2.setMax(85);
		seek2.setProgress(windowLength * 100 - 15);
		seek2.setOnSeekBarChangeListener({
			onProgressChanged: function(bar, progress) {
				windowLength = 0.15 + progress / 100;
			},
			onStopTrackingTouch: function(bar) {
				__config__.set("window_length", windowLength);
				__config__.save();
				CurrentMenuWindow.update(getDisplayWidth() * windowLength, $.ViewGroup.LayoutParams.MATCH_PARENT);
			}
		});
		layout3.addView(seek2);

		goned2 = true;
		button30 = getStyledButton("menu");
		button30.setText(translate("Direction"));
		button30.setOnClickListener(function(viewarg) {
			if (goned2) layout5.setVisibility($.View.VISIBLE);
			else layout5.setVisibility($.View.GONE);
			goned2 = !goned2;
		});
		layout.addView(button30);

		layout5 = getStyledLayout("setting");
		layout5.setOrientation($.LinearLayout.VERTICAL);
		layout5.setVisibility($.View.GONE);
		layout5.setGravity($.Gravity.CENTER);
		layout.addView(layout5);

		group0 = new android.widget.RadioGroup(getContext());
		group0.setOrientation($.LinearLayout.VERTICAL);
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

		group0.check(radio0.getId() + operationDirection);
		group0.setOnCheckedChangeListener(function(group, item) {
			operationDirection = item - radio0.getId();
			__config__.set("operation_direction", operationDirection);
			__config__.save();
		});

		goned3 = true;
		button31 = getStyledButton("menu");
		button31.setText(translate("Miscellaneous"));
		button31.setOnClickListener(function(viewarg) {
			if (goned3) layout6.setVisibility($.View.VISIBLE);
			else layout6.setVisibility($.View.GONE);
			goned3 = !goned3;
		});
		layout.addView(button31);

		layout6 = getStyledLayout("setting");
		layout6.setOrientation($.LinearLayout.VERTICAL);
		layout6.setVisibility($.View.GONE);
		layout6.setGravity($.Gravity.CENTER);
		layout.addView(layout6);

		check2 = getStyledCheck("setting");
		check2.setText(translate("Cover opaque blocks"));
		check2.setChecked(coverOpaqueBlocks);
		check2.setOnCheckedChangeListener(function(group, bool) {
			coverOpaqueBlocks = bool;
			__config__.set("cover_opaque_blocks", coverOpaqueBlocks);
			__config__.save();
		});
		layout6.addView(check2);

		check4 = getStyledCheck("setting");
		check4.setText(translate("Clear paste zone"));
		check4.setChecked(placeAirBeforePaste);
		check4.setOnCheckedChangeListener(function(group, bool) {
			placeAirBeforePaste = bool;
			__config__.set("place_air_before_paste", placeAirBeforePaste);
			__config__.save();
		});
		layout6.addView(check4);

		check3 = getStyledCheck("setting");
		check3.setText(translate("Beautify JSON"));
		check3.setChecked(beautifyJson);
		check3.setOnCheckedChangeListener(function(group, bool) {
			beautifyJson = bool;
			__config__.set("beautify_json", beautifyJson);
			__config__.save();
		});
		layout6.addView(check3);

		check0 = getStyledCheck("setting");
		check0.setText(translate("Do not update menu"));
		check0.setChecked(!windowDynamic);
		check0.setOnCheckedChangeListener(function(group, bool) {
			windowDynamic = !bool;
			__config__.set("window_dynamic", windowDynamic);
			__config__.save();
			if (!bool) updateMenu(type);
		});
		layout6.addView(check0);

		check1 = getStyledCheck("setting");
		check1.setText(translate("Overlay for messages"));
		check1.setChecked(hintsViaOverlay);
		check1.setOnCheckedChangeListener(function(group, bool) {
			hintsViaOverlay = bool;
			__config__.set("hints_via_overlay", hintsViaOverlay);
			__config__.save();
		});
		layout6.addView(check1);

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
	debug.setText(translate("connected to server"));
	debug.setVisibility($.View.GONE);
	debug.setOnClickListener(function(viewarg) {
		doPrivileged = !doPrivileged;
		if (windowDynamic) updateMenu(type);
	});
	layout.addView(debug);

	if (windowDynamic) updateMenu(type);

	CurrentMenuWindow = new android.widget.PopupWindow(CurrentMenuLayout, getDisplayWidth() * windowLength, $.ViewGroup.LayoutParams.MATCH_PARENT);
	CurrentMenuWindow.showAtLocation(getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
};

const updateMenu = function(type) {
	if (this.CurrentMenuLayout) {
		if (type == 0) {
			if (pos1[3] && !pos2[3] && !setsovle[1]) {
				button2.setVisibility($.View.VISIBLE);
			} else {
				button2.setVisibility($.View.GONE);
			}
			if (pos1[3] && pos2[3] && !setsovle[1]) {
				text2.setVisibility($.View.VISIBLE);
				button3.setVisibility($.View.VISIBLE);
				button7.setVisibility($.View.VISIBLE);
				if (replace) {
					button8.setVisibility($.View.VISIBLE);
				} else {
					button8.setVisibility($.View.GONE);
				}
				button5.setVisibility($.View.VISIBLE);
				button32.setVisibility($.View.VISIBLE);
				button2.setVisibility($.View.VISIBLE);
				button13.setVisibility($.View.VISIBLE);
			} else {
				text2.setVisibility($.View.GONE);
				button3.setVisibility($.View.GONE);
				button7.setVisibility($.View.GONE);
				button8.setVisibility($.View.GONE);
				button5.setVisibility($.View.GONE);
				button32.setVisibility($.View.GONE);
				button13.setVisibility($.View.GONE);
			}
			let projects = hasAnyProject();
			if ((pos1[3] && pos2[3]) || setsovle[1] || projects) {
				text4.setVisibility($.View.VISIBLE);
			} else {
				text4.setVisibility($.View.GONE);
			}
			if (projects) {
				button19.setVisibility($.View.VISIBLE);
			} else {
				button19.setVisibility($.View.GONE);
			}
			if (setsovle[1]) {
				button6.setVisibility($.View.VISIBLE);
				button18.setVisibility($.View.VISIBLE);
			} else {
				button6.setVisibility($.View.GONE);
				button18.setVisibility($.View.GONE);
			}
			if (rule) {
				button1.setVisibility($.View.GONE);
				text8.setVisibility($.View.VISIBLE);
				button9.setVisibility($.View.GONE);
				button10.setVisibility($.View.VISIBLE);
			} else {
				button1.setVisibility($.View.VISIBLE);
				text8.setVisibility($.View.GONE);
				button9.setVisibility($.View.VISIBLE);
				button10.setVisibility($.View.GONE);
			}
		} else if (type == 1) {
			if (functionNumber == 0) {
				button30.setVisibility($.View.VISIBLE);
			} else {
				button30.setVisibility($.View.GONE);
			}
		}
		debug.setVisibility(doPrivileged ? $.View.VISIBLE : $.View.GONE);
	}
};

const removeMenu = function() {
	if (this.CurrentMenuWindow) {
		CurrentMenuWindow.dismiss();
		CurrentMenuWindow = null;
	}
};
