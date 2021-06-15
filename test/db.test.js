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