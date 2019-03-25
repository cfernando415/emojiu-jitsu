/* eslint-disable no-console */
/* eslint-disable no-debugger */
let allEmoji = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/emoji")
    .then(res => res.json())
    .then(data => defineEmoji(data));

  document.getElementById("submit").addEventListener("click", submitHandler);
  document
    .getElementById("next-button")
    .addEventListener("click", clickHandler);

  document.getElementById("search").addEventListener("click", searchHandler);
});

function defineEmoji(emoji) {
  allEmoji.push(...emoji);
  const pEmoji = document.getElementById("title");
  const emojiName = document.createElement("small");
  const spanEmoji = document.createElement("span");

  const randEmoji = emoji[Math.floor(Math.random() * emoji.length)];

  emojiName.innerText = randEmoji.name;
  spanEmoji.innerText = randEmoji.image;
  spanEmoji.setAttribute("id", "emoji");
  spanEmoji.setAttribute("role", "img");
  spanEmoji.setAttribute("alt", `${randEmoji.name}`);
  spanEmoji.dataset.id = randEmoji.id;
  pEmoji.append(emojiName);
  pEmoji.append(spanEmoji);

  listDefinitions(randEmoji.definitions);
}

function listDefinitions(definitions) {
  const ulEmojiDefinition = document.getElementById("description");
  ulEmojiDefinition.innerHTML = "";

  for (let word of definitions) {
    const ulChild = document.createElement("li");
    ulChild.innerText = word;
    ulEmojiDefinition.append(ulChild);
  }
}

function submitHandler() {
  const inputField = document.querySelector("input");
  const definitions = [inputField.value];
  const ulNode = document.getElementById("description");
  const spanTagEmoji = document.getElementById("emoji");

  for (let node of ulNode.childNodes) {
    definitions.push(node.innerText);
  }

  fetch(`http://localhost:3000/emoji/${parseInt(spanTagEmoji.dataset.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ definitions: definitions })
  });

  listDefinitions(definitions);

  allEmoji.forEach(emoji => {
    if (emoji.id === parseInt(spanTagEmoji.dataset.id))
      emoji.definitions.push(inputField.value);
  });

  inputField.value = "";
}

function clickHandler() {
  // console.log("click");
  window.location.reload();
}

function searchHandler() {
  const q = document.getElementById("searchField").value;

  const searchResults = allEmoji.filter(emoji =>
    emoji.name.toLowerCase().includes(q.toLowerCase())
  );

  const divSearch = document.getElementById("search-results");

  divSearch.innerHTML = "";

  for (let result of searchResults) {
    const pTitle = document.createElement("p");
    const smallTagResult = document.createElement("small");
    const spanTagResult = document.createElement("span");
    const pRelabel = document.createElement("p");
    const smallTagRelabel = document.createElement("small");
    const spanCount = document.createElement("span");
    const ulNode = document.createElement("ul");

    pTitle.setAttribute("class", "title");
    smallTagResult.innerText = result.name;
    spanTagResult.setAttribute("class", "emoji");
    spanTagResult.setAttribute("role", "img");
    spanTagResult.setAttribute("alt", result.name);
    spanTagResult.innerText = result.image;

    pTitle.append(smallTagResult);
    pTitle.append(spanTagResult);

    smallTagRelabel.innerText = `This emoji has been relabeled ${
      result.definitions.length
    } time(s) as:`;

    pRelabel.append(smallTagRelabel);
    pRelabel.append(spanCount);

    for (let definition of result.definitions) {
      const liNode = document.createElement("li");
      liNode.innerText = definition;
      ulNode.append(liNode);
    }

    divSearch.append(pTitle);
    divSearch.append(pRelabel);
    divSearch.append(ulNode);
  }
}
