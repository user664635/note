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

let ss0 = obj;
setInterval(() => {
  const ss1 = obj;
  Object.keys(ss1).forEach(key => {
    v0 = ss0[key];
    v1 = ss1[key];
    typeof v0 == 'number' && typeof v1 == 'number' && v1 - v0 &&
    console.log(`${key} : ${v1} (${v1 - v0})`);
  });
  ss0 = ss1;
}, 100);
