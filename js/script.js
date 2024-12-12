const nameInput = document.getElementById("name-input");
const addBtn = document.getElementById("add-btn");
const nameList = document.getElementById("name-list");
const pickBtn = document.getElementById("pick-btn");
const result = document.getElementById("result");

let names = JSON.parse(localStorage.getItem("names")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("names", JSON.stringify(names));
};

function addName() {
  const name = nameInput.value.trim();
  if (name) {
    names.push({ name, included: true, timesPicked: 0 });
    saveToLocalStorage();
    nameInput.value = "";
    renderList();
  }
}

function renderList() {
  nameList.innerHTML = "";
  names.forEach((nameObj, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <label>
        <input type="checkbox" ${
          nameObj.included ? "checked" : ""
        } data-index"${index}" />
        ${nameObj.name}
        </label>
        <button data-index=${index} class="remove-btn">x</button>
        `;
    nameList.appendChild(li);
  });
  pickBtn.classList.toggle("hidden", names.length === 0);
}

function toggleInclude(index) {
  names[index].included = !names[index].included;
  saveToLocalStorage();
  renderList();
}

function removeName(index) {
  names.splice(index, 1);
  saveToLocalStorage();
  renderList();
}

function pickRandomName() {
  const includedNames = names.filter((name) => name.included);
  if (includedNames.length === 0) {
    result.textContent = "No names to pick from, please include some!";
    result.classList.remove("hidden");
    return;
  }
  const randomIndex = Math.floor(Math.random() * includedNames.length);
  const pickedName = includedNames[randomIndex].name;
  const originalIndex = names.findIndex(
    (nameObj) => nameObj.name === pickedName.name
  );
  if (originalIndex !== -1) {
    names[originalIndex].timesPicked++;
  }
  saveToLocalStorage();

  result.textContent = pickedName;
  result.classList.remove("hidden");
  result.style.animation = "fade-in 1s ease-out";
}

// Event Listeners

addBtn.addEventListener("click", addName);
nameList.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT") {
    toggleInclude(e.target.dataset.index);
  }
});

nameList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn"))
    removeName(e.target.dataset.index);
});

pickBtn.addEventListener("click", pickRandomName);

renderList();
