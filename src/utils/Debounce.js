/**
 * 防抖——立即执行版
 * 实现原理：
 * 设定一个延时器timer
 * 事件触发执行函数的时候检查一下timer是否存在
 * 若存在，则清除掉该延时器，并在下面为timer赋一个setTimeout(即重新计时)
 * 若不存在，则为定timer赋一个setTimeout异步任务，delay延时后将timer设为null
 *
 */
export const Debounce = (fn, t) => {
  let delay = t || 500;
  // 延时器，timer在闭包中
  let timer;

  return function() {
    let args = arguments;
    if (timer) {
      // 如果有计时器，重新计时
      clearTimeout(timer);
    }

    // 若此刻没有计时器，则立即触发
    let callNow = !timer;

    // delay时延后，timer计时器失效
    timer = setTimeout(() => {
      timer = null;
    }, delay);

    if (callNow) fn.apply(this, args);
  };
};

/**
 * 防抖——非立即执行版，触发时间后，在一定时间后执行
 * function debounce(func, wait) {
 *     let timer;
 *     return function() {
 *       let context = this; // 注意 this 指向
 *       let args = arguments; // arguments中存着e
 *
 *       if (timer) clearTimeout(timer);
 *
 *       timer = setTimeout(() => {
 *         func.apply(this, args)
 *       }, wait)
 *     }
 * }
 */
