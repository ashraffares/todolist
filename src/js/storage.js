const ITEMS_KEY = 'todolist.storage.ITEMS_KEY';
const PROJECTS_KEY = 'todolist.storage.PROJECTS_KEY';
const AUTO_INCREMENT_KEY = 'todolist.storage.AUTO-INCREMENT-KEY';

const get = (key) => localStorage.getItem(key);
const set = (key, value) => localStorage.setItem(key, value);

const storage = {
  getItems: () => get(ITEMS_KEY),
  setItems: (value) => set(ITEMS_KEY, value),
  getProjects: () => get(PROJECTS_KEY),
  setProjects: (value) => set(PROJECTS_KEY, value),
  getLastIndex: () => get(AUTO_INCREMENT_KEY),
  setLastIndex: (value) => set(AUTO_INCREMENT_KEY, value),
};

export default storage;
