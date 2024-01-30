let pokemonList = document.getElementById("pokemonList");
let pokeImg = document.getElementById("pokeImg");

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
