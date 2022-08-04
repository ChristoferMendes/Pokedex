const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonImage = document.querySelector(".pokemon_image");
const form = document.querySelector(".form");
const input = document.querySelector(".input_search")
const ButtonPrev = document.querySelector(".btn-prev");
const ButtonNext = document.querySelector(".btn-next");

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

  const data = await fecthPokemon(pokemon); //Awaiting to the fetch
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

    pokemonImage.src = "/public/img/missingno.png";
  }
    
  
}

form.addEventListener("submit", (event) =>{ //Search form tab
  event.preventDefault(); //Preventing the default event of the submit button
  renderPokemon(input.value.toLowerCase()); //Calling the renderPokemon function with input value
})

ButtonNext.addEventListener("click",() =>{ //Button-next 
  pokemonImage.style.display = "inherit";//Resetting the display (in case the user click this after a non-succesfull search)
  searchPokemon+= 1; //If clicked, increase the Pokemon's current id variable
  renderPokemon(searchPokemon); //Call the renderPokemon with that increased variable
})

ButtonPrev.addEventListener("click",() =>{//Button-prev
  if(searchPokemon > 1){//Preventing that my user goes lower than 0 in the Pokemons
    pokemonImage.style.display = "inherit";
    searchPokemon-= 1; //if clicked, decrease the Pokemon's current id variable
    renderPokemon(searchPokemon); //Call the renderPokemon with that decreased variable
  }
})

renderPokemon(searchPokemon); //Calling the function here just to have a "default value" (1 - Bulbasaur)