//INIT
$(document).ready(function() {

	$(document).on("swiperight", function() {
    	$("#menuPanel").panel("open");
	});

	//events
	$('#compendiumListView').on('click', 'li a.pokemonListItem', loadPokemonDetails);

	loadCompendium();

	//menu panel
    $(document).on('click', '#open_menu', function(){   
       	$.mobile.activePage.find('#menuPanel').panel("open");       
    });

    //page create events.
    $(document).on("pagecreate", function(event) {
    	var pageCreated = event.target.id;

    });

    //hide page event.
    $(document).on("pagehide", function(event) {
    	var pageHidden = event.target.id;

    	switch(pageHidden) {
    		case 'details': 	console.log("hid details");
    							clearPokemonDetails();
    							break;
    		case 'compendium': 	console.log("hid compendium");
    							break;
    	}

    });

});

//global variables
var TOTAL_POKEMON_COUNT = 721;
var pokemon_number = 0;
var next = '';

// /INIT

//functions
function loadCompendium() {
	var listContent = '';

	$.getJSON('http://pokeapi.co/api/v2/pokemon', function(data) {

		next = data.next;

		$.each(data.results, function() {
			pokemon_number++;
			listContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
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
				pokemon_number++;
				nextListContent += '<li><a href="#" class="pokemonListItem" rel="' + this.url + '">#' + pokemon_number + ' ' + this.name + '</a></li>';
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

	//navigate to details page.
	$.mobile.navigate("#details");

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
		$('#details_image').attr("src", imageUrl);

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

	});
};

function clearPokemonDetails() {
	$('#details_image').attr("src", "");

	$('#details_name').text("");
	$('#details_height').text("");
	$('#details_weight').text("");

	$('#details_types').empty();
	$('#details_abilities').empty();
}

/* NOTES

API base url: http://pokeapi.co/api/v2/
http://pokeapi.co/media/sprites/pokemon/1.png


*/