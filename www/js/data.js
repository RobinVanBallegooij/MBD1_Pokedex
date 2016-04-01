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

$("#button_random_geo_location").on('click', generateRandomGeoLocations);

//min and max values for Den Bosch
var MIN_LONGITUDE = 5.2547515;
var MAX_LONGITUDE = 5.3489936;
var MIN_LATITUDE = 51.6824922;
var MAX_LATITUDE = 51.7204729;
var NUMBER_OF_LOCATIONS = 10;

function generateRandomGeoLocations() {
	var geoLocations = new Array();

	var avansPosition = {longitude:5.2866380, latitude:51.6885180};

	for (i = 0; i < NUMBER_OF_LOCATIONS; i++) {
		var randomLongitude = (Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE);
		var randomLatitude = (Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE);

		var position = {longitude:randomLongitude, latitude:randomLatitude};
		console.log(position);
	}

}

function storeGeoLocations() {
	
}