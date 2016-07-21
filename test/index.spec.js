const {suite} = require('suitape');
const snakeobj = require('./../index');

suite('snakeobj object', (test) => {
  test('Returns same as input if input is not an object', (assert) => {
    [1, 'hola', true, [{a: 1}], new Date()].forEach(input => {
      const out = snakeobj(input);
      assert('equal', out, input);
    });
  });

  test('Snakeizes single property object', (assert) => {
    const input = {lastName: 'last_name'};
    const out = snakeobj(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Snakeizes multiple property object', (assert) => {
    const input = {lastName: 'last_name', name: 'name', isFullName: 'is_full_name'};
    const out = snakeobj(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Snakeizes nested objects', (assert) => {
    const input = {person: {lastName: 'doe', job: {jobTitle: 'programmer'}}};
    const out = snakeobj(input);
    assert('equal', out.person.last_name, 'doe');
    assert('equal', out.person.job.job_title, 'programmer');
  });

  test('Snakeizes nested in arrays objects', (assert) => {
    const input = {persons: [{lastName: 'doe', job: {jobTitle: 'programmer'}}]};
    const out = snakeobj(input);
    assert('equal', out.persons[0].last_name, 'doe');
    assert('equal', out.persons[0].job.job_title, 'programmer');
  });

  test('Snakeizes double nested in arrays objects', (assert) => {
    const elem = {itemsInArray: [{item: 1}, {item: 2}]};
    const elems = [Object.assign({}, elem), Object.assign({}, elem)];
    const out = snakeobj({elems});
    assert('equal', out.elems[0].items_in_array[0].item, 1);
    assert('equal', out.elems[0].items_in_array[1].item, 2);
    assert('equal', out.elems[1].items_in_array[0].item, 1);
    assert('equal', out.elems[1].items_in_array[1].item, 2);
  });

  test('Snakeizes nested dot notation objects', (assert) => {
    const input = {'persons.lastName': 'doe'};
    const out = snakeobj(input);
    assert('equal', out.persons_last_name, 'doe');
  });

  test('Snakeizes all but excented keys', (assert) => {
    const date = new Date();
    const input = {person: {birthDate: {'$gt': date}}};
    const out = snakeobj(input, ['$gt']);
    assert('equal', out.person.birth_date['$gt'], date);
  });

  test('Snakeizes all but nested in arrays excented keys', (assert) => {
    const date = new Date();
    const input = {persons: [{birthDate: {$gt: date}}, {birthDate: {$lt: date}}]};
    const out = snakeobj(input, ['$gt', '$lt']);
    assert('equal', out.persons[0].birth_date['$gt'], date);
    assert('equal', out.persons[1].birth_date['$lt'], date);
  });
});
