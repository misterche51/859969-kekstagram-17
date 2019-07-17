'use strict';
// модуль работы с галереей на главной
(function () {
  /** ссылка на сервер */
  var URL = 'https://js.dump.academy/kekstagram/data';
  var TIMEOUT = 15000;
  var ERROR_CODE = 200;
  var URL_SEND = 'https://js.dump.academy/kekstagram';
  var POST = 'POST';
  var GET = 'GET';


  var ajax = function (requestType, serverUrl, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === ERROR_CODE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мc');
    });

    xhr.timeout = TIMEOUT;
    xhr.open(requestType.toString(), serverUrl);
    xhr.send(data);
  };

  // var load = function (onSuccess, onError) {
  //   /** новый объект XHR */
  //   var xhr = new XMLHttpRequest();
  //   //  ожидаемый тип данных с сервера json
  //   xhr.responseType = 'json';
  //   // навешиваю обработчик на событие LOAD, если данные пришли с сервера и все хорошо
  //   // тогда выполняется CB onSuccess с полученными с сервера данными (xhr.response)
  //   xhr.addEventListener('load', function () {
  //     if (xhr.status === ERROR_CODE) {
  //       onSuccess(xhr.response);
  //     } else {
  //       onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
  //     }
  //   });

  //   xhr.addEventListener('error', function () {
  //     onError('Произошла ошибка соединения');
  //   });

  //   xhr.addEventListener('timeout', function () {
  //     onError('Запрос не успел выполниться за ' + xhr.timeout + 'мc');
  //   });

  //   xhr.timeout = TIMEOUT;
  //   //  открываю соединение с севрером с помощью метода GET
  //   xhr.open('GET', URL);
  //   // отправляю запрос
  //   xhr.send();
  // };

  var load = function (onSuccess, onError) {
    ajax(GET, URL, onSuccess, onError);
  };

  var upload = function (data, onSuccess, onError) {
    ajax(POST, URL_SEND, onSuccess, onError, data);
  };

  window.api = {
    load: load,
    upload: upload,
  };
})();
