'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');
  var previewBox = document.querySelector('.img-upload__preview');
  var downloadedPhotoPreview = previewBox.querySelector('img');

  window.downloadPhotoPreview = function () {
    var file = inputPhoto.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        downloadedPhotoPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };
})();
