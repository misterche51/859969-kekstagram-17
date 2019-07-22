'use strict';

(function () {
  var ESC_CODE = 27;

  var pictureOverlay = document.querySelector('.big-picture');
  var pictureImage = pictureOverlay.querySelector('.big-picture__img');
  /** кнопка "загрузить еще комментариев" */
  var buttonMoreComments = pictureOverlay.querySelector('.comments-loader');
  /** блок с комментариями под фотографией */
  var commentsList = pictureOverlay.querySelector('.social__comments');
  /** шаблон комментария */
  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');
  /** кнопка закрыть окно с картинкой */
  var closePictureOverlayButton = pictureOverlay.querySelector('.big-picture__cancel');
  /** функция закрывания окна с картинкой */
  var closePictureOverlay = function () {
    pictureOverlay.classList.add('hidden');
    document.removeEventListener('keydown', escapeKeydownHandler);
    closePictureOverlayButton.removeEventListener('click', closePictureOverlay);

  };

  //  вот этот блок - копипаста из form, я пробовал переписать в модуль, чтобы был коллбек внутри, но не получается пока что
  var escapeKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_CODE && evt.target.type !== 'text') {
      closePictureOverlay();
    }
  };

  /**
  * @description создает фрагмент на странице и наполнять его заполненными клонами
  * @param {Object} item
  */
  var renderPicture = function (item) {
    pictureImage.querySelector('img').src = item.url;
    pictureOverlay.querySelector('.likes-count').textContent = item.likes;
    pictureOverlay.querySelector('.social__caption').textContent = item.description;
    pictureOverlay.querySelector('.comments-count').textContent = item.comments.length;
  };

  var getRandomAvatar = function (min, max) {
    return 'img/avatar-' + window.utils.getRandomNumber(min, max) + '.svg';
  };

  var createComment = function (item) {
    var newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = getRandomAvatar(1, 6);
    newComment.querySelector('.social__text').textContent = item.message;
    return newComment;
  };

  var renderComments = function (item) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < item.comments.length; i++) {
      fragment.appendChild(createComment(item.comments[i]));
      if (item.comments.length <= 5) {
        buttonMoreComments.classList.add('visually-hidden');
      }
    }
    commentsList.appendChild(fragment);
  };


  var renderBigPicture = function (item) {
    renderPicture(item);
    renderComments(item);
    document.addEventListener('keydown', escapeKeydownHandler);
    closePictureOverlayButton.addEventListener('click', closePictureOverlay);
  };


  window.bigpicture = {
    renderBigPicture: renderBigPicture,
  };
})();
