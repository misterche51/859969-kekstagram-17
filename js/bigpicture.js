'use strict';

(function () {
  var picture = document.querySelector('.big-picture');
  var pictureBox = picture.querySelector('.big-picture__img');
  var buttonMoreComments = picture.querySelector('.comments-loader');
  var commentsList = document.querySelector('.social__comments');
  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');


  //  вот этот блок - копипаста из form, я пробовал переписать в модуль, чтобы был коллбек внутри, но не получается пока что
  var escapeKeydownHandler = function (evt) {
    if (evt.keyCode === 27 && evt.target.type !== 'text') {
      picture.classList.add('hidden');
    }
  };

  /**
  * @description создает фрагмент на странице и наполнять его заполненными клонами
  * @param {Object} data
  */
  var renderPicture = function (data) {
    var item = data[0];
    pictureBox.querySelector('img').src = item.url;
    picture.querySelector('.likes-count').textContent = item.likes;
    picture.querySelector('.social__caption').textContent = item.description;
  };

  var randomAvatar = function (min, max) {
    return 'img/avatar-' + window.utils.randomizer(min, max) + '.svg';
  };

  var renderComment = function (data) {
    var newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = randomAvatar(1, 6);
    newComment.querySelector('.social__text').textContent = data.message;
    return newComment;
  };

  var renderizeHandler = function (data) {
    var item = data[0];
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < item.comments.length; i++) {
      fragment.appendChild(renderComment(item.comments[i]));
    }
    commentsList.appendChild(fragment);
  };


  document.addEventListener('keydown', escapeKeydownHandler);
  buttonMoreComments.classList.add('visually-hidden');
  picture.classList.remove('hidden');
  window.api.load(renderPicture);
  window.api.load(renderizeHandler);

})();
