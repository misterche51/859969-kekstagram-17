'use strict';
//  Модуль для открыть/закрыть
(function () {
  /** разрешенная длиная текста */
  var ALLOWED_TEXT_LENGHT = 140;
  /**
   * в завиисимости от разрешенной длины текста меняет цвет поля
   * @param {Element} element ссылка на dom-элемент
   */
  var textLenghtValidation = function (element) {
    if (element.value.length === ALLOWED_TEXT_LENGHT) {
      element.style.background = 'red';
    } else {
      element.removeAttribute('style');
    }
  };

/** закрытие при нажатии на esc
 * @param {evt} evt
 * @param {FunctionName} что-то должно произойти
*/
var escapeKeydownHandler = function (evt, action) {
  if (evt.keyCode === 27 && evt.target.type !== 'textarea') {
    action();
  }
};

  window.helper = {
    isTextAreaLenghtValid:textLenghtValidation,
    pressEscape:escapeKeydownHandler,
  };

})();
