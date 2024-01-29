let pokemonList = document.getElementById("pokemonList");

fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  .then(res => res.json())
  .then(data20 => {
    data20.results.forEach(pokemon => {
      let li = document.createElement("li");
      let link = document.createElement("a");

      link.href = pokemon.url;
      link.innerText = pokemon.name;

      li.appendChild(link);
      pokemonList.appendChild(li);
    });
  })
  .catch(error => {
    console.error("Något gick fel:", error);
  });


