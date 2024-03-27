const inpTask = document.querySelector("#inp-task");
const result = document.querySelector(".result");
const form = document.querySelector("form");
const modal = document.querySelector(".modal");
const createBtn = document.querySelector(".create-btn");
const labelTask = document.querySelector("#label-task");
let modoEdition = false;
let tasks = [];

//recoger eventosubmit

document.addEventListener("DOMContentLoaded", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let value = inpTask.value;
  inpTask.value = "";

  //validar datos de entradas que este vacion o sea numero
  if (value === "" || !isNaN(value)) {
    renderModal("introdusca un nombre valido");
    return;
  }

  if (modoEdition) {
    saveChanges(value);
  } else {
    //validar que el nobre de esa tarea este diponible
    tasks.forEach((task) => {
      if (task.title === value) {
        renderModal("Ya exixte una tarea con ese nombre");
        return;
      }
    });
    //creando task obj
    const newTask = {
      title: value,
      id: Math.random().toString(36).slice(3),
      completed: false,
    };

    //guardar la tarea en el tasks
    tasks.unshift(newTask);
    renderTasks();
  }
});

//muestra las tareas
function renderTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  //limpio las tareas
  result.innerHTML = "";
  let htmlTasks = [];
  htmlTasks = tasks.map((task) => {
    return `
          <div class="task ${task.completed ? "completed" : ""}" data-id=${
      task.id
    }>
            <div class="task-info">
            <p>${task.title}</p>
            </div>
          <div class="task-actions">
            <button class="btn complet-btn">${
              task.completed ? "completed" : "complet"
            }</button>
            <button class="btn edit-btn">edit</button>
            <button class="btn delete-btn" >delete</button>
          </div>
        </div>
    
    `;
  });

  result.innerHTML = htmlTasks.join("");

  //registrar  los eventos de los actions botons
  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    if (btn.classList.contains("create-btn")) return;
    btn.addEventListener("click", (e) => {
      //obtengo el id de la tarea.
      const taskId = btn.parentElement.parentElement.getAttribute("data-id");
      //busco en mis tareas esa tarea.
      let task = tasks.find((t) => t.id === taskId);

      //determino el tipo de boton presionado
      if (btn.textContent === "edit") {
        inpTask.focus()
        // entrando en modo edicion
        //anado la clase a la tarea que se va a editar
        let taskEs = document.querySelectorAll(".task");
        taskEs.forEach((t) => {
          if (t.getAttribute("data-id") === taskId) {
            t.classList.add("editing");
          }
        });
        editTask(task);
      } else if (btn.textContent === "complet") {
        //fue completada actualizo la propiedad
        task.completed = true;
        //y la mustro las tareas,
        renderTasks();
      } else if (btn.textContent === "delete") {
        //eliminando task
        tasks = tasks.filter((task) => task.id !== taskId);
        renderTasks();
      } else if (btn.textContent === "cancel") {
        //esta en modo edicion cancela todos cambios en la interface.
        endEdition();
      }
    });
  });
}

//editando una tarea
function editTask(task) {
  modoEdition = true;
  //cambiar el label
  labelTask.textContent = "Editing...";
  labelTask.classList.add("blink");
  //cambiar el nombre de los btns create and save
  createBtn.textContent = "save";
  //obtengo todas las tareas
  let taskElments = document.querySelectorAll(".task");
  //los convierto en array para manipularlos
  taskElments = Array.from(taskElments);

  let editBtn = null;
  //busco en todas las tareas la tarea a editar
  taskElments.forEach((ele) => {
    if (ele.getAttribute("data-id") === task.id) {
      //recupera el boton edit para cmbiarle el nombre,
      editBtn = ele.querySelector(".edit-btn");
    }
  });
  editBtn.textContent = "cancel";

  //poner en monocromatico todas las tareas menos la que se esta editando y desabilitar los btns.
  const otherTaskElments = taskElments.filter(
    (t) => t.getAttribute("data-id") !== task.id
  );

  otherTaskElments.forEach((ta) => {
    ta.classList.add("disable");
    const btnsTask = ta.querySelectorAll(".btn");
    btnsTask.forEach((btn) => (btn.style.pointerEvents = "none"));
  });

  //cargar el valor de titulo en el input
  inpTask.value = task.title;
  //ahora espera que se submita el form
}

//guardas los cambios echos a la tarea encuestion
function saveChanges(data) {
  //buscar la tara que se esta editando
  let taskId = "";
  const allTask = document.querySelectorAll(".task");
  allTask.forEach((task) => {
    if (task.classList.contains("editing")) {
      taskId = task.getAttribute("data-id");
    }
  });

  //encuentro el indixe de la tarea
  const index = tasks.findIndex((t) => t.id === taskId);
  //modifico la tarea
  console.log({ index, tasks });
  tasks[index].title = data;
  //devuelvo los cambios
  endEdition();
}

function endEdition() {
  labelTask.textContent = "new task";
  labelTask.classList.remove("blink");
  //restauro el boton create
  createBtn.textContent = "create";
  //restaurar nombres de botones edit y el
  // monocromatico de las tareas
  const allTask = document.querySelectorAll(".task");
  allTask.forEach((task) => {
    task.classList.remove("disable");
    if (task.classList.contains("editing")) {
      task.classList.remove("editing");
    }
    let btnsTask = task.querySelectorAll(".btn");
    btnsTask.forEach((btn) => {
      btn.style.pointerEvents = "all";
      if (btn.classList.contains("edit-btn")) {
        btn.textContent = "edit";
      }
    });
  });
  //limmpiar el inpTask
  inpTask.value = "";
  modoEdition = false;
  renderTasks();
}

//muestra un mensaje en la pantalla
function renderModal(mens) {
  const modalMesg = document.querySelector(".modal-mesg");
  modalMesg.textContent = mens;
  modal.classList.add("modal-show");
}

//registra el evento del boton cerrar modal
const modalBtn = document.querySelector(".btn-modal");
modalBtn.addEventListener("click", (e) => {
  console.log(modalBtn);
  modal.classList.remove("modal-show");
});
