//helper functions to store arrays in localstorage
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

// OWNED POKEMON

function storePokemonWithId(id) {

	//get array of currently stored pokemon
	var ownedPokemon = window.localStorage.getArray("ownedPokemon");

	if (ownedPokemon !== null) {
		//add pokemon to array
		ownedPokemon.push(id);

		//store array
		window.localStorage.setArray("ownedPokemon", ownedPokemon);
	} else {
		ownedPokemon = new Array();
		ownedPokemon.push(id);

		window.localStorage.setArray("ownedPokemon", ownedPokemon);
	}
	
}

function getOwnedPokemon() {

	var ownedPokemon = window.localStorage.getArray("ownedPokemon");

	return ownedPokemon;
}

function ownsPokemonWithId(id) {
	var ownedPokemon = window.localStorage.getArray("ownedPokemon");

	if (ownedPokemon !== null) {
		var index = ownedPokemon.indexOf(id);
		if (index !== -1) {
			return true;
		} else {
			return false;
		}
	}

	return false;
}

function clearOwnedPokemon() {
	window.localStorage.removeItem("ownedPokemon");
}

function addInitialPokemon() {
	clearOwnedPokemon();
	storePokemonWithId(1);
	storePokemonWithId(4);
	storePokemonWithId(7);
}

// GEO HUNT

function storeGeoLocations(geoLocations) {

	window.localStorage.setArray("geoLocations", geoLocations);
}

function getStoredGeoLocations() {
	var geoLocations = window.localStorage.getArray("geoLocations");

	return geoLocations;
}

function removeGeoLocation(location) {
	geoLocations = getStoredGeoLocations();

	//remove location.
	if (geoLocations !== null) {
		var filteredGeoLocations = geoLocations.filter(function(element) {
			return ((element.longitude !== location.longitude) && (element.latitude !== location.latitude));
		});

		//store filtered geo location list.
		storeGeoLocations(filteredGeoLocations);
	}

}

function clearGeoLocations() {
	window.localStorage.removeItem("geoLocations");
}

// SETTINGS

function saveLanguage(language) {
	window.localStorage.setItem("language", language);
}

function getLanguage() {
	var language = window.localStorage.getItem("language");
	return language;
}