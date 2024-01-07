(function(context) {
	try {
		Launch(context);
	} catch (e) {
		__mod__.RunMod(context);
	}
})({
	Level: ModAPI.requireGlobal("Level"),
	canTileBeReplaced: ModAPI.requireGlobal("canTileBeReplaced"),
	isOutdated: (function() {
		try {
			ConfigureMultiplayer({
				isClientOnly: true
			});
			return false;
		} catch (e) {
			Logger.Log("Setting: Environment has been deprecated, it may cause unexpected behavior!", "WARNING");
		}
		return true;
	})()
});
