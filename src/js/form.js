import dbFactory from './db';
import storage from './storage';
import Todo from './todo';

const db = dbFactory.create(storage);
const projects = db.getProjects();

const todosContainer = document.querySelector('.sideright');
let selectedProject;

const prompt = (() => {
  const screen = document.createElement('div');
  screen.classList.add('screen-cover', 'center-child');
  const dim = document.createElement('div');
  dim.classList.add('dim', 'screen-cover');
  screen.append(dim);
  const body = document.createElement('div');
  body.classList.add('center', 'confirm-box');
  screen.append(body);

  const content = document.createElement('div');
  content.classList.add('message');
  content.innerHTML = 'This project will be deleted.<br>Do you wish to continue?';
  body.append(content);

  const controls = document.createElement('div');
  controls.classList.add('confirm-controls');
  body.append(controls);

  const yesBtn = document.createElement('button');
  yesBtn.textContent = 'YES';
  controls.append(yesBtn);
  const noBtn = document.createElement('button');
  noBtn.textContent = 'Cancel';
  controls.append(noBtn);

  return {
    confirm: (callback) => {
      yesBtn.onclick = () => {
        yesBtn.onclick = null;
        noBtn.onclick = null;
        screen.remove();
        callback(true);
      };
      noBtn.onclick = () => {
        yesBtn.onclick = null;
        noBtn.onclick = null;
        screen.remove();
        callback(false);
      };
      document.body.append(screen);
    },
  };
})();

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

    form.onsubmit = (evt) => {
      evt.preventDefault();
      overlay.style.display = 'none';
      form.onsubmit = null;
      const project = projectInput.value;
      if (!projects.includes(project)) {
        db.addProject(project);
      }
      const todo = new Todo(
        titleInput.value, descriptionInput.value, dateInput.value, priorityInput.value, false,
      );
      callback({ todo, project });
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
  overlayinfo.classList.add('overlay0');
  const infobody = `
    <div class='info' id="info-con">
        <div class="info-content">
            <div class="form-h">
                <h2 class="form-title infoh2">${todo.title}</h2>
                <span class="btninfo">X</span>
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
  document.querySelector('.btninfo').addEventListener('click', () => { document.querySelector('.overlay0').remove(); });
};

const addToDo = (todo) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add(todo.priority);

  const title = document.createElement('h3');
  title.textContent = todo.title;
  title.style.display = 'inline';

  const date = document.createElement('span');
  date.textContent = todo.duedate;

  const description = document.createElement('p');
  description.textContent = todo.description;
  description.classList.add('card-text');

  const priorty = document.createElement('span');
  priorty.textContent = todo.priority;

  const controls = document.createElement('div');
  controls.classList.add('controls');

  const info = document.createElement('button');
  info.textContent = 'Info';
  info.onclick = () => {
    displayinfo(todo);
  };

  const edit = document.createElement('button');
  edit.textContent = 'Edit';
  edit.onclick = () => {
    todoForm.show((form) => {
      const temp = form.todo;
      temp.id = todo.id;
      temp.project = form.project;
      db.update(temp);
    }, todo);
  };

  const btndelete = document.createElement('button');
  btndelete.textContent = 'delete';
  btndelete.onclick = () => {
    db.deleteItem(todo.id);
  };
  controls.appendChild(date);
  controls.appendChild(info);
  controls.appendChild(edit);
  controls.appendChild(btndelete);

  card.appendChild(title);
  card.append(controls);

  todosContainer.append(card);
};

const selectProject = (li) => {
  if (selectedProject && selectedProject !== li) {
    selectedProject.classList.remove('selected');
  }
  selectedProject = li;
  selectedProject.classList.add('selected');
  todosContainer.innerHTML = '';
  db.getAll(li.textContent).forEach((todo) => addToDo(todo));
};

export default function ToDoForm() {
  const projectsHelper = (() => {
    const ul = document.querySelector('.sideleft-ul');
    const addProject = (project) => {
      const li = document.createElement('li');
      const dproj = document.createElement('span');
      dproj.classList.add('dproj');
      li.classList.add('sideleftli');
      li.textContent = project;

      if (project !== 'Main') {
        li.appendChild(dproj);
      }
      dproj.onclick = () => {
        prompt.confirm((response) => {
          if (response) {
            db.getAll(project).forEach((p) => {
              db.deleteItem(p.id);
            });
            db.deleteProject(project);
            li.remove();
          }
        });
      };
      li.onclick = () => {
        selectProject(li);
      };
      ul.appendChild(li);
      return li;
    };

    const getProject = (project) => {
      const all = ul.childNodes;
      for (let i = 0; i < all.length; i += 1) {
        if (all[i].textContent === project) {
          return all[i];
        }
      }
      return null;
    };

    return {
      DOM: ul,
      addProject,
      getProject,
    };
  })();

  projects.forEach((proj) => {
    const option = document.createElement('option');
    option.value = proj;
    option.textContent = proj;
    document.querySelector('datalist').appendChild(option);
  });

  document.querySelector('.todoform').onclick = () => {
    todoForm.show((form) => {
      let li = projectsHelper.getProject(form.project);
      if (!li) {
        li = projectsHelper.addProject(form.project);
      }
      selectedProject = li;
      db.addItem(form.todo, form.project);
    });
  };

  document.querySelector('.form-close').onclick = () => {
    todoForm.close();
  };

  projects.forEach((proj) => {
    projectsHelper.addProject(proj);
  });
}

db.addOnItemsChange(() => {
  selectProject(selectedProject);
});
