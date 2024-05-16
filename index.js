function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

const isObject = (thing) => thing !== null && typeof thing === 'object';

const isFormData = (thing) => {
  const pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

const typeOfTest = type => thing => typeof thing === type;

const isFunction = typeOfTest('function');

const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

export function formDataToJSON(formData) {
	/**
   * 递归函数 将 FormData 的键值全部插入到给 target 对象
   * @param {Array} path FormData 的属性名数组
   * @param {string} value FormData 的属性值
   * @param {Object} target 最终的目标对象
   * @param {number} index FormData 的属性值数组的索引值
   * @returns 递归是否中止的布尔值
   */
  function buildPath(path, value, target, index) {
    let name = path[index++];
		// isFinite 函数会先将测试值转换为数字，然后再对其进行是否为有限数检测。
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && Array.isArray(target) ? target.length : name;

    if (isLast) {
			// 如果检查对象具有该属性，将 value 添加到对应的数组中
      if (hasOwnProperty(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && Array.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

	// formData 参数是 FormData 类型且 formData.entries 是一个函数
  if (isFormData(formData) && isFunction(formData.entries)) {
    const obj = {};

    forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}
