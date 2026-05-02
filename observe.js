function observe(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  });
}

function defineReactive(obj, key, val) {
  observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {return val;},
    set(newVal) {
      if (delta = newVal - val){
        val = newVal;
        console.log(`${key} : ${val} (${delta})`);
        observe(newVal);
      }
    }
  });
}

const monitor = new Proxy(obj, {
  set(target, property, value, receiver) {
    val = target[property];
    (delta = value - val) && console.log(`${property} : ${val} (${delta})`);
    return Reflect.set(target, property, value, receiver);
  },
});

function checkDiff(obj0, obj1, key){
  let v0 = obj0 ? obj0[key] : undefined;
  let v1 = obj1[key];
  if (!v1 || v1 === v0) return false;
  switch(typeof v1){
    case 'string': 
      return `${v0} -> ${v1}`;
    case 'object':
      let buf = {};
      for (let k of Object.keys(v1)){
        let tmp = checkDiff(v0, v1, k);
        tmp && (buf[k] = tmp);
      }
      return Object.keys(buf).length ? buf : false;
    default:
      return `${v1} (${v1 - v0})`;
  }
}
let ss0 = obj;
setInterval(() => {
  const ss1 = obj;
  if (ss1 == ss0) return;
  for(let key of Object.keys(ss1)){
    let tmp = checkDiff(ss0, ss1, key);
    tmp && console.log(key, ':', tmp);
  }
  ss0 = ss1;
}, 100)
