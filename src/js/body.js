import '../css/style.css';

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
}

function forms() {

}