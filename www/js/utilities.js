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

	//menu
	$("span#label_my_pokemon").text("My Pokemon");
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

	//catch pokemon popup
	$("span#label_catch_pokemon").text("You caught a pokemon!");
	
	//details
	$("span#label_details_name").text("Name: ");
	$("span#label_details_height").text("Height: ");
	$("span#label_details_weight").text("Weight: ");
	$("span#label_details_types").text("Types: ");
	$("span#label_details_abilities").text("Abilities: ");

	//settings
	$("span#label_settings_page").text("Settings");
	$("span#label_settings_language").text("Language: ");
	$("span#label_save_settings").text("Save");

	//loading messages
	loadingMessage = "Loading..";
	loadingMoreMessage = "Loading more..";
	catchingPokemonMessage = "Catching pokemon";

	//status messages
	statusSelectTarget = "Select a target";
	statusCanCatch = "You can catch the pokemon";
	statusTooFar = "Too far away";
	
}

function setDutch() {

	//menu
	$("span#label_my_pokemon").text("Mijn Pokemon");
	$("span#label_hunt").text("Jagen");
	$("span#label_settings").text("Instellingen");

	//my pokemon
	$("span#label_my_pokemon_page").text("Mijn Pokemon");

	//hunt
	$("span#label_hunt_page").text("Pokemon jagen");
	$("span#label_new_locations").text("Nieuwe locaties");
	$("span#label_current_position").text("Huidige positie:");
	$("span#label_longitude").text("Lengtegraad: ");
	$("span#label_latitude").text("Breedtegraad: ");
	$("span#label_target").text("Doelwit:");
	$("span#label_status").text("Status:");
	$("span#label_catch_button").text("Vangen");
	$("span#label_compass_tooltip").text("Houdt het apparaat in portret modus om het compass te gebruiken");
	$("span#label_geo_hunt_status").text("Selecteer een doelwit");

	//catch pokemon popup
	$("span#label_catch_pokemon").text("Je hebt een pokemon gevangen!");
	
	//details
	$("span#label_details_name").text("Naam: ");
	$("span#label_details_height").text("Grootte: ");
	$("span#label_details_weight").text("Gewicht: ");
	$("span#label_details_types").text("Soorten: ");
	$("span#label_details_abilities").text("Vaardigheden: ");

	//settings
	$("span#label_settings_page").text("Instellingen");
	$("span#label_settings_language").text("Taal: ");
	$("span#label_save_settings").text("Opslaan");

	//loading messages
	loadingMessage = "Laden..";
	loadingMoreMessage = "Meer laden..";
	catchingPokemonMessage = "Pokemon vangen";

	//status messages
	statusSelectTarget = "Selecteer een doelwit";
	statusCanCatch = "Je kunt de pokemon vangen";
	statusTooFar = "Te ver weg";
}