$(document).ready(function() {
	loadCompendium();
});

function loadCompendium() {
	var listContent = '';

	listContent += '<li><a href="#">1</a></li>';
	listContent += '<li><a href="#">2</a></li>';
	listContent += '<li><a href="#">3</a></li>';
	listContent += '<li><a href="#">4</a></li>';
	listContent += '<li><a href="#">5</a></li>';

	$.getJSON('http://pokeapi.co/api/v2/pokemon', function(data) {
		$.each(data, function() {
			console.log(data);
		});
	});

	$('#compendiumListView').html(listContent);

};


/* NOTES

API base url: http://pokeapi.co/api/v2/



*/