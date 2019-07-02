'use strict';
// модуль работы с галереей на главной
(function () {

  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');
  /** section с button-ами фильтров галереи */
  var filters = document.querySelector('.img-filters');





  /** массив для копирования данных с сервера */
  var galleryItems = [];
  /**
  * @param {Array} data -- данные с сервера в формате массива объектов
  */
  var successHandler = function (data) {
    // копирую данные для дальнейшей обработки
    galleryItems = data;
    window.render(galleryItems);
    // показываю интерфейс выбора фильтров отображения в галерее
    filters.classList.remove('img-filters--inactive');
  };

  var updateGallery = function (evt) {

    /** массив с последними фотографиями (10 рандомных !!НЕПОВТОРЯЮЩИХСЯ) */
    var newestItems = galleryItems
      .slice()
      .sort(function (){return 0.5 - Math.random();})
      .splice(0, 10);

    var hottestItems = galleryItems
      .slice()
      .sort(function (a,b){
        return b.comments.length - a.comments.length;
      });

      var idToRenderGallery = {
        'popular': galleryItems,
        'new': newestItems,
        'discussed': hottestItems
      };
      // console.log(idToRenderGallery[evt.target.id.slice(7)]);
      window.render(idToRenderGallery[evt.target.id.slice(7)]);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; padding: 50px 0;text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.api.load(successHandler, errorHandler);
  // навешиваемся на кнопку, чтобы открыть форму изменения загружаемого фото
  inputPhoto.addEventListener('change', window.form.open);


  var filtrationHandler = function (evt) {
    if (evt.target.type === 'button') {
      updateGallery(evt);
      evt.preventDefault();
    }
  };
  filters.addEventListener('click', filtrationHandler);


})();
