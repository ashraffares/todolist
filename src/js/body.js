import '../css/style.css';

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

  const buttonp = document.createElement('button');
  buttonp.classList.add('button');
  buttonp.textContent = 'Create Project';

  form.appendChild(formh);
  form.appendChild(hr);
  form.appendChild(label);
  form.appendChild(inputp);
  form.appendChild(buttonp);

  overlayp.appendChild(form);
  document.querySelector('#parent').appendChild(overlayp);
  return overlayp;
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
}