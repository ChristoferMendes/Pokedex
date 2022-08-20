const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImage = document.querySelector(".pokemon_image");
const form = document.querySelector(".form");
const input = document.querySelector(".input_search")
const ButtonPrev = document.querySelector(".btn-prev");
const ButtonNext = document.querySelector(".btn-next");
const arrow = document.querySelector(".arrow")
const moreInfoContainer = document.querySelector(".more-info-container")
const moreInfoName = document.querySelector(".more-info-name")
const moreInfoAbilities = document.querySelector(".more-info-abilities")
const moreInfoGame = document.querySelector(".more-info-game")
const moreInfoType = document.querySelector(".more-info-type")

let searchPokemon = 1; //Variable of the current pokemon id

const fecthPokemon = async (pokemon) =>{
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`); //Fetching the API with the pokemon passed
  if (APIResponse.status === 200){ //Checking if the API request is 200
    const data = await APIResponse.json(); //Transforming the information in json, so my program can read it
    return data; //Returning it
  }
};

const renderPokemon = async (pokemon) =>{
  pokemonName.innerHTML = "Loading..."; //Default values when searching
  pokemonNumber.innerHTML = ""; //Default values when searching
  searchPokemon = pokemon;
  const data = await fecthPokemon(searchPokemon); //Awaiting to the fetch
  try{
    pokemonNumber.innerHTML = data.id; //Setting the number of the Pokemon to their id in the API
    pokemonName.innerHTML = data.name; //Setting the name of the Pokemon to their name in the API
    pokemonImage.src = data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]; //Grabbing the gif image in the API and setting it to my image div
    input.value = ""; //Resetting the value of the input, so when I search, he cleans it for me
    searchPokemon = data.id; //Defining my current Pokemon id equal to the searched Pokemon (to not broke the buttons down below)
  } //If the fetch have any data, I will procede
  catch(e){
    pokemonName.innerHTML = `"${input.value}" not found :(`; //If the data doesn't have any content, I say to my user
    pokemonNumber.innerHTML = ""; //Putting the number as 'nothing'

    pokemonImage.src = "https://pa1.narvii.com/7402/fb3e64ac95aebaebe67cfdc166275796db4b8a60r1-226-453_hq.gif"; //MissingNo.
  }
  getMoreInfo(searchPokemon, false)
  
}

form.addEventListener("submit", (event) =>{ //Search form tab
  event.preventDefault(); //Preventing the default event of the submit button
  renderPokemon(input.value.toLowerCase()); //Calling the renderPokemon function with input value
  moreInfoContainer.classList.contains('visible') ? getMoreInfo(searchPokemon, false) : getMoreInfo(searchPokemon, true);
})

ButtonNext.addEventListener("click",() =>{ //Button-next 
  pokemonImage.style.display = "inherit";//Resetting the display (in case the user click this after a non-succesfull search)
  searchPokemon+= 1; //If clicked, increase the Pokemon's current id variable
  renderPokemon(searchPokemon); //Call the renderPokemon with that increased variable
  moreInfoContainer.classList.contains('visible') ?  getMoreInfo(searchPokemon, false) : getMoreInfo(searchPokemon, true);
})

ButtonPrev.addEventListener("click",() =>{//Button-prev
  if(searchPokemon > 1){//Preventing that my user goes lower than 0 in the Pokemons
    pokemonImage.style.display = "inherit";
    searchPokemon-= 1; //if clicked, decrease the Pokemon's current id variable
    renderPokemon(searchPokemon); //Call the renderPokemon with that decreased variable
    moreInfoContainer.classList.contains('visible') ?  getMoreInfo(searchPokemon, false) : getMoreInfo(searchPokemon, true);
    
  }
})

renderPokemon(searchPokemon); //Calling the function here just to have a "default value" (1 - Bulbasaur)

//More infos
async function getMoreInfo(pokemon, except){
  if(moreInfoContainer.classList.contains('visible') && except == true){
    moreInfoContainer.classList.replace('visible', 'invisible')
  }else if(except == false) {
    moreInfoContainer.classList.replace('invisible', 'visible'); 
  const data = await fecthPokemon(pokemon)
  const game = `https://pokemondb.net/${data.game_indices[0].version.name}-${data.game_indices[1].version.name}`
  
  const types = data.types.map(row => row.type.name);
  const typesLink = [`https://pokemondb.net/type/${types[0]}`, `https://pokemondb.net/type/${types[1]}`]

  moreInfoName.innerHTML = `<h3>Pokemon name: <span class='poke_name ${types[0]}'>${data.name}</span></h3>`

  moreInfoAbilities.innerHTML = `<h3>Initial abilities: ${data.abilities.map((row) => {
    return(
      `<a href="https://pokemondb.net/ability/${row.ability.name}" target="_blank"> ${row.ability.name}</a>`
    )
  }).join(' ')}</h3>`

  const [first, second ] = data.game_indices.map(row => ({ name: row.version.name.split(' ')[0] }))

  const firsts = `${first.name}-${second.name}`

  moreInfoGame.innerHTML = `
  <h3> First games:
    <a href='https://pokemondb.net/${firsts}' target='_blank'> ${first.name}/${second.name}</a> 
  </h3>
  `


  types[1] != undefined 
  ? 
  moreInfoType.innerHTML = `
    <h3>Types: 
      <a class='type ${types[0]}' href='${typesLink[0]}' target='blank'>${types[0]}</a>
      <a class='type ${types[1]}' href='${typesLink[1]}' target='blank'>${types[1]}</a>
    </h3>
  `
  :
  moreInfoType.innerHTML = `
    <h3>Types: 
      <a class='type ${types[0]}' href='${typesLink[0]}' target='blank'>${types[0]}</a>
    </h3>
    `
  }
  
}

arrow.addEventListener("click", () =>{
  moreInfoContainer.classList.contains('invisible') ? getMoreInfo(searchPokemon, false) : getMoreInfo(searchPokemon, true)
});


