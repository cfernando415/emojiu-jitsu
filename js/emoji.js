document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/emoji")
    .then(res => res.json())
    .then(data => defineEmoji(data));

  document.getElementById("submit").addEventListener("click", submitHandler);
});

function defineEmoji(emoji) {
  const pEmoji = document.getElementById("emoji");

  randEmoji = emoji[Math.floor(Math.random() * emoji.length)];

  pEmoji.dataset.id = randEmoji.id;
  pEmoji.innerText = randEmoji.image;

  listDefinitions(randEmoji.definitions);
}

function listDefinitions(definitions) {
  const ulEmojiDefinition = document.getElementById("description");
  ulEmojiDefinition.innerHTML = "";

  for (word of definitions) {
    const ulChild = document.createElement("li");
    ulChild.innerText = word;
    ulEmojiDefinition.append(ulChild);
  }
}

function submitHandler(e) {
  const inputField = document.querySelector("input");
  const definitions = [inputField.value];
  const ulNode = document.getElementById("description");
  const pEmoji = document.getElementById("emoji");

  for (node of ulNode.childNodes) {
    definitions.push(node.innerText);
  }

  fetch(`http://localhost:3000/emoji/${parseInt(pEmoji.dataset.id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ definitions: definitions })
  });

  listDefinitions(definitions);

  inputField.value = "";
}
