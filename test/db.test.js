import dbFactory from '../src/js/db';
import storage from '../src/js/storage';
import Todo from '../src/js/todo';

const db = dbFactory.create(storage);
const todo = new Todo('mytitle', 'mydescription', '14/6/2021', 'high', false);

it('set item to database', () => expect(db.addItem(todo, 'testproj')).toBe(1));