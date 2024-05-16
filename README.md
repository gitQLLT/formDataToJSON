## 示例[^me]

### 对象的值是数组
```
const formData = new FormData();
formData.append('foo', '1');
formData.append('foo', '2');

const res = formDataToJSON(formData);
console.log('res', res); // -> { foo: ['1', '2'] }
```

### 对象
```
const formData = new FormData();

formData.append('foo', '1');
formData.append('bar', '2');

const res = formDataToJSON(formData);
console.log('res', res); // -> {foo: '1', bar: '2'}
```

### 嵌套对象
```
const formData = new FormData();

formData.append('foo[bar][baz]', '123');

const res = formDataToJSON(formData);
console.log('res', res); // -> { foo : { bar : {baz: '123'} } }
```


[^me]: 代码来源于axios源码1.3.5
