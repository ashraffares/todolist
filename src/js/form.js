import dbFactory from './db';
import storage from './storage';

const db = dbFactory.create(storage);
const projects = db.getProjects();
if (projects.length <= 0) {
  db.addProject('Main');
  projects.push('Main');
}

const overlay = document.querySelector('.overlay');

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
            <p>Hight: ${todo.proirity}</p>
            <p>date: ${todo.duedate}</p>
            <p>description: ${todo.description}</p>
        </div>
    </div>`;
  overlayinfo.innerHTML = infobody;
  document.body.appendChild(overlayinfo);
  overlayinfo.style.display = 'block';
};

const addToDo = todo => {
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
  cardbody.appendChild(info);
  cardbody.appendChild(edit);
  cardbody.appendChild(btndelete);

  card.appendChild(cardheader);
  card.appendChild(cardbody);
  document.querySelector('.sideright').appendChild(card);
};

export default function ToDoForm() {
  const ul = document.querySelector('.sideleft-ul');
  const form = document.querySelector('.form');
  const sideright = document.querySelector('.sideright');

  function Todo(title, description, duedate, proirity, isDone) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.proirity = proirity;
    this.isDone = isDone;
  }

  const getFormData = (form) => {
    const title = form.querySelector('#title').value;
    const description = form.querySelector('#description').value;
    const date = form.querySelector('#date').value;
    const project = form.querySelector('#proj').value;
    const priority = form.querySelector('#priority').value;

    const todo = new Todo(title, description, date, priority, false);

    db.addItem(todo, project);
    if (!projects.includes(project)) {
      db.addProject(project);
    }
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    getFormData(form);
    overlay.style.display = 'none';
  };

  projects.forEach((proj) => {
    const option = document.createElement('option');
    option.value = proj;
    option.textContent = proj;
    document.querySelector('datalist').appendChild(option);
  });

  document.querySelector('.todoform').onclick = () => {
    overlay.style.display = 'block';
  };

  document.querySelector('.form-close').onclick = () => {
    overlay.style.display = 'none';
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