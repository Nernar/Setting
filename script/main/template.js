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

const getStyledButton = function(style) {
	let view = new android.widget.Button(getContext());
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	switch (style) {
		case "menu":
			view.setBackgroundColor(Interface.Color.parse("#AA444444"));
			view.setPadding(30, 0, 30, 0);
			view.setTextSize(12);
			break;
		case "transparent":
			view.setBackgroundDrawable(null);
			view.setPadding(30, 0, 30, 0);
			break;
	}
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
	view.setTextColor(Interface.Color.WHITE);
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
	view.setTextColor(Interface.Color.WHITE);
	view.setTypeface(typeface);
	switch (style) {
		case "setting":
			view.setTextSize(10);
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