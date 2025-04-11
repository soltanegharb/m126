// var Name = "mamad";
const age = 20;
let Name2 = "ahmad";
const myInfo = {
  name: "omid",
  job: true,
};
console.log(myInfo.name);
const myList = ["omid", "sleep", false, myInfo];
console.log(myList[2]);

function sayHi(name) {
  alert(name + "👋");
}
const sayBay = function (name) {
  console.log(name + "👍");
};

const numbers = () => prompt("plz add your numbers");

// sayHi("mamad");
// sayBay("omid");

// const result = numbers();
// console.log(result);

// BACKEND REQUESTS
const BASE_URL = "https://www.omidfaryabi.ir/api/todo";

const createTodo = (todo) => {
  const headers = {};
  const userId = getUserId();
  if (userId) {
    headers["X-User-id"] = userId;
  }
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(todo),
    headers,
  })
    .then((res) => res.json())
    .then((data) => {
      renderTodos(userId ? [data] : [data.todo]);
      userId || localStorage.setItem("userId", data.userId);
    });
};
const getTodo = (userId) => {
  fetch(BASE_URL, {
    headers: {
      "X-User-id": userId,
    },
  })
    .then((res) => res.json())
    .then((data) => renderTodos(data, true));
};
const deleteTodo = (userId, todoId) => {
  fetch(BASE_URL, {
    method: "DELETE",
    headers: {
      "X-User-id": userId,
    },
    body: JSON.stringify({ id: todoId }),
  })
    .then((res) => res.json())
    .then(() => {
      getTodo(userId);
      alert("با موفقیت پاک شد");
    });
};
const patchTodo = (userId, todoId, isDone) => {
  fetch(BASE_URL, {
    method: "PATCH",
    headers: {
      "X-User-id": userId,
    },
    body: JSON.stringify({ id: todoId, is_done: isDone }),
  })
    .then((res) => res.json())
    .then(() => {
      getTodo(userId);
    });
};

// DOM
const todoForm = document.getElementById("todo-form");
const todoTable = document.getElementById("todo-table");

// let todos = [];

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = event.target.title.value;
  const description = event.target.description.value;

  if (title === "" || description === "") return alert("نمی تواند خالی باشد");

  // todos.push({ title, description, id: crypto.randomUUID() });
  createTodo({ title, description });
  todoForm.reset();
  // renderTodos(todos);
});
function renderTodos(todoList, clearTable) {
  if (clearTable) {
    todoTable.innerHTML = "";
  }

  todoList.forEach((todo) => {
    console.log(todo);
    todoTable.innerHTML += `
    <tr id=${todo.id} class="text-center pt-1">
         <th scope="row">${todo.id}</th>
         <td>${todo.title}</td>
         <td>${todo.description}</td>
         <td>
           <div
             class="btn-group"
             role="group"
             aria-label="Basic mixed styles example"
           >
             <button type="button" class="btn btn-danger" onclick=deleteTodo("${getUserId()}","${
      todo.id
    }")>حذف</button>
             <button type="button" class="btn btn-warning">ادیت</button>
             <button type="button" class="btn ${
               todo.is_done ? "btn-success" : "btn-info"
             }" onclick=patchTodo("${getUserId()}","${
      todo.id
    }","${!todo.is_done}")>${todo.is_done ? "انجام شد" : "انجام بده"}</button>
           </div>
         </td>
       </tr>
`;
  });
  // for (const todo of todoList) {
  // }
}

// utils
function getUserId() {
  return localStorage.getItem("userId");
}

getTodo(getUserId());
