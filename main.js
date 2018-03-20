$(document).ready(function() {

  axios.get("https://pokeapi.co/api/v2/pokemon/?limit=1000")
    .then(function(response) {
      console.log(response.data);
      
      $(".loading").addClass('displayNone');
       var all_pokemon = response.data.results;
       var list_items = '';

       $.each(all_pokemon, (index,pokemon) => {
          list_items += `
          <li class="pokemon" id="${pokemon.name}"> 
            ${capitalizeFirst(pokemon.name)}
          </li>
        `;

       });
 
       $('.list').html(list_items);
      })

    .catch(function(err) { 
      console.log(err);
    })

    // dynamically filter through list items based on input text
    .then(() => {
        var items = $('.list li');
        $('input').on('input', function ($event) {
            items.addClass('displayNone').filter(function (item) {
                return $(this).text().toLowerCase().includes($($event.target).val().toLowerCase());
            }).removeClass('displayNone');
        });
      })

    // load pokemon info when list item is clicked
    .then(() => {
      $('li').click(function() {
        $('.loading').removeClass('displayNone');
        // $('.poke_info').html($('.loading'));
        getPokemon($(this).attr('id'));
      });
    });

  // function getPokemon(id) {
  //   return axios.get("https://pokeapi.co/api/v2/pokemon/" + id);
  // }

  function getEvolution(id) {
    return axios.get("https://pokeapi.co/api/v2/evolution-chain/" + id)
  }

  function getPokemon(id) {

    $('.poke-info-modal').removeClass('displayNone');

    axios.get("https://pokeapi.co/api/v2/pokemon/" + id)
      .then(function(poke_response) {

        poke_id = poke_response.data.id;

        
             $('.loading').addClass('displayNone');

            console.log(poke_response.data);
            var pokemon=poke_response.data;

            var types = "";
            pokemon.types.map((item) => {types += capitalizeFirst(item.type.name) + '/'});
            types = types.slice(0, -1);

            var abilities = "";
            pokemon.abilities.map((item) => {abilities += capitalizeFirst(item.ability.name) + ', '});
            abilities = abilities.slice(0, -2);

            var output = '';
            output +=  `
              <div class="poke-info">

                <span class="close-button"> &times; </span>
                <h1> ${capitalizeFirst(pokemon.name)} </h1>
                <img src="${pokemon.sprites.front_default}"/>
                <div class="poke-info-stats">
                  <p> <span>Type:</span> ${types}</p>
                  <p> <span>Height:</span> ${pokemon.height/10} meters </p>
                  <p> <span>Weight:</span> ${pokemon.weight/10} kilograms </p>
                  <p> <span>Abilities:</span> ${abilities}</p>
                </div>
                <a class="learn-more" href="https://www.pokemon.com/us/pokedex/${pokemon.id}">Learn More</a> 
              </div>
            `;

            $('.poke-info-modal').html(output);

            $('.close-button').click(function() {
              $('.poke-info-modal').addClass('displayNone');
              $('.poke-info-modal').html(``);
            });
          
      });
    }

 
   function capitalizeFirst(str) {
      var out = "";
      out += str[0].toUpperCase()  + str.substr(1);
      return out;
   }

});

// <p> <strong>Pokedex Number: </strong> #${pokemon.id}</p>
