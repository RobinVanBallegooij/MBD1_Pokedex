function showLoader(text) {
	$.mobile.loading("show", {
	    text: text,
	    textVisible: true,
	    theme: "a"
	});
}

function hideLoader() {
	$.mobile.loading("hide");
}

function setEnglish() {

	console.log("SET ENGLISH");
	//menu
	$("span#label_my_pokemon").text("My Pokémon");
	$("span#label_hunt").text("Hunt");
	$("span#label_settings").text("Settings");

	//my pokemon
	$("span#label_my_pokemon_page").text("My Pokemon");

	//hunt
	$("span#label_hunt_page").text("Hunt pokemon");
	$("span#label_new_locations").text("New locations");
	$("span#label_current_position").text("Current position:");
	$("span#label_longitude").text("Longitude: ");
	$("span#label_latitude").text("Latitude: ");
	$("span#label_target").text("Target:");
	$("span#label_status").text("Status:");
	$("span#label_catch_button").text("Catch");
	$("span#label_compass_tooltip").text("To use the compass, keep your device in portrait mode");
	$("span#label_geo_hunt_status").text("Select a target");
	$("").text("");
	$("").text("");

}

function setDutch() {

}