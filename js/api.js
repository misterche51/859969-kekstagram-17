'use strict';
// модуль работы с галереей на главной
(function () {
  /** ссылка на сервер */
  var TIMEOUT = 15000;
  var TIMEOUT_2 = 5;
  var SUCCESS_CODE = 200;
  var URL = 'https://js.dump.academy/kekstagram';


  var createRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
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
    var xhr = createRequest(onSuccess, onError);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = createRequest(onSuccess, onError);
    xhr.timeout = TIMEOUT_2;
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.api = {
    load: load,
    upload: upload,
  };
})();


