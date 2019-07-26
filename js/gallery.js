'use strict';
// модуль работы с галереей на главной
(function () {
  /** кнопки фильтров */
  var buttons = document.querySelectorAll('.img-filters__button');
  /** кнопка загрузки нового изображения */
  var inputPhoto = document.querySelector('#upload-file');
  /** section с button-ами фильтров галереи */
  var filters = document.querySelector('.img-filters');
  var pictureOverlay = document.querySelector('.overlay');
  var gallery = document.querySelector('.pictures');
  /** массив для копирования данных с сервера */
  var galleryItems = [];
  var currentGalleryItems;


  /** сбрасывает стиль активности со всех батонов */
  var dropActiveStyle = function () {
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('img-filters__button--active');
    }
  };
  /** функция описывается работу фильтров галереи
   * @param {evt} evt
   */
  var filtrationHandler = function (evt) {
    if (evt.target.type === 'button') {
      window.utils.debounceHandler(function () {
        updateGallery(evt);
      });
      dropActiveStyle();
      evt.target.classList.add('img-filters__button--active');
      evt.preventDefault();
    }
  };

  //  ----------------  блок сортировки  ---------------------------

  /** правило сортировки по комментариям
  * @param {Array} a массив
  * @param {Array} b массив
  * @return {Number}
  */
  var sortingByComments = function (a, b) {
    return b.comments.length - a.comments.length;
  };
  /** Функция создает массив с последними фотографиями (10 рандомных неповторяющихся)
   * @param {Array} arr
   * @return {Array}
  */
  var getNewestItems = function (arr) {
    return window.utils.getShuffleArray(arr).slice(0, 10);
  };
  /** Функция создает отсортированный массив по количеству комменатриев
   * @param {Array} arr
   * @return {Array}
  */
  var getHottestItems = function (arr) {
    return arr.slice(0).sort(sortingByComments);
  };
  /** мапа для реализации отображения нужной галереи в зависимости от выбранного фильтпа */
  var idToRenderGallery = {
    'new': getNewestItems,
    'discussed': getHottestItems
  };

  //  --------------------------------------------------

  /** очищает галерею от всех фотографий */
  var deletePictures = function () {
    var pictures = document.querySelectorAll('.picture');
    for (var i = 0; i < pictures.length; i++) {
      pictures[i].remove();
    }
  };
  /**
   * функция выполняется при успешной загрузке данных с сервера
  * @param {Array} data -- данные с сервера в формате массива объектов
  */
  var successHandler = function (data) {
    // копирую данные для дальнейшей обработки
    galleryItems = data;
    currentGalleryItems = galleryItems;
    window.render(currentGalleryItems);
    // показываю интерфейс выбора фильтров отображения в галерее
    filters.classList.remove('img-filters--inactive');
  };
  /** функция обновления галереи при клике по фильтру
   * @param {evt} evt
  */
  var updateGallery = function (evt) {
    deletePictures();
    /** название фильтра, получаемое из id */
    var filterName = evt.target.id.slice(7);
    currentGalleryItems = filterName === 'popular'
      ? galleryItems
      : idToRenderGallery[filterName](galleryItems);

    window.render(currentGalleryItems);
  };
  /** функция выполняется при неполадке во взаимодействии с сервером
   * @param {errorMessage} errorMessage
   */
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

  var galleryItemClickHandler = function (evt) {
    var isPicture = evt.target.classList.contains('picture__img');
    if (isPicture) {
      var index = evt.target.dataset.index;
      pictureOverlay.classList.remove('hidden');
      window.bigpicture.renderBigPicture(currentGalleryItems[index]);
    }

  };


  window.api.load(successHandler, errorHandler);
  // навешиваемся на кнопку, чтобы открыть форму изменения загружаемого фото
  inputPhoto.addEventListener('change', window.form.open);
  //  навешиваемся на секшн, чтобы запустить работу фильтров при клике
  filters.addEventListener('click', filtrationHandler);
  gallery.addEventListener('click', galleryItemClickHandler);
})();
