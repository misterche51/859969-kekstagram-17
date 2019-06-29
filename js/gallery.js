'use strict';
(function () {

/** контейнер для вставки данных */
  var container = document.querySelector('.pictures');
  var inputPhoto = document.querySelector('#upload-file');
  var pictures = window.createGallery;
  var fragment = window.push.createFragment(pictures);

  inputPhoto.addEventListener('change', window.form.open);
  container.appendChild(fragment);
})();
