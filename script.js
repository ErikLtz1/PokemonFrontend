let pokemonList = document.getElementById("pokemonList");
let pokeImg = document.getElementById("pokeImg");
let pokedexBtn = document.getElementById("pokedexBtn");
let pokedexDiv = document.getElementById("pokedexDiv")


let pokemonCaptured = false;

fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  .then((res) => res.json())
  .then((data20) => {
    
    data20.results.forEach((pokemon) => {
      
      

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
  .catch((error) => {
    console.error("Något gick fel:", error);
  });

  function fetchPokemonDetails(url) {
    fetch(url)
      .then((res) => res.json())
      .then((pokemonDetails) => {
        let imageUrl;
  
        
        if (pokemonDetails.sprites && pokemonDetails.sprites.front_default) {
          imageUrl = pokemonDetails.sprites.front_default;
        } else if (pokemonDetails.sprites && pokemonDetails.sprites.other && pokemonDetails.sprites.other['official-artwork'] && pokemonDetails.sprites.other['official-artwork'].front_default) {
          imageUrl = pokemonDetails.sprites.other['official-artwork'].front_default;
        } else {
          console.error('Bild-URL saknas i Pokemon-detaljerna.');
          return;
        }
  
        let img = document.createElement("img");
        img.src = imageUrl;
  
        let catchButton = document.createElement("button");
        catchButton.innerText = "Fånga Pokemon";
  
        catchButton.addEventListener("click", function (event) {
          event.preventDefault();
          console.log("Fångade Pokemon: " + pokemonDetails.name);
          pokeImg.innerHTML = "";
          alert("Du fångade " + pokemonDetails.name + " som har lagts till i din Pokedex!");
  
          let existingPokemon = {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            picURL: imageUrl, 
          };
  
          fetch("http://localhost:8080/pokemon", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(existingPokemon),
          })
            .then((res) => res.json())
            .then((response) => {
              console.log(response);
              pokemonCaptured = true;
            })
            .catch((error) => {
              console.error("Något gick fel vid skapande av Pokemon:", error);
            });
        });
  
        pokeImg.innerHTML = "";
        pokeImg.appendChild(img);
        pokeImg.appendChild(catchButton);
  
        console.log("ID:", pokemonDetails.id);
        console.log("Namn:", pokemonDetails.name);
        console.log("BildURL: ", imageUrl);
      })
      .catch((error) => {
        console.error("Något gick fel vid hämtning av Pokemon-detaljer:", error);
      });
  }
  
  
  

  pokedexBtn.addEventListener("click", function (event) {
    fetch("http://localhost:8080/pokemons")
      .then((res) => res.json())
      .then((pokedex) => {
        event.preventDefault();
        console.log(pokedex);
  
        
        pokedexDiv.innerHTML = "";
  
        
        pokedex.forEach((pokemon) => {
          let ul = document.createElement("ul");
  
          
          let liName = document.createElement("li");
          liName.innerText = `Namn: ${pokemon.name}`;
          ul.appendChild(liName);
  
          
          let releaseButton = document.createElement("button");
          releaseButton.innerText = "Släpp Pokemon";
  
          releaseButton.addEventListener("click", function (releaseEvent) {
            releaseEvent.preventDefault();
          
            
            fetch(`http://localhost:8080/pokemon/${pokemon.id}`, {
              method: "DELETE",
            })
              .then((res) => {
                if (res.ok) {
                  
                  return res.text();
                } else {
                  throw new Error(`Failed to delete Pokemon: ${res.statusText}`);
                }
              })
              .then((deletePokeData) => {
                
                ul.remove();
              })
              .catch((error) => {
                console.error("Något gick fel vid radering av Pokemon:", error);
              });
          
            console.log("Släpp Pokemon: " + pokemon.name);
          });
          
          
          
  
          
          let liButton = document.createElement("li");
          liButton.appendChild(releaseButton);
          ul.appendChild(liButton);
  
          
          pokedexDiv.appendChild(ul);
        });
      })
      .catch((error) => {
        console.error("Något gick fel:", error);
      });
  });
  
  


