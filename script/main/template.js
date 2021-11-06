const getStyledLayout = function(style) {
	let view = new android.widget.LinearLayout(getContext());
	switch (style) {
		case "menu":
			view.setBackgroundColor(Interface.Color.parse("#AA484848"));
			break;
		case "popup":
			view.setBackgroundColor(Interface.Color.parse("#AA484848"));
			view.setPadding(20, 20, 20, 20);
			break;
		case "setting":
			view.setBackgroundColor(Interface.Color.parse("#AA464646"));
			view.setPadding(10, 10, 10, 10);
			break;
	}
	return view;
};

const getCompoundStateListDrawable = function() {
	let compound = new android.graphics.drawable.StateListDrawable();
	compound.addState([android.R.attr.state_pressed],
		new android.graphics.drawable.ColorDrawable
			(Interface.Color.parse("#44444444")));
	compound.addState([android.R.attr.state_focused],
		new android.graphics.drawable.ColorDrawable
			(Interface.Color.parse("#44484848")));
	compound.addState([android.R.attr.state_checked],
		new android.graphics.drawable.ColorDrawable
			(Interface.Color.parse("#4444AA44")));
	return compound;
};

const getStyledButton = function(style) {
	let view = new android.widget.Button(getContext());
	view.setTextColor(Interface.Color.WHITE);
	let compound = getCompoundStateListDrawable();
	view.setTypeface(typeface);
	switch (style) {
		case "menu":
			compound.addState([], new android.graphics.drawable.ColorDrawable
				(Interface.Color.parse("#AA444444")));
			view.setPadding(30, 0, 30, 0);
			view.setTextSize(12);
			break;
		case "transparent":
			view.setPadding(30, 0, 30, 0);
			view.setAllCaps(false);
			break;
	}
	view.setBackgroundDrawable(compound);
	return view;
};

const getStyledText = function(style) {
	let view = new android.widget.TextView(getContext());
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	switch (style) {
		case "title":
			view.setTextSize(20);
			break;
		case "subtitle":
			view.setGravity(Interface.Gravity.CENTER);
			view.setPadding(0, 0, 0, 10);
			view.setTextSize(18);
			break;
		case "group":
			view.setTextColor(Interface.Color.LTGRAY);
			view.setPadding(10, 10, 10, 10);
			view.setTextSize(10);
			break;
		case "debug":
			view.setTextColor(Interface.Color.LTGRAY);
			view.setGravity(Interface.Gravity.CENTER);
			view.setPadding(5, 15, 5, 5);
			view.setTextSize(8);
			break;
	}
	return view;
};

const getStyledRadio = function(style) {
	let view = new android.widget.RadioButton(getContext());
	view.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.WRAP));
	view.setBackgroundDrawable(getCompoundStateListDrawable());
	view.setButtonDrawable(null);
	view.setTextColor(Interface.Color.WHITE);
	view.setPadding(20, 0, 20, 0);
	view.setTypeface(typeface);
	switch (style) {
		case "setting":
			view.setTextSize(10);
			break;
	}
	return view;
};

const getStyledCheck = function(style) {
	let view = new android.widget.CheckBox(getContext());
	view.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.WRAP));
	view.setBackgroundDrawable(getCompoundStateListDrawable());
	view.setButtonDrawable(null);
	view.setTextColor(Interface.Color.WHITE);
	view.setPadding(20, 0, 20, 0);
	view.setTypeface(typeface);
	switch (style) {
		case "setting":
			view.setTextSize(10);
			break;
	}
	return view;
};

const setCompoundProgressDrawable = function(prototype) {
	let drawable = new android.graphics.drawable.ColorDrawable
		(Interface.Color.parse("#FF44AA44"));
	prototype.setDrawableByLayerId(android.R.id.progress, new android.graphics.drawable.ClipDrawable
		(drawable, Interface.Gravity.LEFT, android.graphics.drawable.ClipDrawable.HORIZONTAL));
};

const getStyledSeek = function(style) {
	let view = new android.widget.SeekBar(getContext());
	view.setLayoutParams(new android.widget.RelativeLayout.LayoutParams
		(Interface.Display.MATCH, Interface.Display.WRAP));
	setCompoundProgressDrawable(view.getProgressDrawable());
	switch (style) {
		case "transparent":
			view.setThumb(null);
			break;
	}
	return view;
};

const showHint = function(hint) {
	text0 = getStyledText();
	text0.setTextSize(Interface.getFontSize(20));
	text0.setTextColor(Interface.Color.WHITE);
	text0.setText(hint);

	let toast = new android.widget.Toast(getContext());
	toast.setView(text0);
	toast.show();
};