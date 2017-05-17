const snakeCase = require('snake-case');
const isPlainObject = require('is-plain-object');
const isDotNotation = key => (/\./).test(key);

const snakeobj = (data, exclude = []) => {
  if (Array.isArray(data)) return data.map(item => snakeobj(item, exclude));
  if (!isPlainObject(data)) return data;

  const transform = () => Object.keys(data).reduce(applySnakeCase, {});

  const applySnakeCase = (result, key) => {
    const newKey = buildNewKey(key);
    if (isPlainObject(data[key])) return snakeDeepObject(newKey, result, data[key]);
    if (Array.isArray(data[key])) return snakeArray(newKey, result, data[key]);
    return snakeProperty(newKey, result, data[key]);
  };

  const buildNewKey = key => {
    if (isDotNotation(key)) return snakeDotNotation(key);
    return shouldTransform(key) ? snakeCase(key) : key;
  };

  const snakeDotNotation = key => key.split('.').map(snakeCase).join('.');

  const shouldTransform = key => !isException(key);

  const isException = (key) => exclude.indexOf(key) > -1;

  const snakeDeepObject = (newKey, result, data) => {
    const func = () => snakeobj(data, exclude);
    return applyOnResult(newKey, result, func);
  };

  const snakeArray = (newKey, result, dataArr) => {
    const func = () => dataArr.map(item => snakeobj(item, exclude));
    return applyOnResult(newKey, result, func);
  };

  const snakeProperty = (newKey, result, data) => {
    const func = () => data;
    return applyOnResult(newKey, result, func);
  };

  const applyOnResult = (newKey, result, func) => {
    const partial = {};
    partial[newKey] = func();
    return Object.assign({}, result, partial);
  };

  return transform();
};

module.exports = snakeobj;
