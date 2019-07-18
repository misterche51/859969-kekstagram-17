'use strict';
// модуль работы с галереей на главной
(function () {
  /** ссылка на сервер */
  var URL = 'https://js.dump.academy/kekstagram/data';
  var TIMEOUT = 15000;
  var ERROR_CODE = 200;
  var URL_SEND = 'https://js.dump.academy/kekstagram';


  var ajax = function (onSuccess, onError) {
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

    return xhr;
  };

  var load = function (onSuccess, onError) {
    var xhr = ajax(onSuccess, onError);
    xhr.open('GET', URL);
    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = ajax(onSuccess, onError);
    xhr.open('POST', URL_SEND);
    xhr.send(data);
  };

  window.api = {
    load: load,
    upload: upload,
  };
})();
