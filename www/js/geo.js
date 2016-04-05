document.addEventListener("deviceready", setupGeo, false);

function setupGeo() {

	//modify Math.round function to take decimals.
	Math.round = (function() {
  		var originalRound = Math.round;
  		return function(number, precision) {
    		precision = Math.abs(parseInt(precision)) || 0;
    		var multiplier = Math.pow(10, precision);
    		return (originalRound(number * multiplier) / multiplier);
  		};
	})();

	activateGeo();

	activateCompass();

	loadGeoLocations();

	//select hunt target
	$('.geo-location-select').change(function() {

		//get selected geo location
		var index = $('option:selected', this).attr('id');
		
		var geoLocations = getStoredGeoLocations();


		if (geoLocations !== null) {
			var location = geoLocations[index];

			if (typeof location !== 'undefined') {
				selectedLocation = location;
				$("#route").prop("disabled", false);
				checkVicinityStatus();
			}
		}
	});

	//lifecycle
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);

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

var geoWatchId = null;
var compassWatchId = null;

var catchingPokemonMessage = "Catching pokemon";
var statusSelectTarget = "Select a target";
var statusCanCatch = "You can catch the pokemon";
var statusTooFar = "Too far away";

//lifecycle
function onPause() {
	deactivateGeo();
	deactivateCompass();
}

function onResume() {
	activateGeo();
	activateCompass();
}

function activateGeo() {
	navigator.geolocation.getCurrentPosition(updateLocationData);
	geoWatchId = navigator.geolocation.watchPosition(updateLocationData);
}

function deactivateGeo() {
	if (geoWatchId !== null) {
		navigator.geolocation.clearWatch(geoWatchId);
	}
	geoWatchId = null;
}

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
	
	$("#geo_longitude").html("" + Math.round(longitude, DECIMALS));
	$("#geo_latitude").html("" + Math.round(latitude, DECIMALS));

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
				$("#label_geo_hunt_status").removeClass().addClass('text-lightgreen');
				$("#label_geo_hunt_status").text(statusCanCatch);
				//enable catch button.
				$("#catch").prop("disabled", false);
				return true;
			} else {
				$("#label_geo_hunt_status").removeClass().addClass('text-gray');
				$("#label_geo_hunt_status").text(statusTooFar);
			}
		}	
	} else {
		$("#label_geo_hunt_status").removeClass();
		$("#label_geo_hunt_status").text(statusSelectTarget);
	}
	//disable catch button.
	$("#catch").prop("disabled", true);
	return false;
}

function catchPokemon() {

	if (checkVicinityStatus()) {

		showLoader(catchingPokemonMessage);

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

function deactivateCompass() {
	if (compassWatchId !== null) {
		navigator.compass.clearWatch(compassWatchId);
	}
	compassWatchId = null;
}

function updateCompass(heading) {

	if (currentLocation !== null && selectedLocation !== null) {
		var bearing = calculateBearing(currentLocation.coords.latitude, currentLocation.coords.longitude, selectedLocation.latitude, selectedLocation.longitude);

		var magneticHeading = heading.magneticHeading;

		var distance = getDistanceFromLatLonInKm(currentLocation.coords.latitude, currentLocation.coords.longitude, selectedLocation.latitude, selectedLocation.longitude);
		
		//distance smaller than 1km -> show meters.
		if (distance < 1) {
			$("#distance").text("Distance: " + Math.round(distance, 3) * 1000 + " M");
		} else {
			$("#distance").text("Distance: " + Math.round(distance, 3) + " KM");
		}
		
	
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

//calculate bearing between two locations.
//http://gis.stackexchange.com/questions/29239/calculate-bearing-between-two-decimal-gps-coordinates
function calculateBearing(startLat, startLong, endLat, endLong) {
	startLat = radians(startLat);
	startLong = radians(startLong);
	endLat = radians(endLat);
	endLong = radians(endLong);
	
	var dLong = endLong - startLong;
	
	var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
	if (Math.abs(dLong) > Math.PI){
		if (dLong > 0.0) {
		   dLong = -(2.0 * Math.PI - dLong);
		}
		else {
		   dLong = (2.0 * Math.PI + dLong);
		}
	}
	
	return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

//calculate distance between two locations.
//http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = radians(lat2-lat1);  // deg2rad below
	var dLon = radians(lon2-lon1); 
	var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2)
		; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
  return d;
}

function radians(degrees) {
	return degrees * (Math.PI / 180);
}

function degrees(rad) {
    return rad * (180 / Math.PI);
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