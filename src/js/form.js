import dbFactory from './db';
import storage from './storage';
import Todo from './todo';

const db = dbFactory.create(storage);
const projects = db.getProjects();
if (projects.length <= 0) {
  db.addProject('Main');
  projects.push('Main');
}

const todoForm = (() => {
  const overlay = document.querySelector('.overlay');
  const form = document.querySelector('.form');
  const titleInput = form.querySelector('#title');
  const descriptionInput = form.querySelector('#description');
  const dateInput = form.querySelector('#date');
  const projectInput = form.querySelector('#proj');
  const priorityInput = form.querySelector('#priority');

  const show = (callback, todo) => {
    overlay.style.display = 'block';
    if (todo) {
      titleInput.value = todo.title;
      descriptionInput.value = todo.description;
      priorityInput.value = todo.priority;
      dateInput.value = todo.duedate;
      projectInput.value = todo.project;
    } else {
      titleInput.value = '';
      descriptionInput.value = '';
      priorityInput.value = '';
      dateInput.value = '';
      projectInput.value = '';
    }
    form.onsubmit = () => {
      overlay.style.display = 'block';
      form.onsubmit = null;
      const project = projectInput.value;
      if (!projects.includes(project)) {
        db.addProject(project);
      }
      const todo = new Todo(
        titleInput.value, descriptionInput.value, dateInput.value, priorityInput.value, false
      );
      callback({
        todo,
        project,
      });
    };
  };

  return {
    show,
    close: () => {
      overlay.style.display = 'none';
      form.onsubmit = null;
    },
  };
})();

const displayinfo = todo => {
  const overlayinfo = document.createElement('div');
  overlayinfo.classList.add('overlay');
  const infobody = `
    <div class='info'>
        <div class="info-content">
            <div class="form-h">
                <h2 class="form-title infoh2">${todo.title}</h2>
                <span class="btninfo" onclick='document.location.reload();'>X</span>
            </div>
            <p>project: ${todo.project}</p>
            <p>Hight: ${todo.priority}</p>
            <p>date: ${todo.duedate}</p>
            <p>description: ${todo.description}</p>
        </div>
    </div>`;
  overlayinfo.innerHTML = infobody;
  document.body.appendChild(overlayinfo);
  overlayinfo.style.display = 'block';
};

const addToDo = (todo) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('m-3');
  const cardheader = document.createElement('div');
  cardheader.classList.add('card-header');
  const cardbody = document.createElement('div');
  cardbody.classList.add('card-body');

  const title = document.createElement('h4');
  title.textContent = todo.title;
  title.style.display = 'inline';

  const date = document.createElement('span');
  date.textContent = todo.duedate;

  const description = document.createElement('p');
  description.textContent = todo.description;
  description.classList.add('card-text');

  const priorty = document.createElement('span');
  priorty.textContent = todo.priorty;

  const controls = document.createElement('div');
  controls.classList.add('controls');

  const info = document.createElement('button');
  info.textContent = 'Info';
  info.classList.add('btn');
  info.classList.add('btn-info');
  info.onclick = () => {
    displayinfo(todo);
  };

  const edit = document.createElement('button');
  edit.textContent = 'Edit';
  edit.classList.add('btn');
  edit.classList.add('btn-primary');
  edit.onclick = () => {
    todoForm.show((form) => {
      const temp = form.todo;
      temp.id = todo.id;
      temp.project = form.project;
      db.update(temp);
    }, todo);
  };

  const btndelete = document.createElement('button');
  btndelete.classList.add('btn');
  btndelete.classList.add('btn-danger');
  btndelete.textContent = 'delete';
  btndelete.onclick = () => {
    db.deleteItem(todo.id);
    document.location.reload();
  };

  cardheader.appendChild(title);
  cardheader.appendChild(date);

  cardbody.appendChild(description);
  cardbody.appendChild(priorty);
  cardbody.append(controls);
  controls.appendChild(info);
  controls.appendChild(edit);
  controls.appendChild(btndelete);

  card.appendChild(cardheader);
  card.appendChild(cardbody);
  document.querySelector('.sideright').appendChild(card);
};

export default function ToDoForm() {
  const ul = document.querySelector('.sideleft-ul');
  const sideright = document.querySelector('.sideright');

  projects.forEach((proj) => {
    const option = document.createElement('option');
    option.value = proj;
    option.textContent = proj;
    document.querySelector('datalist').appendChild(option);
  });

  document.querySelector('.todoform').onclick = () => {
    todoForm.show((form) => {
      db.addItem(form.todo, form.project);
    });
  };

  document.querySelector('.form-close').onclick = () => {
    todoForm.close();
  };

  projects.forEach((proj) => {
    const li = document.createElement('li');
    li.classList.add('sideleftli');
    li.textContent = proj;
    li.onclick = () => {
      sideright.textContent = '';
      db.getAll(proj).forEach((todo) => {
        addToDo(todo);
      });
    };
    ul.appendChild(li);
  });
}
