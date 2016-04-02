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