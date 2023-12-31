    $(document).ready(function() {
        $('#pokemon-select').select2();
    });

    let currentPokemonNumber = 1;

    function fetchPokemonName(pokemonNumber) {
    
        setTimeout(function() {
            $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`,
            dataType: 'json',
            success: function(data) {
                
                const pokemonName = data.name.replace(/\b\w/g, (match) => match.toUpperCase());
                const pokemonImageUrl = data.sprites.front_default;
                const primaryType = data.types[0].type.name;
                const types = data.types.map(type => type.type.name).join(', ');
                const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
                const height = data.height;
                const weight = data.weight;
                const baseStats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
                
                // Remove existing type classes and add the class corresponding to the primary type
                $('#poke-about').removeClass().addClass(primaryType + '-text');
                
                // Set the Pokémon information in #poke-about
                $('#poke-about').html(`<strong>Type:</strong> ${types}<br><strong>Abilities:</strong> ${abilities}<br><strong>Height:</strong> ${height} dm<br><strong>Weight:</strong> ${weight} hg<br><strong>Base Stats:</strong> ${baseStats}`);

                // Set the Pokémon name in #poke-name and add a class based on its type
                const pokemonNameElement = $('#poke-name');
                pokemonNameElement.removeClass().addClass(primaryType + '-text');
                pokemonNameElement.text(pokemonName);

                // Set the Pokémon image in #poke-image
                $('#poke-image').attr('src', pokemonImageUrl);

                    }
                });
            }, 1000); 
        }

        fetchPokemonName(currentPokemonNumber);

        $('#next-button').on('click', function() {
            currentPokemonNumber++;
            fetchPokemonName(currentPokemonNumber);
        });

        $('#prev-button').on('click', function() {
            if (currentPokemonNumber > 1) {
                currentPokemonNumber--;
                fetchPokemonName(currentPokemonNumber);
            }
        });

        // Function to fetch and populate the list of Pokémon in the <select> element
        function fetchPokemonList() {
        $.ajax({
            url: 'https://pokeapi.co/api/v2/pokemon/?limit=1000', // You can adjust the limit as needed
            dataType: 'json',
            success: function (data) {
            const pokemonSelect = $('#pokemon-select');

            // Iterate through the results and add each Pokémon as an <option> element
            data.results.forEach(function (pokemon) {
                const option = $('<option></option>');
                option.val(pokemon.url); // Store the URL of the Pokémon
                option.text(pokemon.name.replace(/\b\w/g, (match) => match.toUpperCase()));
                pokemonSelect.append(option);
            });
            },
        });
        }

        // Call the function to populate the <select> element
        fetchPokemonList();

        // Event handler for when a Pokémon is selected
        $('#pokemon-select').on('change', function () {
        const selectedPokemonUrl = $(this).val();

        if (selectedPokemonUrl) {
            // Extract the Pokémon's ID from the URL
            const pokemonId = selectedPokemonUrl.split('/').slice(-2, -1)[0];

            // Call the fetchPokemonName function with the selected Pokémon's ID
            fetchPokemonName(pokemonId);
        } else {
            // Handle the case when "Select a Pokémon" is chosen
            // You can clear the Pokémon details here if needed
        }
});