//INIT
document.addEventListener("deviceready", setup, false);


function setup() {
	console.log("setup");

	//LIFECYCLE EVENTS

	//page create event
    $(document).on("pagecreate", function(event) {
    	var pageCreated = event.target.id;

    });

    //page before show event
	$(document).on("pagebeforeshow", function(event, data) {
		var page = data.toPage[0].id;

		if (page === "ownedPokemon") {
			loadOwnedPokemon();
		}
	});

	//page show event
	$(document).on("pageshow", function(event, data) {
		var page = data.toPage[0].id;

		switch (page) {
			case 'compendium' : 	//if (compendiumIsLoading) {
										showLoader("Loading..");
									//}
									break;
			case 'details' : 		showLoader("Loading..");
									break;
		}

	});

	//page hide event
    $(document).on("pagehide", function(event) {
    	var pageHidden = event.target.id;

    	switch(pageHidden) {
    		case 'details': 	clearPokemonDetails();
    							break;
    	}

    });

	//click events
	$('#compendiumListView').on('click', 'li a.pokemonListItem', loadPokemonDetails);

	$('#ownedPokemonListView').on('click', 'li a.pokemonListItem', loadPokemonDetails);

	//menu panel
    $(document).on('click', '#open_menu', function(){   
       	$.mobile.activePage.find('#menuPanel').panel("open");       
    });

    //menu swipe
	$(document).on("swiperight", function() {
    	$.mobile.activePage.find('#menuPanel').panel("open");    
	});

	//initialization
	loadCompendium();
	loadOwnedPokemon();
}

//global variables
var TOTAL_POKEMON_COUNT = 721;
var pokemon_number = 0;
var next = '';

var compendiumIsLoading = false;

// /INIT

//functions
function loadCompendium() {
	var listContent = '';

	console.log("LOADING COMPENDIUM");
	compendiumIsLoading = true;

	$.getJSON('http://pokeapi.co/api/v2/pokemon', function(data) {

		next = data.next;

		$.each(data.results, function() {
			pokemon_number++;
			listContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
		});

		$('#compendiumListView').html(listContent);
		$('#compendiumListView').listview("refresh");

		// compendiumIsLoading = false;
		// hideLoader();
		console.log("DONE LOADING COMPENDIUM");

	});
};

function loadNext(page) {
	var nextListContent = '';

	if (next !== '') {
		$.getJSON(next, function(data) {
			next = data.next;

			if (next !== null) {
				$.each(data.results, function() {
					pokemon_number++;
					nextListContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
				});
	
				$("#compendiumListView", page).append(nextListContent).listview("refresh");
			}
		});
	}
};

function addMore(page) {
    showLoader("Loading more..");
    setTimeout(function () {
        loadNext(page); 
       hideLoader();
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

	//navigate to details page.
	$.mobile.navigate("#details", {transition: "slide"});

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

		//set data on details page.
		var imageUrl = "http://pokeapi.co/media/sprites/pokemon/" + pokemonId + ".png";

		$('#details_image_container').append('<img id="details_image" src="' + imageUrl + '" alt="Pokemon" class="pokemon-image" />');

		$('#details_name').text("Name: " + pokemonName);
		$('#details_height').text("Height: " + pokemonHeight);
		$('#details_weight').text("Weight: " + pokemonWeight);

		//set types
		$('#details_types').text("Types: ");

		for (i = 0; i < pokemonTypes.length; i++) {
			$('#details_types').append(pokemonTypes[i]);
			if (i < pokemonTypes.length - 1) {
				$('#details_types').append(", ");
			}
		}

		//set abilities
		$('#details_abilities').text("Abilities: ");

		for (i = 0; i < pokemonAbilities.length; i++) {
			$('#details_abilities').append("<div class=\"ability\">" + pokemonAbilities[i] + "</div>");
		}

		hideLoader();

	});

};

function clearPokemonDetails() {
	$('#details_image_container').empty();

	$('#details_name').empty();
	$('#details_height').empty();
	$('#details_weight').empty();

	$('#details_types').empty();
	$('#details_abilities').empty();
}

// OWNED POKEMON

function loadOwnedPokemon() {

	console.log("LOAD OWNED POKEMON");
	var listContent = '';

	var ownedPokemon = getOwnedPokemon();

	if (ownedPokemon !== null) {

		$.each(ownedPokemon, function(index, value) {

			//loop over owned pokemon and get info for each pokemon through the API.
			var url = "http://pokeapi.co/api/v2/pokemon/" + ownedPokemon[index];

			$.getJSON(url, function(data) {
	
				var id = data.id;
				var name = data.name;
	
				listContent += '<li><a href="#" class="pokemonListItem" rel="' + url + '">#' + id + ' ' + name + '</a></li>';	
	
				//console.log(listContent);
				$('#ownedPokemonListView').html(listContent);
				$('#ownedPokemonListView').listview("refresh");

			});

		});
	} else {
		addInitialPokemon();
	}
}

/* NOTES

API base url: http://pokeapi.co/api/v2/
http://pokeapi.co/media/sprites/pokemon/1.png


*/