let pokemonList = document.getElementById("pokemonList");
let pokeImg = document.getElementById("pokeImg");
let pokedexBtn = document.getElementById("pokedexBtn");
let pokedexDiv = document.getElementById("pokedexDiv");


//Hämtar information om de första 20 pokemon
fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  .then((res) => res.json())
  .then((data20) => {
    //Loopar igenom varje pokemon i resultatet
    data20.results.forEach((pokemon) => {
      //hämtar detaljerad information om varje pokemon för att nå pokemons img
      fetch(pokemon.url)
        .then((res) => res.json())
        .then((dataPoke) => {
          //Skapar li, img och gör varje pokemon till en länk
          let li = document.createElement("li");

          let img = document.createElement("img");
          img.src = dataPoke.sprites.front_default;

          let link = document.createElement("a");
          link.href = "#";

          //Eventlyssnare när man klickar på länken
          link.addEventListener("click", function (event) {
            event.preventDefault();
            pokeImg.innerHTML = "";
            pokedexDiv.innerHTML = "";

            //Skapar en h2, img och fånga knapp till pokemonen man klickar på
            let pokemonName = document.createElement("h2");
            pokemonName.innerText = `Name: ${dataPoke.name}`;

            let pokemonImage = document.createElement("img");
            pokemonImage.src = dataPoke.sprites.front_default;

            let catchButton = document.createElement("button");
            catchButton.innerText = "Catch Pokemon";

            // Lägger till skapade element i pokeImg-diven
            pokeImg.appendChild(pokemonName);
            pokeImg.appendChild(pokemonImage);
            pokeImg.appendChild(catchButton);
            //eventlistener när man klickar på att fånga-knappen
            catchButton.addEventListener("click", function (event) {
              event.preventDefault();
              pokeImg.innerHTML = "";
              alert("Du fångade " + dataPoke.name + " som har lagts till i din Pokedex!");

              //Skapar ett objekt med info om den fångade pokemonen
              let existingPokemon = {
                id: dataPoke.id,
                name: dataPoke.name,
                picURL: dataPoke.sprites.front_default,
              };

              //skickar en post-förfrågan om att lägga till den nya pokemonen i databasen
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
                  
                })
                .catch((error) => {
                  console.error("Något gick fel vid skapande av Pokemon:", error);
                });
            });

            
            
          });
          
          link.appendChild(img);
          li.appendChild(link);
          pokemonList.appendChild(li);
        })
        .catch((error) => {
          console.error("Något gick fel vid hämtning av Pokemon-detaljer:", error);
        });
    });
  })
  .catch((error) => {
    console.error("Något gick fel:", error);
  });


//Eventlistener för tryck på pokedex-bilden
pokedexBtn.addEventListener("click", function (event) {
  //Hämtar information om vilka pokemon som är sparade i databasen
  fetch("http://localhost:8080/pokemons")
    .then((res) => res.json())
    .then((pokedex) => {
      event.preventDefault();
      console.log(pokedex);

      pokedexDiv.innerHTML = "";

      //Loopar igenom varje fångad pokemon och skapar en ul med ett h2 och release-knapp i
      pokedex.forEach((pokemon) => {
        let ul = document.createElement("ul");

        let h2Name = document.createElement("h2");
        h2Name.innerText = `Name: ${pokemon.name}`;
        ul.appendChild(h2Name)
        let releaseButton = document.createElement("button");
        releaseButton.innerText = "Release Pokemon";

        let liButton = document.createElement("li");
        liButton.appendChild(releaseButton);
        ul.appendChild(liButton);

        pokedexDiv.appendChild(ul);

        //eventlistener som fetchar deletemapping och pokemon med ett specifikt id och raderar
        releaseButton.addEventListener("click", function (releaseEvent) {
          releaseEvent.preventDefault();
          alert("Du släppte ut en pokemon från ditt Pokedex!");

          fetch(`http://localhost:8080/pokemon/${pokemon.id}`, {
            method: "DELETE",
          })
            .then((res) => {
              if (res.ok) {
                return res.text();
              } else {
                throw new Error(`Misslyckades att radera Pokemon: ${res.statusText}`);
              }
            })
            .then((deletePokeData) => {
              ul.remove();
            })
            .catch((error) => {
              console.error("Något gick fel vid radering av Pokemon:", error);
            });
        });

        
      });
    })
    .catch((error) => {
      console.error("Något gick fel:", error);
    });
});
