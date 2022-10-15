module.exports = function (min, max) {
  if (max == undefined) {
    max = min;
    min = 0;
  }
  if (max === min) {
    return () => max;
  }
  const arr = Array.from(Array(max - min + 1), (el, i) => i + min);
  let last = max - min + 1;
  return () => {
    last--;
    let i = Math.floor(Math.random() * (last + 1));
    [arr[i], arr[last]] = [arr[last], arr[i]];
    const res = arr[last];
    if (last === 0) last = max - min + 1;
    return res;
  };
};
