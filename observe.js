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
