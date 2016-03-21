//INIT
$(document).ready(function() {
	

	$(document).on("swiperight",function(){
    	$("#menuPanel").panel("open");
	});

	//events
	$('#compendiumListView').on('click', 'li a.pokemonListItem', loadPokemonDetails);

	loadCompendium();
});

//global variables
var POKEMON_NUMBER = 0;
var next = '';

// /INIT

//functions
function loadCompendium() {
	var listContent = '';

	$.getJSON('http://pokeapi.co/api/v2/pokemon', function(data) {

		next = data.next;

		$.each(data.results, function() {
			POKEMON_NUMBER++;
			listContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + POKEMON_NUMBER + ' ' + this.name + '</a></li>';
		});

		$('#compendiumListView').html(listContent);
	});
};

function loadNext(page) {
	var nextListContent = '';

	if (next !== '') {
		$.getJSON(next, function(data) {
			next = data.next;

			$.each(data.results, function() {
				POKEMON_NUMBER++;
				nextListContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + POKEMON_NUMBER + ' ' + this.name + '</a></li>';
			});

			$("#compendiumListView", page).append(nextListContent).listview("refresh");
		});
	}
};

function addMore(page) {
    $.mobile.loading("show", {
        text: "loading more..",
        textVisible: true,
        theme: "a"
    });
    setTimeout(function () {
        loadNext(page); 
        $.mobile.loading("hide");
    }, 500);
};

$(document).on("scrollstop", function (e) {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screenHeight = $.mobile.getScreenHeight(),
        contentHeight = $(".ui-content", activePage).outerHeight(),
        header = $(".ui-header", activePage).outerHeight() - 1,
        scrolled = $(window).scrollTop(),
        footer = $(".ui-footer", activePage).outerHeight() - 1,
        scrollEnd = contentHeight - screenHeight + header + footer;
    if (activePage[0].id == "compendium" && scrolled >= scrollEnd) {
        console.log("adding...");
        addMore(activePage);
    }
});

function loadPokemonDetails(event) {
	event.preventDefault();

	var url = $(this).attr('rel');
	console.log(url);

	$.getJSON(url, function(data) {

		//set details
		var pokemonId = data.id;
		var pokemonName = data.name;
		var pokemonHeight = data.height;
		var pokemonWeight = data.weight;
		var pokemonAbilities = [];
		var pokemonTypes = [];

		//extract abilities
		$.each(data.abilities, function() {
			pokemonAbilities.push(this.ability.name);
		});

		//extract types
		$.each(data.types, function() {
			pokemonTypes.push(this.type.name);
		});

		console.log('----------------------------');
		console.log(pokemonName);
		console.log(pokemonHeight);
		console.log(pokemonWeight);
		console.log(pokemonAbilities);
		console.log(pokemonTypes);
		console.log('----------------------------');

		//set data on details page.
		var imageUrl = "http://pokeapi.co/media/sprites/pokemon/" + pokemonId + ".png";
		$('#details_image').attr("src", imageUrl);

		$('#details_name').text("Name: " + pokemonName);
		$('#details_height').text("Height: " + pokemonHeight);
		$('#details_weight').text("Weight: " + pokemonWeight);

		//set types
		for (i = 0; i < pokemonTypes.length; i++) {
			$('#details_types').append(pokemonTypes[i]);
			if (i < pokemonTypes.length - 1) {
				$('#details_types').append(", ");
			}
		}

		//set abilities
		for (i = 0; i < pokemonAbilities.length; i++) {
			$('#details_abilities').append("<div class=\"ability\">" + pokemonAbilities[i] + "</div>");
		}

	});

	//navigate to details page.
	$.mobile.navigate("#details");
};

/* NOTES

API base url: http://pokeapi.co/api/v2/
http://pokeapi.co/media/sprites/pokemon/1.png


*/