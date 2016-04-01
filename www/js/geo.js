document.addEventListener("deviceready", setupGeo, false);

function setupGeo() {
	console.log("SETUP GEO");

	var currentPosition = navigator.geolocation.getCurrentPosition(updateLocationData);

	function updateLocationData(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;

		$("#geo_latitude").html("latitude: " + latitude);
		$("#geo_longitude").html("longitude: " + longitude);
	}

	var watchId = navigator.geolocation.watchPosition(updateLocationData);

}