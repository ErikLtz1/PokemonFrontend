let pokemonList = document.getElementById("pokemonList");
let pokeImg = document.getElementById("pokeImg");
let pokedexBtn = document.getElementById("pokedexBtn");

let pokemonCaptured = false;

fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  .then(res => res.json())
  .then(data20 => {
    data20.results.forEach(pokemon => {
      let li = document.createElement("li");
      let link = document.createElement("a");

      link.href = pokemon.url;
      link.innerText = pokemon.name;

      link.addEventListener("click", function (event) {
        event.preventDefault();
        fetchPokemonDetails(pokemon.url);
      });

      li.appendChild(link);
      pokemonList.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Något gick fel:", error);
  });

function fetchPokemonDetails(url) {
  fetch(url)
    .then(res => res.json())
    .then(pokemonDetails => {
      let imageUrl = pokemonDetails.sprites.front_default;

      let img = document.createElement("img");
      img.src = imageUrl;

      let catchButton = document.createElement("button");
      catchButton.innerText = "Fånga Pokemon";

      catchButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Fångade Pokemon: " + pokemonDetails.name);
        alert("En ny Pokémon har lagts till i din Pokedex!");

        let existingPokemon = {
          id: pokemonDetails.id,
          name: pokemonDetails.name,
        };

        fetch("http://localhost:8080/pokemon", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(existingPokemon)
        })
        .then(res => res.json())
        .then(response => {
          console.log(response);
          pokemonCaptured = true;
          
          
        })
        .catch(error => {
          console.error("Något gick fel vid skapande av Pokemon:", error);
        });
      });

      pokeImg.innerHTML = "";
      pokeImg.appendChild(img);
      pokeImg.appendChild(catchButton);

      console.log("ID:", pokemonDetails.id);
      console.log("Namn:", pokemonDetails.name);
    })
    .catch(error => {
      console.error("Något gick fel vid hämtning av Pokemon-detaljer:", error);
    });
}

pokedexBtn.addEventListener("click", function (event) {
      fetch("http://localhost:8080/pokemons")
        .then(res => res.json())
        .then(pokedex => {
      event.preventDefault();
      console.log(pokedex);
    });
  });


