const snakeCase = require('snake-case');
const isPlainObject = require('is-plain-object');

const snakeobj = (data, exceps) => {
  if (!isPlainObject(data)) return;

  return Object.keys(data).reduce((result, key) => {
    const newKey = isException(key, exceps || []) ? key : snakeCase(key);
    if (isPlainObject(data[key])) return snakeDeepObject(newKey, result, data[key], exceps);
    if (Array.isArray(data[key])) return snakeArray(newKey, result, data[key], exceps);
    return snakePropery(newKey, result, data[key]);
  }, {});
};

const isException = (key, exceps) => exceps.includes(key);

const snakeDeepObject = (newKey, result, data, exceps) => {
  const func = () => snakeobj(data, exceps);
  return applyOnResult(newKey, result, func);
};

const snakeArray = (newKey, result, dataArr, exceps) => {
  const func = () => dataArr.map(item => snakeobj(item, exceps));
  return applyOnResult(newKey, result, func);
};

const snakePropery = (newKey, result, data) => {
  const func = () => data;
  return applyOnResult(newKey, result, func);
};

const applyOnResult = (newKey, result, func) => {
  const partial = {};
  partial[newKey] = func();
  return Object.assign({}, result, partial);
};

module.exports = snakeobj;
