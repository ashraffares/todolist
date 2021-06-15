import { jest } from '@jest/globals';
import dbFactory from '../src/js/db';
​
const storageFactory = (() => ({
  create: () => ({
    getItems: () => {},
    setItems: () => {},
    getProjects: () => {},
    setProjects: () => {},
    getLastIndex: () => {},
    setLastIndex: () => {},
  }),
}))();

const TestTodo = (title, description, date, priority, isDone) => ({
    title, description, date, priority, isDone,
  });


  describe('DB', () => {
    describe('create', () => {
      it('retrieves last saved id', () => {
        const callback = jest.fn();
        const storage = storageFactory.create();
        storage.getLastIndex = callback;
        dbFactory.create(storage);
        expect(callback).toHaveBeenCalled();
      });
  ​
      it('correctly sets up projects', () => {
        const storage = storageFactory.create();
        const projects = ['proj 1', 'proj 2'];
        storage.getProjects = () => JSON.stringify(projects);
        const db = dbFactory.create(storage);
        expect(db.getProjects()).toStrictEqual(projects);
      });
  ​
      it('correctly sets up todos', () => {
        const storage = storageFactory.create();
        const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
        const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
        todo1.id = 1;
        todo1.project = 'Main';
        todo2.id = 2;
        todo2.project = 'Main';
        const items = [todo1, todo2];
        storage.getItems = () => JSON.stringify(items);
        const db = dbFactory.create(storage);
        expect(db.getAll()).toStrictEqual(items);
      });
    });

    ​
  describe('get', () => {
    it('retrieves an item with given id', () => {
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      todo2.id = 2;
      todo2.project = 'Main';
      const items = [todo1, todo2];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      expect(db.get(2)).toStrictEqual(todo2);
    });
  });

  describe('getAll', () => {
    it('retrieves all items in database', () => {
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      todo2.id = 2;
      todo2.project = 'Main';
      const items = [todo1, todo2];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      expect(db.getAll()).toStrictEqual(items);
    });
​
    it('retrieves all items belonging to given group', () => {
      const project = 'Common';
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      const todo3 = TestTodo('Title 3', 'Description 3', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = project;
      todo2.id = 2;
      todo2.project = 'Main';
      todo3.id = 3;
      todo3.project = project;
      const items = [todo1, todo2, todo3];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      expect(db.getAll(project)).toStrictEqual([todo1, todo3]);
    });
  });
​
  describe('getProjects', () => {
    it('correctly retrieves all saved projects', () => {
      const storage = storageFactory.create();
      const projects = ['proj 1', 'proj 2'];
      storage.getProjects = () => JSON.stringify(projects);
      const db = dbFactory.create(storage);
      expect(db.getProjects()).toStrictEqual(projects);
    });
​
    it('correctly retrieves all projects after modifications', () => {
      const storage = storageFactory.create();
      const projects = ['proj 1', 'proj 2'];
      storage.getProjects = () => JSON.stringify(projects);
      const db = dbFactory.create(storage);
      const proj3 = 'proj 3';
      db.addProject(proj3);
      projects.push(proj3);
      expect(db.getProjects()).toStrictEqual(projects);
    });
  });

  describe('addItem', () => {
    it('saves items to storage', () => {
      const mock = jest.fn();
      const storage = storageFactory.create();
      storage.setItems = mock;
      const db = dbFactory.create(storage);
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      db.addItem(todo1);
      expect(mock).toBeCalledWith(JSON.stringify([todo1]));
    });
​
    it('modifies returned items to reflect changes', () => {
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      todo2.id = 2;
      todo2.project = 'Main';
      const items = [todo1, todo2];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
​
      const todo3 = TestTodo('Title 3', 'Description 3', '11/06/2021', 'Low', false);
      todo3.id = 3;
      todo3.project = 'Main';
      items.push(todo3);
      db.addItem(todo3);
​
      expect(db.getAll()).toStrictEqual(items);
    });
​
    it('raises itemsChangedEvent after adding todo', () => {
      const mock = jest.fn();
      const storage = storageFactory.create();
      const db = dbFactory.create(storage);
      db.addOnItemsChange(mock);
      const todo = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo.id = 1;
      todo.project = 'Main';
      db.addItem(todo);
      expect(mock).toBeCalled();
    });
  });
​
  describe('addProject', () => {
    it('saves projects to storage', () => {
      const mock = jest.fn();
      const storage = storageFactory.create();
      storage.setProjects = mock;
      const db = dbFactory.create(storage);
      const project = 'Project 1';
      db.addProject(project);
      expect(mock).toBeCalledWith(JSON.stringify([project]));
    });
​
    it('modifies projects to reflect changes', () => {
      const storage = storageFactory.create();
      const projects = ['Project 1', 'Project 2'];
      storage.getProjects = () => JSON.stringify(projects);
      const db = dbFactory.create(storage);
​
      const project = 'Project 3';
      projects.push(project);
      db.addProject(project);
​
      expect(db.getProjects()).toStrictEqual(projects);
    });
  });
​
  describe('update', () => {
    it('saves items to storage', () => {
      const mock = jest.fn();
      const storage = storageFactory.create();
      storage.setItems = mock;
      const todo = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo.id = 1;
      todo.project = 'Main';
      const items = [todo];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      todo.description = 'A new Description';
      db.update(todo);
      expect(mock).toBeCalledWith(JSON.stringify(items));
    });
​
    it('modifies returned items to reflect updates', () => {
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      todo2.id = 2;
      todo2.project = 'Main';
      const items = [todo1, todo2];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
​
      todo2.isDone = true;
      db.update(todo2);
​
      expect(db.getAll()).toStrictEqual(items);
    });
​
    it('raises itemsChangedEvent after updating item', () => {
      const mock = jest.fn();
      const todo = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo.id = 1;
      todo.project = 'Main';
      const items = [todo];
      const storage = storageFactory.create();
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      db.addOnItemsChange(mock);
      todo.title = 'Another Title';
      db.update(todo);
      expect(mock).toBeCalled();
    });
  });
​
  describe('deleteItem', () => {
    it('saves items to storage after deletion', () => {
      const mock = jest.fn();
      const storage = storageFactory.create();
      storage.setItems = mock;
      const todo = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo.id = 1;
      todo.project = 'Main';
      const items = [todo];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
      db.deleteItem(todo.id);
      expect(mock).toBeCalledWith(JSON.stringify([]));
    });
​
    it('modifies returned items to reflect deletions', () => {
      const storage = storageFactory.create();
      const todo1 = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      const todo2 = TestTodo('Title 2', 'Description 2', '11/06/2021', 'Low', false);
      todo1.id = 1;
      todo1.project = 'Main';
      todo2.id = 2;
      todo2.project = 'Main';
      const items = [todo1, todo2];
      storage.getItems = () => JSON.stringify(items);
      const db = dbFactory.create(storage);
​
      db.deleteItem(todo1.id);
​
      expect(db.getAll()).toStrictEqual([todo2]);
    });
​
    it('raises itemsChangedEvent after deleting todo', () => {
      const mock = jest.fn();
      const todo = TestTodo('Title 1', 'Description 1', '11/06/2021', 'Low', false);
      todo.id = 1;
      todo.project = 'Main';
      const storage = storageFactory.create();
      storage.getItems = () => JSON.stringify([todo]);
      const db = dbFactory.create(storage);
      db.addOnItemsChange(mock);
      db.deleteItem(todo.id);
      expect(mock).toBeCalled();
    });
  });
});
​