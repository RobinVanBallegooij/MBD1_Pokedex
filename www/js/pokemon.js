//INIT
document.addEventListener("deviceready", setup, false);


function setup() {

	loadInitialLanguage();

	//hide labels
	hideDetailsLabels();

	//LIFECYCLE EVENTS

	//page create event
    $(document).on("pagecreate", function(event) {
    	var pageCreated = event.target.id;

    });

	//page show event
	$(document).on("pageshow", function(event, data) {
		var page = data.toPage[0].id;

		console.log("PAGE: " + page);

		switch (page) {
			case 'compendium' : 	if (isLoadingCompendium) {
										showLoader(loadingMessage);
									} 
									break;
			case 'ownedPokemon' : 	if (isLoadingOwnedPokemon) {
										showLoader(loadingMessage);
									} 
									break;
			case 'details' : 		showLoader(loadingMessage);
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

	//open online pokedex in browser.
	$('#details_browser').on('click', function() {
		var id = $('#details_browser').attr('value');

		if (id < TOTAL_POKEMON_COUNT) {
			window.open(pokedexUrl + id, '_system');
		} else {
			window.open(pokedexUrl, '_system');
		}
		
	})

	$('#details_browser').hide();

	//save settings
	$('#button_save_settings').on('click', saveSettings);

	//menu panel
    $(document).on('click', '#open_menu', function(){   
       	$.mobile.activePage.find('#menuPanel').panel("open");       
    });

    //menu swipe
	$(document).on("swiperight", function() {
    	$.mobile.activePage.find('#menuPanel').panel("open");    
	});

	//scroll stop listener for endless scrolling.
	$(document).on("scrollstop", function (e) {
    	var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
    	    screenHeight = $.mobile.getScreenHeight(),
    	    contentHeight = $(".ui-content", activePage).outerHeight(),
    	    header = $(".ui-header", activePage).outerHeight() - 1,
    	    scrolled = $(window).scrollTop(),
    	    footer = $(".ui-footer", activePage).outerHeight() - 1,
    	    scrollEnd = contentHeight - screenHeight + header + footer;
    	if (activePage[0].id == "compendium" && scrolled >= scrollEnd) {
    		//load next pokemon
    	    if (!isLoadingNext) {
    	    	loadNext(activePage);
    	    }     
    	}
	});

	//initialization
	loadCompendium();
	loadOwnedPokemon();
}

//global variables
var TOTAL_POKEMON_COUNT = 721;
var POKEMON_LIMIT = 60;
var pokemon_number = 0;
var next = '';

var isLoadingCompendium = false;
var isLoadingNext = false;
var isLoadingOwnedPokemon = false;
var loadingMessage = "Loading..";
var loadingMoreMessage = "Loading more..";

var language_english = "english";
var language_dutch = "dutch";

var pokedexUrl = "http://www.pokemon.com/us/pokedex/";

// /INIT

//functions
function loadCompendium() {
	var listContent = '';

	isLoadingCompendium = true;
	showLoader(loadingMessage);

	$.getJSON('http://pokeapi.co/api/v2/pokemon/?limit=' + POKEMON_LIMIT + '', function(data) {

		next = data.next;

		$.each(data.results, function() {
			pokemon_number++;
			listContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
		});

		$('#compendiumListView').html(listContent);
		$('#compendiumListView').listview("refresh");

		isLoadingCompendium = false;
		hideLoader();

	});
};

function loadNext(page) {
	var nextListContent = '';

	if (pokemon_number < TOTAL_POKEMON_COUNT) {
		if (next !== '') {
			isLoadingNext = true;
			showLoader(loadingMoreMessage);

			//check for last pokemon.
			if (pokemon_number === TOTAL_POKEMON_COUNT - 1) {
				next = "http://pokeapi.co/api/v2/pokemon/?limit=1&offset=" + (TOTAL_POKEMON_COUNT - 1);
			}
	
			$.getJSON(next, function(data) {
				next = data.next;
	
				if (next !== null) {
					$.each(data.results, function() {
						pokemon_number++;
						nextListContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
					});
		
					$("#compendiumListView", page).append(nextListContent).listview("refresh");
				}
	
				isLoadingNext = false;
				hideLoader();
			});
		}
	}

};

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

		//show labels
		$("span#label_details_name").show();
		$("span#label_details_height").show();
		$("span#label_details_weight").show();
		$("span#label_details_types").show();
		$("span#label_details_abilities").show();

		//set data
		$('#details_name').text("" + pokemonName);
		$('#details_height').text("" + pokemonHeight);
		$('#details_weight').text("" + pokemonWeight);

		//set types

		for (i = 0; i < pokemonTypes.length; i++) {
			$('#details_types').append(pokemonTypes[i]);
			if (i < pokemonTypes.length - 1) {
				$('#details_types').append(", ");
			}
		}

		for (i = 0; i < pokemonAbilities.length; i++) {
			$('#details_abilities').append("<div class=\"ability\">" + pokemonAbilities[i] + "</div>");
		}

		hideLoader();
		$('#details_browser').attr('value', pokemonId);
		$('#details_browser').show();

	});

};

function clearPokemonDetails() {
	$('#details_image_container').empty();

	$('#details_name').empty();
	$('#details_height').empty();
	$('#details_weight').empty();

	$('#details_types').empty();
	$('#details_abilities').empty();

	$('#details_browser').attr('value', '');
	$('#details_browser').hide();

	hideDetailsLabels();
}

function hideDetailsLabels() {
	$("span#label_details_name").hide();
	$("span#label_details_height").hide();
	$("span#label_details_weight").hide();
	$("span#label_details_types").hide();
	$("span#label_details_abilities").hide();
}

// OWNED POKEMON

function loadOwnedPokemon() {

	console.log("LOAD OWNED POKEMON");
	var listContent = '';

	var ownedPokemon = getOwnedPokemon();

	if (ownedPokemon !== null) {
		isLoadingOwnedPokemon = true;
		nextOwnedPokemon(0);
	} else {
		addInitialPokemon();
	}

	function nextOwnedPokemon(index) {
		var url = "http://pokeapi.co/api/v2/pokemon/" + ownedPokemon[index];

		$.getJSON(url, function(data) {

			var id = data.id;
			var name = data.name;

			listContent += '<li><a href="#" class="pokemonListItem" rel="' + url + '">#' + id + ' ' + name + '</a></li>';

			//check if pokemon is the last one. If it is update list. If not, get next pokemon.
			index++;
			if (index < ownedPokemon.length ) {
				nextOwnedPokemon(index);
			} else {
				updateList();
			}

		});
	}

	function updateList() {
		$('#ownedPokemonListView').html(listContent);
		$('#ownedPokemonListView').listview("refresh");

		isLoadingOwnedPokemon = false;
		hideLoader();
	}

}

function saveSettings(event) {
	event.preventDefault();
	console.log("SAVED");
	//get selected radio choice
	var value = $("#settings_language :radio:checked").val();
	
	if (typeof value !== 'undefined') {
		if (value === language_english) {
			setEnglish();
		} else if (value === language_dutch) {
			setDutch();
		}
		saveLanguage(value);
	}
}

function loadInitialLanguage() {
	var language = getLanguage();

	if (language !== null) {
		//set radio button
		if (language === language_english) {
			$("input#radio-choice-0a").prop("checked", true);
			setEnglish();
		} else if (language === language_dutch) {
			$("input#radio-choice-0b").prop("checked", true);
			setDutch();
		}
	} else {
		saveLanguage(language_english);
		setEnglish();
		$("input#radio-choice-0a").prop("checked", true);
	}
}

/* NOTES

API base url: http://pokeapi.co/api/v2/
http://pokeapi.co/media/sprites/pokemon/1.png


*/