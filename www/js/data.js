//helper functions to store arrays in localstorage
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

// OWNED POKEMON

function storePokemonWithId(id) {

	console.log("store pokemon with id: " + id);
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

	console.log("get owned pokemon");

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

function clearLocalStorage() {
	console.log("clear local storage");
	window.localStorage.clear();
}

function clearOwnedPokemon() {
	console.log("clear owned pokemon");
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