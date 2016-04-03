document.addEventListener("deviceready", setupGeo, false);

function setupGeo() {
	console.log("SETUP GEO");

	var currentPosition = navigator.geolocation.getCurrentPosition(updateLocationData);
	var watchId = navigator.geolocation.watchPosition(updateLocationData);

	loadGeoLocations();

	//select hunt target
	$('.geo-location-select').change(function() {

		console.log("changed");

		//get selected geo location
		var index = $('option:selected', this).attr('id');
		
		var geoLocations = getStoredGeoLocations();


		if (geoLocations !== null) {
			var location = geoLocations[index];
			console.log(location);

			if (typeof location !== 'undefined') {
				selectedLocation = location;
				console.log("Changed target");
				checkVicinityStatus();
			}
		}
	});

	//catch button
	$("#catch").on("click", function() {
		catchPokemon();
	});

	//disable catch button initially.
	$("#catch").prop("disabled", true);

	//popup after close event.
	$("#catchPopup").bind({
		popupafterclose: function(event, ui) {
			clearCaughtPokemon();
		}
	});

	//reload geo locations
	$("#new_geo_locations").on("click", function() {
		console.log("load new locations");
		reloadGeoLocations();
	});

}

//variables
var NUMBER_OF_LOCATIONS = 10;
var currentLocation = null;
var selectedLocation = null;

var margin_longitude = 0.0015;
var margin_latitude = 0.00065;

//min and max values for Den Bosch
var MIN_LONGITUDE = 5.2547515;
var MAX_LONGITUDE = 5.3489936;
var MIN_LATITUDE = 51.6824922;
var MAX_LATITUDE = 51.7204729;



function generateRandomGeoLocations() {
	var geoLocations = new Array();

	var avansPosition = {longitude:5.2866380, latitude:51.6885180};
	var testlocation = {longitude:5.4359651, latitude:51.8060321};
	geoLocations.push(avansPosition);
	geoLocations.push(testlocation);

	for (i = 0; i < NUMBER_OF_LOCATIONS; i++) {
		var randomLongitude = (Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE);
		var randomLatitude = (Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE);

		var position = {longitude:randomLongitude, latitude:randomLatitude};
		geoLocations.push(position);
	}

	return geoLocations;

}

function updateLocationData(position) {

	currentLocation = position;

	var longitude = position.coords.longitude;
	var latitude = position.coords.latitude;
	
	$("#geo_longitude").html("longitude: " + longitude);
	$("#geo_latitude").html("latitude: " + latitude);

	checkVicinityStatus();
		
}

function loadGeoLocations() {

	//check if geo locations are stored. If not, generate and store them.
	var storedGeoLocations = getStoredGeoLocations();

	//generate locations if not found in local storage.
	if (storedGeoLocations === null) {
		var geoLocations = generateRandomGeoLocations();
		storeGeoLocations(geoLocations);
		storedGeoLocations = getStoredGeoLocations();
	}

	var geoLocationContent = '';

	$.each(storedGeoLocations, function(index, value) {
		var location = storedGeoLocations[index];
		geoLocationContent += '<option value="standard" class="geoLocationItem" id="' + index + '">' + location.longitude + ', ' + location.latitude + '</option>';
	});

	$(".geo-location-select").html(geoLocationContent);
	console.log("geolocations loaded");
}

function checkVicinityStatus() {
	//check if target location is selected
	if (selectedLocation !== null) {

		if (currentLocation !== null) {
			var currentLongitude = currentLocation.coords.longitude;
			var currentLatitude = currentLocation.coords.latitude;

			var targetLongitude = selectedLocation.longitude;
			var targetLatitude = selectedLocation.latitude;

			//check if user is close and set status accordingly.
			//user is within margin and can catch the pokemon.
			if ((Math.abs(currentLongitude - targetLongitude) < margin_longitude) && (Math.abs(currentLatitude - targetLatitude) < margin_latitude)) {
				$("#geo_hunt_status").removeClass().addClass('margin-bottom text-lightgreen');
				$("#geo_hunt_status").text("You can catch the pokemon");
				//enable catch button.
				$("#catch").prop("disabled", false);
				return true;
			} else {
				$("#geo_hunt_status").removeClass().addClass('margin-bottom text-gray');
				$("#geo_hunt_status").text("Too far away");
			}

		}	
	} else {
		$("#geo_hunt_status").removeClass().addClass('margin-bottom');
		$("#geo_hunt_status").text("Select a target");
	}
	//disable catch button.
	$("#catch").prop("disabled", true);
	return false;
}

function catchPokemon() {

	if (checkVicinityStatus()) {

		showLoader("Catching pokemon");

		var randomPokemonId = Math.floor(Math.random() * TOTAL_POKEMON_COUNT + 1);

		var url = "http://pokeapi.co/api/v2/pokemon/" + randomPokemonId;
		var imageUrl = "http://pokeapi.co/media/sprites/pokemon/" + randomPokemonId + ".png";
	
		//fetch pokemon data and show in popup.
		$.getJSON(url, function(data) {
			var name = data.name;
	
			$("#catch_image").append('<img src="' + imageUrl + '" alt="Pokemon" class="pokemon-image center-img"></img>');
			$("#catch_name").text(name);
			
			hideLoader();

			//show popup.
			$("#catchPopup").popup("open");

		});
	
		//check if user owns pokemon. If not, add it.
		if (!ownsPokemonWithId(randomPokemonId)) {
			storePokemonWithId(randomPokemonId);
		}

		removeTargetLocation();
	}
}

//clear caught pokemon popup.
function clearCaughtPokemon() {
	$("#catch_image").empty();
	$("#catch_name").empty();
}

function removeTargetLocation() {

	if (selectedLocation !== null) {
		var selectedTarget = $(".geo-location-select").find(":selected").attr("id");

		$(".geo-location-select option[id='" + selectedTarget + "']").remove();
		
	
		if (selectedLocation !== null) {
			removeGeoLocation(selectedLocation);
			selectedLocation = null;
			checkVicinityStatus();
			loadGeoLocations();
		}

		$("select").selectmenu("refresh", true);
	}
}

//replaces geo locations.
function reloadGeoLocations() {
	selectedLocation = null;
	clearGeoLocations();
	loadGeoLocations();
	checkVicinityStatus();
	$("select").selectmenu("refresh", true);
}

/* Notes


									51.6896620,5.2852862

51.6890235,5.2835052				51.6888639,5.2855437				51.6889038,5.2865522

									51.6883052,5.2851360

//var margin_long = 0.0010085;
//var margin_long = 0.0020385;

//var margin_lat = 0.00079801;
//var margin_lat = 0.0005587;

test location:

var testlocation = {longitude:5.4359651, latitude:51.8060321};

*/