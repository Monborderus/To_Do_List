const LS = localStorage;

let filterStatus = "all";

if (!LS.getItem("filterStatus")) {
  LS.setItem("filterStatus", JSON.stringify(filterStatus));
  LS.setItem("tasks", JSON.stringify({}));
}
const parsedTasks = JSON.parse(LS.getItem("tasks"));
const parsedTasksArr = Object.values(parsedTasks);

const form = document.body.querySelector(".form");
const input = document.body.querySelector(".input");
const taskList = document.body.querySelector(".task-list");

const allButton = document.body.querySelector(".all");
const activeButton = document.body.querySelector(".active");
const comletedButton = document.body.querySelector(".comleted");

const resetInput = () => {
  input.value = "";
};
let liCount = 1;
const createNewTask = (isCompleted, defaultKey, text, isSkip = false) => {
  const key = defaultKey || Date.now();
  //1. create empty li
  const li = document.createElement("li");
  li.classList.add("task-element");
  li.setAttribute("data-key", key);
  li.classList.add("task-element");

  if (filterStatus === "comleted") {
    li.hidden = true;
  }

  //2. create btn for change status li
  const liComplitedBtn = document.createElement("input");
  liComplitedBtn.classList.add("task-status-btn");
  liComplitedBtn.setAttribute("data-key", key);
  liComplitedBtn.type = "checkbox";

  if (isCompleted) {
    liComplitedBtn.setAttribute("checked", true);
  } else {
    liComplitedBtn.removeAttribute("checked");
  }

  const liNumerationSpan = document.createElement("span");
  liNumerationSpan.setAttribute("data-key", key);
  liNumerationSpan.classList.add("li-number");
  liNumerationSpan.textContent = `${liCount}. `;

  liCount++;

  //3. create span for li (task text)
  const liTaskText = document.createElement("span");
  liTaskText.setAttribute("data-key", key);
  liTaskText.classList.add("task-text");
  liTaskText.textContent = text || input.value;

  if (isCompleted) {
    liTaskText.style.cssText = `
    text-decoration: line-through;
  `;
  }

  //4. create btn for remove li (task)
  const liRemoveBtn = document.createElement("button");
  liRemoveBtn.classList.add("task-remove-btn");
  liRemoveBtn.setAttribute("data-key", key);
  liRemoveBtn.textContent = "×";

  //5. push all of this elements to li
  li.append(liComplitedBtn);
  li.append(liNumerationSpan);
  li.append(liTaskText);
  li.append(liRemoveBtn);

  //6. add task info into LS
  if (!isSkip) {
    addNewTaskIntoLS({ isCompleted: false, text: input.value, key });
  }

  //7. reset text in input
  resetInput();
  //8. push li to ul
  taskList.append(li);
};

if (parsedTasks && parsedTasksArr.length) {
  parsedTasksArr.forEach(({ isCompleted, key, text }) => {
    createNewTask(isCompleted, key, text, true);
  });
}

const hideLiBySelector = (selector) => {
  return (e) => {
    filterStatus = e.target.getAttribute("data-status");
    LS.setItem(
      "filterStatus",
      JSON.stringify(e.target.getAttribute("data-status"))
    );

    const listOfLi = document.body.querySelectorAll("li");
    listOfLi.forEach((li) => {
        li.style.cssText = `
        display: flex;
        `;
    });

    const listCompletedTasks = document.body.querySelectorAll(selector);

    listCompletedTasks.forEach((checkbox) => {
      const key = checkbox.getAttribute("data-key");

      const li = document.body.querySelector(`li[data-key="${key}"]`);


        li.style.cssText = `
        display: none;
        `;
    });
  };
};

const showAllTasks = (e) => {
  filterStatus = e.target.getAttribute("data-status");
  LS.setItem(
    "filterStatus",
    JSON.stringify(e.target.getAttribute("data-status"))
  );

  const listOfLi = document.body.querySelectorAll("li");

  listOfLi.forEach((li) => {
      li.style.cssText = `
      display: flex;
      `
  });
};

form.addEventListener("submit", () => createNewTask());

taskList.addEventListener("click", (e) => {
  const oldTasks = JSON.parse(LS.getItem("tasks"));

  if (e.target.classList.contains("task-remove-btn")) {
    const key = e.target.getAttribute("data-key");

    delete oldTasks[key];

    LS.setItem("tasks", JSON.stringify(oldTasks));

    const li = document.body.querySelector(`li[data-key="${key}"]`);

    li.remove();
  }

  if (e.target.classList.contains("task-status-btn")) {
    const key = e.target.getAttribute("data-key");

    const editedTask = {
      ...oldTasks[key],
      isCompleted: !oldTasks[key].isCompleted,
    };

    LS.setItem(
      "tasks",
      JSON.stringify({
        ...oldTasks,
        [key]: editedTask,
      })
    );

    const span = document.body.querySelector(`span[data-key="${key}"]`).nextElementSibling;;
    const check = document.body.querySelector(`span[data-key="${key}"]`).previousElementSibling;
    if (check.checked) {
    span.style.cssText = `
      text-decoration: line-through;
    `;
    } else {
      span.style.cssText = `
      text-decoration: none;
    `;
    }
  }
});

activeButton.addEventListener("click", hideLiBySelector("li > input:checked"));

comletedButton.addEventListener(
  "click",
  hideLiBySelector("li > input:not(:checked)")
);

allButton.addEventListener("click", (e) => showAllTasks(e));

function addNewTaskIntoLS({ isCompleted, text, key }) {
  const oldTasksFromLS = JSON.parse(LS.getItem("tasks"));

  LS.setItem(
    "tasks",
    JSON.stringify({
      ...oldTasksFromLS,
      [key]: { isCompleted, text, key },
    })
  );
}
