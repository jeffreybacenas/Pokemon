$(document).ready(function () {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon';

    const table = $('#pokemonTable').DataTable({
columns: [
{ data: 'name' },
{ data: 'types' },
{ 
    data: 'image', 
    render: function (data) {
        return `<img src="${data}" class="pokemon-image" width="50" height="50">`;
    }
},
]
});



    // Function to handle click on Pokémon row
    function handleRowClick() {
        // Remove the 'selected-row' class from all rows
        $('#pokemonTable tbody tr').removeClass('selected-row');

        // Add the 'selected-row' class to the clicked row
        $(this).addClass('selected-row');

        // Get the name of the Pokémon from the clicked row
        const pokemonName = $(this).find('td:first-child').text();

        // Fetch Pokémon details by name and display them
        fetchPokemonDetails(pokemonName);
    }

    // Handle click on Pokémon row to display details in modal
    $('#pokemonTable tbody').on('click', 'tr', handleRowClick);

    // Function to fetch Pokémon details by name and display them in the modal
function fetchPokemonDetails(name) {
$.get(`${apiUrl}/${name.toLowerCase()}`, function (pokemonData) {
const name = capitalizeFirstLetter(pokemonData.name);
const types = pokemonData.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ');
const abilities = pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ');
const imageUrl = pokemonData.sprites.front_default;
const stats = pokemonData.stats.map(stat => ({
    name: capitalizeFirstLetter(stat.stat.name),
    value: stat.base_stat
}));

// Update the Pokémon details in the modal
$('#modalPokemonName').text(name);
$('#modalPokemonType').html(`<strong>Type:</strong> ${types}`);
$('#modalPokemonAbilities').html(`<strong>Abilities:</strong> ${abilities}`);
$('#modalPokemonStats').html(`<strong>Stats:</strong><br>${stats.map(stat => `${stat.name}: ${stat.value}`).join('<br>')}`);
$('#modalPokemonImage').attr('src', imageUrl);

// Show the modal
$('#pokemonModal').modal('show');
});
}


    // Function to fetch all Pokémon data and populate the table
    function fetchAllPokemonData() {
        $.get(`${apiUrl}?limit=898`, function (data) {
            const rows = [];

            data.results.forEach(function (pokemon) {
                $.get(pokemon.url, function (pokemonData) {
                    const name = capitalizeFirstLetter(pokemon.name);
                    const types = pokemonData.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ');
                    const imageUrl = pokemonData.sprites.front_default;

                    rows.push({
                        name: name,
                        types: types,
                        image: imageUrl,
                    });

                    if (rows.length === 898) {
                        // Add the rows to the table and draw it
                        table.rows.add(rows).draw();

                        // Hide the loading indicator
                        $('#loading').hide();
                    }
                });
            });
        });
    }

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize the Pokémon data
    fetchAllPokemonData();
});