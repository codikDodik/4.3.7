const inputSearch = document.querySelector(".search__input");
const resultList = document.querySelector(".result__list");
const resultStorage = document.querySelector(".storage");

async function getPredictions() {
  const urlSearchRepositories = new URL(
    "https://api.github.com/search/repositories"
  );
  let repositoriesPart = inputSearch.value;
  if (repositoriesPart == "") {
    remove();
    return;
  }

  urlSearchRepositories.searchParams.append("q", repositoriesPart);
  try {
    let response = await fetch(urlSearchRepositories);
    if (response.ok) {
      let repositories = await response.json();
      showPredictions(repositories);
    } else return null;
  } catch (error) {
    return null;
  }
}

resultStorage.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) return;

  target.parentElement.remove();
});

function remove() {
  resultList.innerHTML = "";
}

function showPredictions(repositories) {
  remove();

  for (let i = 0; i < 5; i++) {
    let name = repositories.items[i].name;
    let owner = repositories.items[i].owner.login;
    let stars = repositories.items[i].stargazers_count;

    let list = document.createElement("li");
    list.classList.add("result__item");
    list.dataset.owner = owner;
    list.dataset.stars = stars;
    list.textContent = name;

    resultList.appendChild(list);
  }
}

resultList.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("result__item")) {
    return;
  }
  addChosen(target);
  inputSearch.value = "";
  remove();
});

function addChosen(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;

  let chosenItem = document.createElement("div");
  chosenItem.classList.add("storage__item");
  chosenItem.innerHTML = `Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button>`;

  resultStorage.appendChild(chosenItem);
}

function debounce(fn, timeout) {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn(...args)), timeout);
    });
  };
}

const getPredictionsDebounce = debounce(getPredictions, 500);
inputSearch.addEventListener("input", getPredictionsDebounce);
