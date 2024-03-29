'use strict';
(function () {
  var TIMEOUT_VALUE = 500;
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;


  /** вспомогательная переменная для debounceHandler */
  var lastTimeout;
  /** функция удаления дребезжания
 * @param {callback} callback
 */
  var debounceHandler = function (callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      callback();
    }, TIMEOUT_VALUE);
  };

  /** функция перемешивания массива
   * @param {Array} arr
   * @return {Array} перемешанный массив
   */
  var getShuffleArray = function (arr) {
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

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max)) + min;
  };

  var isEscPressed = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var isEnterPressed = function (evt) {
    return evt.keyCode === ENTER_KEYCODE;
  };

  window.utils = {
    debounceHandler: debounceHandler,
    getShuffleArray: getShuffleArray,
    getRandomNumber: getRandomNumber,
    isEscPressed: isEscPressed,
    isEnterPressed: isEnterPressed,
  };
})();
