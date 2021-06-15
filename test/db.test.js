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