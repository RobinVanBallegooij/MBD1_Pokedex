document.addEventListener("deviceready", setupGeo, false);

function setupGeo() {
	console.log("SETUP GEO");

	//modify Math.round function to take decimals.
	Math.round = (function() {
  		var originalRound = Math.round;
  		return function(number, precision) {
    		precision = Math.abs(parseInt(precision)) || 0;
    		var multiplier = Math.pow(10, precision);
    		return (originalRound(number * multiplier) / multiplier);
  		};
	})();

	var currentPosition = navigator.geolocation.getCurrentPosition(updateLocationData);
	var watchId = navigator.geolocation.watchPosition(updateLocationData);

	activateCompass();

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
				$("#route").prop("disabled", false);
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

	//disable route button initially.
	$("#route").prop("disabled", true);

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

	//route
	$("#route").on("click", function(event) {
		event.preventDefault();

		if (selectedLocation !== null) {
			var positionString = selectedLocation.latitude + "," + selectedLocation.longitude;	
			var destination = "Target";
	
			window.location.href = "http://maps.apple.com?daddr=" + positionString + "(" + destination + ")";
		}	
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
var DECIMALS = 7;



function generateRandomGeoLocations() {
	var geoLocations = new Array();

	var avansPosition = {longitude:5.2866380, latitude:51.6885180};
	var testlocation = {longitude:5.4359651, latitude:51.8060321};
	var testlocation2 = {longitude:5.4338097, latitude:51.8048015};
	var testlocation3 = {longitude:5.4340886, latitude:51.8075944};
	var testlocation4 = {longitude:5.4385840, latitude:51.8072097};
	var testlocation5 = {longitude:5.4397642, latitude:51.8047551};

	geoLocations.push(avansPosition);
	geoLocations.push(testlocation);
	geoLocations.push(testlocation2);
	geoLocations.push(testlocation3);
	geoLocations.push(testlocation4);
	geoLocations.push(testlocation5);

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
	
	$("#geo_longitude").html("longitude: " + Math.round(longitude, DECIMALS));
	$("#geo_latitude").html("latitude: " + Math.round(latitude, DECIMALS));

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
		geoLocationContent += '<option value="standard" class="geoLocationItem" id="' + index + '">' + Math.round(location.longitude, DECIMALS) + ', ' + Math.round(location.latitude, DECIMALS) + '</option>';
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
			loadOwnedPokemon();
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
			$("#route").prop("disabled", true);
			checkVicinityStatus();
			loadGeoLocations();
		}

		$("select").selectmenu("refresh", true);
	}
}

//replaces geo locations.
function reloadGeoLocations() {
	selectedLocation = null;
	$("#route").prop("disabled", true);
	clearGeoLocations();
	loadGeoLocations();
	checkVicinityStatus();
	$("select").selectmenu("refresh", true);
}

// COMPASS

function activateCompass() {
	navigator.compass.getCurrentHeading(updateCompass);
	navigator.compass.watchHeading(updateCompass);
}

function updateCompass(heading) {

	if (currentLocation !== null && selectedLocation !== null) {
		var bearing = calculateBearing(currentLocation.coords.latitude, currentLocation.coords.longitude, selectedLocation.latitude, selectedLocation.longitude);

		var magneticHeading = heading.magneticHeading;
		
		//set data
		$("#compass_bearing").text(bearing);
		$("#compass_heading").text(magneticHeading);
	
		//rotate image.
		if (bearing !== null) {
			var resultAngle = calculateRelativeAngle(bearing, magneticHeading);
			if (resultAngle !== null) {
				$("#compass").rotate(resultAngle);
			}	
		}	
	} else {
		$("#compass").rotate(0);
	}
	
}

function calculateRelativeAngle(targetBearing, compassHeading) {
	var delta =  targetBearing - compassHeading;
	var relativeAngle = null;

	//determine relative angle in degrees.
	//positive delta = rotate right.
	//negative delta = rotate left.
	if (delta < 0) {
		relativeAngle = 360 + delta;
	} else {
		relativeAngle = delta;
	}

	return relativeAngle;
}

function calculateBearing(lat1,lng1,lat2,lng2) {
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = toDegree(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
}

function toDegree(rad) {
    return rad * 180 / Math.PI;
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