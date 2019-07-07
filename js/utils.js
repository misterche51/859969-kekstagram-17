'use strict';
(function () {
  /** вспомогательная переменная для debounceHandler */
  var lastTimeout;
  var TIMEOUT_VALUE = 500;
  /** функция удаления дребезжания
 * @param {callback} f
 */
  var debounceHandler = function (f) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      f();
    }, TIMEOUT_VALUE);
  };

  /** функция перемешивания массива
   * @param {Array} arr
   * @return {Array} перемешанный массив
   */
  var shuffle = function (arr) {
    //  копируем массив для обработки
    var shuffledArr = arr.slice(0);
    var j;
    var temp;
    for (var i = shuffledArr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = shuffledArr[j];
      shuffledArr[j] = shuffledArr[i];
      shuffledArr[i] = temp;
    }
    return shuffledArr;
  };

  var randomizer = function (min, max) {
    return Math.floor(Math.random() * (max)) + min;
  };


  window.utils = {
    debounceHandler: debounceHandler,
    shuffle: shuffle,
    randomizer: randomizer,
  };
})();
