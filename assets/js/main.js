const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

const pokemonModal = document.getElementById("pokemonModal");
const modalCloseButton = pokemonModal.querySelector(".close");
const pokemonNameElement = pokemonModal.querySelector(".pokemon-name");
const pokemonNumberElement = pokemonModal.querySelector(".pokemon-number");
const pokemonImageElement = pokemonModal.querySelector(".pokemon-image");
const pokemonTypesElement = pokemonModal.querySelector(".pokemon-types");
const pokemonDescriptionElement = pokemonModal.querySelector(
  ".pokemon-description"
);

function showPokemonDetails(pokemon) {
  pokemonNameElement.textContent = pokemon.name;
  pokemonNumberElement.textContent = `#${pokemon.number}`;
  pokemonImageElement.src = pokemon.photo;
  pokemonImageElement.alt = pokemon.name;
  pokemonTypesElement.innerHTML = pokemon.types
    .map((type) => `<span class="type ${type}">${type}</span>`)
    .join("");
  pokemonModal.style.display = "block";
}

modalCloseButton.addEventListener("click", () => {
  pokemonModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == pokemonModal) {
    pokemonModal.style.display = "none";
  }
});

pokemonList.addEventListener("click", (event) => {
  const clickedElement = event.target.closest("li.pokemon");
  if (clickedElement) {
    const pokemonName = clickedElement.querySelector(".name").textContent;
    const pokemon = {
      name: pokemonName,
      number: clickedElement
        .querySelector(".number")
        .textContent.replace("#", ""),
      types: Array.from(clickedElement.querySelectorAll(".type")).map(
        (el) => el.textContent
      ),
      photo: clickedElement.querySelector("img").src,
    };
    showPokemonDetails(pokemon);
  }
});
