import '../css/style.css';
import storage from './storage';
import dbFactory from './db';

const db = dbFactory.create(storage);
const projects = db.getProjects();
if (projects.length <= 0) {
  db.addProject('main');
  projects.push('main');
}

function createProjectForm() {
  const overlayp = document.createElement('div');
  overlayp.classList.add('overlayp');

  const form = document.createElement('form');
  form.classList.add('form');

  const formh = document.createElement('div');
  formh.classList.add('form-h');

  const formtitle = document.createElement('h2');
  formtitle.classList.add('form-title');
  formtitle.textContent = 'New Task';

  const formclose = document.createElement('button');
  formclose.classList.add('form-close');
  formclose.textContent = 'X';

  formh.appendChild(formtitle);
  formh.appendChild(formclose);

  const hr = document.createElement('hr');

  const label = document.createElement('label');
  label.classList.add('label');
  label.textContent = 'Name';
  label.htmlFor = 'project';

  const inputp = document.createElement('input');
  inputp.classList.add('inputs');
  inputp.id = 'project';
  inputp.type = 'text';

  const buttonWrap = document.createElement('div');
  buttonWrap.classList.add('mt-10px');

  const buttonp = document.createElement('button');
  buttonp.classList.add('button');
  buttonp.textContent = 'Create Project';
  buttonWrap.append(buttonp);

  form.appendChild(formh);
  form.appendChild(hr);
  form.appendChild(label);
  form.appendChild(inputp);
  form.appendChild(buttonWrap);

  overlayp.appendChild(form);
  document.querySelector('#parent').appendChild(overlayp);
  return overlayp;
}

function createTodoForm() {
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

  const formClose = document.createElement('button');
  formClose.classList.add('form-close');
  formClose.textContent = 'X';
  formH.append(formClose);

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
  date.type = 'date';
  date.id = 'date';
  date.classList.add('inputs');
  formDiv2.append(date);

  const projectLabel = document.createElement('label');
  projectLabel.classList.add('label');
  projectLabel.htmlFor = 'project';
  projectLabel.textContent = 'Project';
  formDiv2.append(projectLabel);

  const project = document.createElement('select');
  project.classList.add('inputs');
  project.id = 'project';
  formDiv2.append(project);

  projects.forEach((proj) => {
    const projectOption = document.createElement('option');
    projectOption.value = proj;
    projectOption.textContent = proj;
    project.append(projectOption);
  });

  const priorityLabel = document.createElement('label');
  priorityLabel.classList.add('label');
  priorityLabel.htmlFor = 'priority';
  priorityLabel.textContent = 'Priority';
  formDiv2.append(priorityLabel);

  const priority = document.createElement('select');
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
  sideleftli.classList.add('sideleftli', 'projectform');
  sideleftli.textContent = '+ New projec';

  sideleftul.appendChild(sideleftli);
  sideleft.appendChild(sideleftul);

  const sideright = document.createElement('div');
  sideright.classList.add('sideright');

  main.appendChild(sideleft);
  main.appendChild(sideright);
  const parent = document.getElementById('parent');
  parent.appendChild(nav);
  parent.appendChild(main);

  const projectForm = createProjectForm();
  sideleftli.onclick = () => {
    projectForm.style.display = 'block';
  };

  const todoForm = createTodoForm();
  parent.appendChild(todoForm);
  button.addEventListener('click', () => {
    todoForm.style.display = 'block';
  });
}
