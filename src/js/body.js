import '../css/style.css';
import storage from './storage';
import dbFactory from './db';
import Todo from './todo';

const db = dbFactory.create(storage);
const projects = db.getProjects();
if (projects.length <= 0) {
  db.addProject('main');
  projects.push('main');
}

function createTodoForm(addToDo) {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  const form = document.createElement('form');
  form.classList.add('form');
  overlay.append(form);

  const formH = document.createElement('div');
  formH.classList.add('form-h');
  form.append(formH);

  const formTitle = document.createElement('h2');
  formTitle.classList.add('form-title');
  formTitle.textContent = 'New Task';
  formH.append(formTitle);

  const formClose = document.createElement('span');
  formClose.classList.add('form-close');
  formClose.textContent = 'X';
  formH.append(formClose);
  formClose.onclick = () => { overlay.style.display = 'none'; };

  form.append(document.createElement('hr'));

  const formDivContainer = document.createElement('div');
  formDivContainer.classList.add('formdivcontainer');
  form.append(formDivContainer);

  const formDiv1 = document.createElement('div');
  formDiv1.classList.add('formdiv');
  formDivContainer.append(formDiv1);

  const titleLabel = document.createElement('label');
  titleLabel.classList.add('label');
  titleLabel.htmlFor = 'title';
  titleLabel.textContent = 'Title';
  formDiv1.append(titleLabel);

  const title = document.createElement('input');
  title.setAttribute('required', true);
  title.type = 'text';
  title.id = 'title';
  title.classList.add('inputs');
  formDiv1.append(title);

  const descriptionLabel = document.createElement('label');
  descriptionLabel.classList.add('label');
  descriptionLabel.htmlFor = 'description';
  descriptionLabel.textContent = 'Description';
  formDiv1.append(descriptionLabel);

  const description = document.createElement('textarea');
  description.setAttribute('required', true);
  description.id = 'description';
  description.setAttribute('rows', '7');
  description.classList.add('inputs');
  formDiv1.append(description);

  const formDiv2 = document.createElement('div');
  formDiv2.classList.add('formdiv');
  formDivContainer.append(formDiv2);

  const dateLabel = document.createElement('label');
  dateLabel.classList.add('label');
  dateLabel.htmlFor = 'date';
  formDiv2.append(dateLabel);

  const date = document.createElement('input');
  date.setAttribute('required', true);
  date.type = 'date';
  date.id = 'date';
  date.classList.add('inputs');
  formDiv2.append(date);

  const projectLabel = document.createElement('label');
  projectLabel.classList.add('label');
  projectLabel.htmlFor = 'project';
  projectLabel.textContent = 'Project';
  formDiv2.append(projectLabel);

  const project = document.createElement('input');
  project.setAttribute('list', 'projects');
  project.setAttribute('required', true);
  project.classList.add('inputs');
  project.id = 'project';
  formDiv2.append(project);

  const datalist = document.createElement('datalist');
  datalist.id = 'projects';

  formDiv2.append(datalist);

  projects.forEach((proj) => {
    const option = document.createElement('option');
    option.value = proj;
    option.textContent = proj;
    datalist.append(option);
  });

  const priorityLabel = document.createElement('label');
  priorityLabel.classList.add('label');
  priorityLabel.htmlFor = 'priority';
  priorityLabel.textContent = 'Priority';
  formDiv2.append(priorityLabel);

  const priority = document.createElement('select');
  priority.setAttribute('required', true);
  priority.classList.add('inputs');
  priority.id = 'priority';
  formDiv2.append(priority);

  const priorityOption1 = document.createElement('option');
  priorityOption1.value = '1';
  priorityOption1.textContent = 'Low';
  priority.append(priorityOption1);

  const priorityOption2 = document.createElement('option');
  priorityOption2.value = '2';
  priorityOption2.textContent = 'Medium';
  priority.append(priorityOption2);

  const priorityOption3 = document.createElement('option');
  priorityOption3.value = '3';
  priorityOption3.textContent = 'High';
  priority.append(priorityOption3);

  const submitButton = document.createElement('button');
  submitButton.classList.add('button');
  submitButton.textContent = 'Create Task';
  form.append(submitButton);

  form.onsubmit = (e) => {
    e.preventDefault();
    const todo = new Todo(title.value, description.value, date.value, priority.value, false);
    db.addItem(todo, project.value);
    overlay.style.display = 'none';
    addToDo(todo, project.value);
  };

  return overlay;
}

export default function main() {
  const nav = document.createElement('div');
  nav.classList.add('nav');

  const h2 = document.createElement('h2');
  h2.classList.add('navh2');
  h2.textContent = 'ToDo';

  const button = document.createElement('button');
  button.classList.add('todoform');
  button.textContent = '+';

  nav.appendChild(h2);
  nav.appendChild(button);

  const main = document.createElement('div');
  main.classList.add('main');

  const sideleft = document.createElement('div');
  sideleft.classList.add('sideleft');

  const sideleftul = document.createElement('ul');
  sideleftul.classList.add('sideleft-ul');

  const sideleftli = document.createElement('li');

  sideleftul.appendChild(sideleftli);
  sideleft.appendChild(sideleftul);

  const sideright = document.createElement('div');
  sideright.classList.add('sideright');

  const siderightul = document.createElement('ul');
  sideright.appendChild(siderightul);

  main.appendChild(sideleft);
  main.appendChild(sideright);
  const parent = document.getElementById('parent');
  parent.appendChild(nav);
  parent.appendChild(main);

  let selectedProject = null;

  const addToDo = (todo, project) => {
    if (selectedProject === project) {
      const li = document.createElement('li');

      const title = document.createElement('span');
      title.textContent = todo.title;

      const date = document.createElement('span');
      date.textContent = todo.duedate;

      const edit = document.createElement('button');
      edit.textContent = 'Edit';

      const info = document.createElement('button');
      info.textContent = 'info';

      const btndelete = document.createElement('button');
      btndelete.onclick = () => {
        db.deleteItem(todo.id);
        window.location.reload();
      };
      btndelete.textContent = 'delete';
      li.appendChild(title);
      li.appendChild(date);
      li.appendChild(info);
      li.appendChild(edit);
      li.appendChild(btndelete);

      siderightul.appendChild(li);
    }
  };

  const addProject = (project) => {
    const pli = document.createElement('li');
    pli.classList.add('sideleftli');
    pli.textContent = project;
    sideleftul.appendChild(pli);
    pli.onclick = () => {
      selectedProject = project;
      siderightul.innerHTML = '';
      const todos = db.getAll(project);
      todos.forEach(todo => {
        addToDo(todo, project);
      });
    };
  };

  const projects = db.getProjects();
  projects.forEach(proj => {
    addProject(proj);
  });

  const todoForm = createTodoForm(addToDo);
  parent.appendChild(todoForm);
  button.addEventListener('click', () => {
    todoForm.style.display = 'block';
  });
}
