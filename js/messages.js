'use strict';

(function () {
  var ESC_CODE = 27;
  var mainContainer = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');

  var renderMessage = function (template) {
    mainContainer.insertBefore(template, mainContainer.firstChild);
  };

  var formSendHandler = function (resultTemplate, form) {
    form.classList.add('hidden');
    renderMessage(resultTemplate);
    var closeMessage = function () {
      mainContainer.removeChild(mainContainer.firstChild);
    };
    var overlay = document.querySelector('section');
    var messageBox = overlay.querySelector('div');
    var headline = overlay.querySelector('h2');
    var button = mainContainer.firstChild.querySelectorAll('button');
    for (var i = 0; i < button.length; i++) {
      button[i].addEventListener('click', closeMessage);
    }
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_CODE) {
        closeMessage();
      }
    });
    overlay.addEventListener('click', function (evt) {
      if (evt.target !== messageBox && evt.target !== headline) {
        closeMessage();
      }
    });
  };


  window.sendmessage = function (evt, form, eventBox) {
    window.api.upload(new FormData(form),
        function () {
          formSendHandler(successTemplate, eventBox);
        },
        function () {
          formSendHandler(errorTemplate, eventBox);
        }
    );
    evt.preventDefault();
  };
})();
