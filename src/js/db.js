import mixin from './mixin';
import eventEmitter from './event-emitter';

const events = {
  ITEMS_CHANGED: 'items-changed',
};
const emitter = eventEmitter();

const create = (storage) => {
  let items = [];
  let projects = [];
  let lastIndex = (() => {
    const temp = storage.getLastIndex();
    if (temp) {
      return parseInt(temp, 10);
    }
    return 1;
  })();

  try {
    const text = storage.getItems();
    if (text) {
      const temp = JSON.parse(text);
      items = temp;
    }
  } catch (e) {
    items = [];
  }

  try {
    const text = storage.getProjects();
    if (text) {
      const temp = JSON.parse(text);
      projects = temp;
    }
  } catch (e) {
    items = [];
  }

  const get = (id) => {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id === id) {
        return items[i];
      }
    }
    return null;
  };

  const getAll = (project = null) => {
    if (!project) {
      return [...items];
    }
    return items.filter((item) => item.project === project);
  };

  const getProjects = () => [...projects];

  const addItem = (item, project) => {
    item.id = lastIndex;
    item.project = project;
    items.push(item);
    storage.setItems(JSON.stringify(items));
    const temp = lastIndex;
    lastIndex += 1;
    storage.setLastIndex(lastIndex);
    emitter.emit(events.ITEMS_CHANGED);
    return temp;
  };

  const addProject = (project) => {
    projects.push(project);
    storage.setProjects(JSON.stringify(projects));
  };

  const update = (item) => {
    let updated = false;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id === item.id) {
        items[i] = mixin({}, item);
        storage.setItems(JSON.stringify(items));
        updated = true;
        break;
      }
    }
    emitter.emit(events.ITEMS_CHANGED);
    return updated;
  };

  const deleteItem = (id) => {
    const temp = items.filter((item) => item.id !== id);
    const result = temp.length < items.length;
    items = temp;
    storage.setItems(JSON.stringify(items));
    emitter.emit(events.ITEMS_CHANGED);
    return result;
  };

  const deleteProject = (project) => {
    const temp = projects.filter((proj) => project !== proj);
    const result = temp.length < projects.length;
    projects = temp;
    storage.setProjects(projects);
    return result;
  };

  return {
    get,
    getAll,
    getProjects,
    addItem,
    addProject,
    update,
    deleteItem,
    deleteProject,
    addOnItemsChange: (callback) => emitter.subscribe(events.ITEMS_CHANGED, callback),
  };
};

export default {
  create,
};
