;(function(root) {
  function tickShim(fn) {setTimeout(fn, 1);}

  // in node 0.9.0, process.nextTick fired before IO events, but setImmediate did
  // not yet exist. before 0.9.0, process.nextTick between IO events, and after
  // 0.9.0 it fired before IO events. if setImmediate and process.nextTick are
  // both missing fall back to the tick shim.
  var tick =
    (root.process && process.versions && process.versions.node === '0.9.0') ?
    tickShim :
    (root.setImmediate || (root.process && process.nextTick) || tickShim);

  /**
   * Share time while processing an array by iterating through the array and
   * yielding to the event loop after `minTime` has passed, then resuming.
   *
   * @param {Array} array The array to iterate over.
   * @param {Number} minTime The minimum amount of time to iterate for before
   *   yielding.
   * @param {function(*)} fn The function to call for each item in the array.
   * @param {Object=} ctx The context in which to execute the function.
   */
  function timeShare(array, minTime, fn, ctx, callback) {
    if (typeof ctx === 'function') {
      callback = ctx;
      ctx = undefined;
    }

    if (!Array.isArray(array)) {
      throw new TypeError('expected iterator');
    }

    if (typeof fn !== 'function') {
      throw new TypeError('expected iterator function');
    }

    var index = 0, initial = Date.now();

    function next() {
      var start = Date.now();

      while (Date.now() - start < minTime && index < array.length) {
        fn.call(ctx || null, array[index], index, array);
        index++;
      }

      if (index < array.length) {
        tick(next);
      } else if (typeof callback === 'function') {
        // TODO: node-style callback, even if there will never be an error?
        callback(Date.now() - initial);
      }
    }

    next();
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined') {
      exports = module.exports = timeShare;
    }
    exports.timeShare = timeShare;
  } else {
    var previousTimeShare = root.timeShare;

    root.timeShare = timeShare;

    timeShare.noConflict = function() {
      root.timeShare = previousTimeShare;
    };
  }
})(this);
