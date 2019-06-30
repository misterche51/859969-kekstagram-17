'use strict';
// модуль работы с галереей на главной
(function () {
  /** ссылка на сервер */
  var URL = 'https://js.dump.academy/kekstagram/data';

  window.load = function (onSuccess, onError) {
    /** новый объект XHR */
    var xhr = new XMLHttpRequest();
    //  ожидаемый тип данных с сервера json
    xhr.responseType = 'json';
    //  открываю соединение с севрером с помощью метода GET
    xhr.open('GET', URL);
    // навешиваю обработчик на событие LOAD, если данные пришли с сервера и все хорошо
    // тогда выполняется CB onSuccess с полученными с сервера данными (xhr.response)
    xhr.addEventListener('load' , function () {
      onSuccess(xhr.response);
    });
    // отправляю запрос
    xhr.send();
  };
})();
